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
            try {
                const playlist = req.body;
                const spotifyToken = req.headers["spotify-token"];
                const youtubeToken = req.headers["youtube-token"];
                if (!accessToken || !playlist) {
                    return res
                        .status(400)
                        .json({ error: "Missing token or playlist data" });
                }
                let result;
                if (playlist.platform === "spotify") {
                    // Converting from Spotify to YouTube
                    result = yield this.convertSpotifyToYouTube(playlist, spotifyToken, youtubeToken);
                }
                else {
                    // Converting from YouTube to Spotify
                    result = yield this.convertYouTubeToSpotify(playlist, youtubeToken, spotifyToken);
                }
                res.status(200).json({ message: "Conversion complete ✅", result });
            }
            catch (err) {
                console.error("❌ Conversion Error:", err);
                res.status(500).json({ error: "Server error during conversion" });
            }
        });
        this.convertSpotifyToYouTube = (spotifyPlaylistId, spotifyToken, youtubeToken) => __awaiter(this, void 0, void 0, function* () {
            const tracks = yield services_1.ConverterService.getSpotifyTracks(spotifyPlaylistId, spotifyToken);
            const playlistTitle = `Converted from Spotify - ${Date.now()}`;
            const playlistId = yield services_1.ConverterService.createYouTubePlaylist(playlistTitle, youtubeToken);
            for (const track of tracks) {
                const query = `${track.name} ${track.artists.join(' ')}`;
                yield services_1.ConverterService.searchAndAddToYoutube(query, playlistId, youtubeToken);
            }
            return { success: true, message: 'Converted to YouTube', playlistId };
        });
        this.convertYouTubeToSpotify = (youtubePlaylistId, youtubeToken, spotifyToken) => __awaiter(this, void 0, void 0, function* () {
            const videos = yield services_1.ConverterService.getYoutubeVideos(youtubePlaylistId, youtubeToken);
            const playlistName = `Converted from YouTube - ${Date.now()}`;
            const playlistId = yield services_1.ConverterService.createSpotifyPlaylist(playlistName, spotifyToken);
            for (const video of videos) {
                const query = video.title;
                yield services_1.ConverterService.searchAndAddToSpotify(query, playlistId, spotifyToken);
            }
            return { success: true, message: 'Converted to Spotify', playlistId };
        });
        this.ConvertService = new services_1.ConverterService();
    }
}
exports.default = ConverterController;
