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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } = process.env;
if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REDIRECT_URI) {
    throw new Error("Missing required Spotify environment variables");
}
class ConverterService {
    // Fetch tracks from a Spotify playlist
    static getSpotifyTracks(playlistId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const res = yield axios_1.default.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                return res.data.items.map((item) => {
                    const track = item.track;
                    return `${track.name} ${track.artists.map((a) => a.name).join(" ")}`;
                });
            }
            catch (error) {
                console.error("Error fetching Spotify tracks:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                throw new Error("Failed to fetch Spotify tracks");
            }
        });
    }
    // Create a YouTube playlist
    static createYouTubePlaylist(title, token) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const res = yield axios_1.default.post(`https://www.googleapis.com/youtube/v3/playlists?part=snippet,status`, {
                    snippet: {
                        title,
                        description: "Converted from Spotify",
                    },
                    status: { privacyStatus: "private" },
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                return res.data.id;
            }
            catch (error) {
                console.error("Error creating YouTube playlist:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                throw new Error("Failed to create YouTube playlist");
            }
        });
    }
    // Search and add a track to a YouTube playlist
    static searchAndAddToYoutube(track, playlistId, youtubeAccessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const searchRes = yield axios_1.default.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(track)}&type=video&maxResults=1`, {
                    headers: {
                        Authorization: `Bearer ${youtubeAccessToken}`,
                    },
                });
                const searchData = searchRes.data;
                if (!searchData.items || searchData.items.length === 0) {
                    console.warn(`❌ No result found for: ${track}`);
                    return;
                }
                const videoId = searchData.items[0].id.videoId;
                yield axios_1.default.post(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet`, {
                    snippet: {
                        playlistId,
                        resourceId: {
                            kind: "youtube#video",
                            videoId,
                        },
                    },
                }, {
                    headers: {
                        Authorization: `Bearer ${youtubeAccessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                console.log(`✅ Added ${track} to YouTube playlist`);
            }
            catch (error) {
                console.error("❌ Error in searchAndAddToYoutube:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                throw new Error("Failed to add track to YouTube playlist");
            }
        });
    }
    // Fetch videos from a YouTube playlist
    static getYoutubeVideos(playlistId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const res = yield axios_1.default.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.data.items || res.data.items.length === 0) {
                    throw new Error("No videos found in the playlist");
                }
                return res.data.items.map((item) => {
                    const video = item.snippet;
                    return { title: video.title, id: item.id };
                });
            }
            catch (error) {
                console.error("Error fetching YouTube videos:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                throw new Error("Failed to fetch YouTube videos");
            }
        });
    }
    // Create a Spotify playlist
    static createSpotifyPlaylist(title, token) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const res = yield axios_1.default.post(`https://api.spotify.com/v1/me/playlists`, {
                    name: title,
                    public: false,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                return res.data.id;
            }
            catch (error) {
                console.error("Error creating Spotify playlist:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                throw new Error("Failed to create Spotify playlist");
            }
        });
    }
    // Search and add a track to a Spotify playlist
    static searchAndAddToSpotify(track, playlistId, spotifyAccessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const searchRes = yield axios_1.default.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(track)}&type=track&limit=1`, {
                    headers: {
                        Authorization: `Bearer ${spotifyAccessToken}`,
                    },
                });
                const searchData = searchRes.data;
                if (!searchData.tracks || searchData.tracks.items.length === 0) {
                    console.warn(`❌ No result found for: ${track}`);
                    return;
                }
                const trackId = searchData.tracks.items[0].id;
                yield axios_1.default.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                    uris: [`spotify:track:${trackId}`],
                }, {
                    headers: {
                        Authorization: `Bearer ${spotifyAccessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                console.log(`✅ Added ${track} to Spotify playlist`);
            }
            catch (error) {
                console.error("❌ Error in searchAndAddToSpotify:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                throw new Error("Failed to add track to Spotify playlist");
            }
        });
    }
}
exports.default = ConverterService;
