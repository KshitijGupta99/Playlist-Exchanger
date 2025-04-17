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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } = process.env;
class ConverterService {
    static getSpotifyTracks(playlistId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                });
                if (!res.ok) {
                    throw new Error("Failed to fetch Spotify tracks");
                }
                const data = yield res.json();
                return data.items.map((item) => {
                    const track = item.track;
                    return `${track.name} ${track.artists.map((a) => a.name).join(" ")}`;
                });
            }
            catch (error) {
                console.error("Error fetching Spotify tracks:", error);
                throw error;
            }
        });
    }
    static createYouTubePlaylist(title, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet,status`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    snippet: {
                        title: title,
                        description: "Converted from Spotify",
                    },
                    status: { privacyStatus: "private" },
                }),
            });
            const data = yield res.json();
            return data.id;
        });
    }
    // services/conversionService.js
    static searchAndAddToYoutube(track, playlistId, youtubeAccessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Search for the track on YouTube
                const query = track;
                const searchRes = yield fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1`, {
                    headers: {
                        Authorization: `Bearer ${youtubeAccessToken}`,
                        Accept: "application/json",
                    },
                });
                const searchData = yield searchRes.json();
                if (!searchData.items || searchData.items.length === 0) {
                    console.warn(`❌ No result found for: ${query}`);
                    return;
                }
                console.log(`✅ Found video for ${query}:`, searchData.items[0].snippet.title);
                const videoId = searchData.items[0].id.videoId;
                // Add the found video to the playlist
                const insertRes = yield fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${youtubeAccessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        snippet: {
                            playlistId,
                            resourceId: {
                                kind: "youtube#video",
                                videoId,
                            },
                        },
                    }),
                });
                const insertData = yield insertRes.json();
                if (insertRes.ok) {
                    console.log(`✅ Added ${query} to YouTube playlist`);
                }
                else {
                    console.error("❌ Failed to add to playlist:", insertData);
                }
            }
            catch (err) {
                console.error("❌ Error in searchAndAddToYouTubePlaylist:", err);
            }
        });
    }
    static getYoutubeVideos(playlistId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                });
                if (!res.ok) {
                    throw new Error("Failed to fetch Youtube videos");
                }
                if (res.status === 404) {
                    throw new Error("Playlist not found");
                }
                if (res.status === 403) {
                    throw new Error("Access forbidden to the playlist");
                }
                if (res.status === 401) {
                    throw new Error("Unauthorized access to the playlist");
                }
                if (res.status === 500) {
                    throw new Error("Internal server error while fetching playlist items");
                }
                if (res.status === 429) {
                    throw new Error("Quota exceeded for YouTube API requests");
                }
                if (res.status === 400) {
                    throw new Error("Bad request to YouTube API");
                }
                if (res.status === 408) {
                    throw new Error("Request timeout while fetching playlist items");
                }
                const data = yield res.json();
                if (!data.items || data.items.length === 0) {
                    throw new Error("No videos found in the playlist");
                }
                return data.items.map((item) => {
                    const video = item.snippet;
                    return `${video.title} ${video.channelTitle}`;
                });
            }
            catch (error) {
                console.error("Error fetching YouTube videos:", error);
                throw error;
            }
        });
    }
    ;
    static createSpotifyPlaylist(title, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield fetch(`https://api.spotify.com/v1/me/playlists`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: title,
                        public: false,
                    }),
                });
                if (!res.ok) {
                    throw new Error("Failed to create Spotify playlist");
                }
                const data = yield res.json();
                return data.id;
            }
            catch (error) {
                console.error("Error creating Spotify playlist:", error);
                throw error;
            }
        });
    }
    static searchAndAddToSpotify(track, playlistId, spotifyAccessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Search for the track on Spotify
                const query = track;
                const searchRes = yield fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`, {
                    headers: {
                        Authorization: `Bearer ${spotifyAccessToken}`,
                        Accept: "application/json",
                    },
                });
                const searchData = yield searchRes.json();
                if (!searchData.tracks || searchData.tracks.items.length === 0) {
                    console.warn(`❌ No result found for: ${query}`);
                    return;
                }
                console.log(`✅ Found track for ${query}:`, searchData.tracks.items[0].name);
                const trackId = searchData.tracks.items[0].id;
                // Add the found track to the playlist
                const insertRes = yield fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${spotifyAccessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        uris: [`spotify:track:${trackId}`],
                    }),
                });
                const insertData = yield insertRes.json();
                if (insertRes.ok) {
                    console.log(`✅ Added ${query} to Spotify playlist`);
                }
                else {
                    console.error("❌ Failed to add to playlist:", insertData);
                }
            }
            catch (err) {
                console.error("❌ Error in searchAndAddToSpotifyPlaylist:", err);
            }
        });
    }
}
exports.default = ConverterService;
