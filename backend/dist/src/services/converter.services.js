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
}
exports.default = ConverterService;
