"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
class ConverterController {
    constructor() {
        this.convert = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            try {
                const playlist = req.body;
                const spotifyRawToken = req.headers["spotify-token"];
                const youtubeRawToken = req.headers["youtube-token"];
                const spotifyToken = this.normalizeToken(spotifyRawToken);
                const youtubeToken = this.normalizeToken(youtubeRawToken);
                if (!spotifyToken || !youtubeToken || !playlist) {
                    res.status(400).json({ error: "Missing token or playlist data" });
                    return;
                }
                if (!playlist.id || (playlist.platform !== "spotify" && playlist.platform !== "youtube")) {
                    res.status(400).json({ error: "Invalid playlist data" });
                    return;
                }
                let result;
                if (playlist.platform === "spotify") {
                    if (!playlist.name) {
                        res.status(400).json({ error: "Spotify playlist name is missing" });
                        return;
                    }
                    // Spotify → YouTube
                    result = yield this.convertSpotifyToYouTube(playlist.name, playlist.id, spotifyToken, youtubeToken);
                }
                else {
                    const youtubePlaylist = playlist;
                    if (!((_a = youtubePlaylist.snippet) === null || _a === void 0 ? void 0 : _a.title)) {
                        res.status(400).json({ error: "YouTube playlist title is missing" });
                        return;
                    }
                    // YouTube → Spotify
                    result = yield this.convertYouTubeToSpotify(youtubePlaylist.snippet.title, playlist.id, youtubeToken, spotifyToken);
                }
                res.status(200).json({ message: "Conversion complete ✅", result });
            }
            catch (err) {
                const error = err;
                const upstreamError = (_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.error;
                const upstreamMessage = typeof upstreamError === "string"
                    ? upstreamError
                    : (upstreamError === null || upstreamError === void 0 ? void 0 : upstreamError.message) || ((_e = (_d = upstreamError === null || upstreamError === void 0 ? void 0 : upstreamError.errors) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.message);
                const reason = typeof upstreamError === "string"
                    ? undefined
                    : (upstreamError === null || upstreamError === void 0 ? void 0 : upstreamError.status) || ((_g = (_f = upstreamError === null || upstreamError === void 0 ? void 0 : upstreamError.errors) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.reason);
                const status = (_h = error.response) === null || _h === void 0 ? void 0 : _h.status;
                const operation = error.operation;
                console.error("❌ Conversion Error:", {
                    status,
                    reason,
                    operation,
                    message: upstreamMessage || error.message || err,
                });
                const detail = reason === "quotaExceeded"
                    ? "YouTube API quota is exhausted. Enable YouTube Data API quota or try again tomorrow."
                    : status === 401
                        ? "One of the access tokens has expired. Sign in to Spotify and YouTube again."
                        : status === 403 && (operation === null || operation === void 0 ? void 0 : operation.startsWith("YouTube"))
                            ? "YouTube rejected the write. Sign out, connect YouTube again to grant playlist-management access, and verify YouTube Data API v3 is enabled."
                            : status === 403 && (operation === null || operation === void 0 ? void 0 : operation.startsWith("Spotify"))
                                ? "Spotify rejected the write. Sign out, connect Spotify again to grant playlist-modify access, and retry the conversion."
                                : status === 403
                                    ? "The provider rejected this action. Check the account permissions and API access."
                                    : upstreamMessage || error.message || "Server error during conversion";
                res.status(((_j = error.response) === null || _j === void 0 ? void 0 : _j.status) && error.response.status >= 400 ? 502 : 500).json({
                    error: detail,
                    providerStatus: status,
                    providerReason: reason,
                    providerMessage: upstreamMessage,
                    operation,
                });
            }
        });
        this.normalizeToken = (token) => {
            if (typeof token !== "string")
                return null;
            const normalized = token.trim().replace(/^"|"$/g, "");
            return normalized || null;
        };
        this.convertSpotifyToYouTube = (title, spotifyPlaylistId, spotifyToken, youtubeToken) => __awaiter(this, void 0, void 0, function* () {
            const tracks = yield services_1.ConverterService.getSpotifyTracks(spotifyPlaylistId, spotifyToken);
            if (tracks.length === 0) {
                return { success: false, message: "No tracks found in Spotify playlist" };
            }
            const playlistTitle = `${title} (Converted from Spotify - ${Date.now()})`;
            const playlistId = yield services_1.ConverterService.createYouTubePlaylist(playlistTitle, youtubeToken);
            for (const track of tracks) {
                yield services_1.ConverterService.searchAndAddToYoutube(track, playlistId, youtubeToken);
            }
            return { success: true, message: "Converted to YouTube", playlistId };
        });
        this.convertYouTubeToSpotify = (title, youtubePlaylistId, youtubeToken, spotifyToken) => __awaiter(this, void 0, void 0, function* () {
            const videos = yield services_1.ConverterService.getYoutubeVideos(youtubePlaylistId, youtubeToken);
            if (!videos || videos.length === 0) {
                return { success: false, message: "No videos found in YouTube playlist" };
            }
            const playlistName = `${title} (Converted from YouTube - ${Date.now()})`;
            const playlistId = yield services_1.ConverterService.createSpotifyPlaylist(playlistName, spotifyToken);
            for (const video of videos) {
                yield services_1.ConverterService.searchAndAddToSpotify(video.title, playlistId, spotifyToken);
            }
            return { success: true, message: "Converted to Spotify", playlistId };
        });
        this.ConvertService = new services_1.ConverterService();
    }
}
exports.default = ConverterController;
