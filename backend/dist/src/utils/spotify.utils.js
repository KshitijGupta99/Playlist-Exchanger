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
exports.getSpotifyTracks = exports.createYouTubePlaylist = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { SPOTIFY_TOKEN, YOUTUBE_TOKEN } = process.env;
if (!SPOTIFY_TOKEN || !YOUTUBE_TOKEN) {
    throw new Error("Missing required environment variables: SPOTIFY_TOKEN or YOUTUBE_TOKEN");
}
const createYouTubePlaylist = (name, trackNames) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        // 1. Create YouTube playlist
        const createRes = yield axios_1.default.post(`https://www.googleapis.com/youtube/v3/playlists?part=snippet,status`, {
            snippet: { title: name, description: "Converted from Spotify" },
            status: { privacyStatus: "private" },
        }, {
            headers: {
                Authorization: `Bearer ${YOUTUBE_TOKEN}`,
                "Content-Type": "application/json",
            },
        });
        const playlistId = createRes.data.id;
        // 2. Add each track by searching on YouTube
        for (const query of trackNames) {
            const searchRes = yield axios_1.default.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=1&type=video`, {
                headers: { Authorization: `Bearer ${YOUTUBE_TOKEN}` },
            });
            const videoId = (_c = (_b = (_a = searchRes.data.items) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.videoId;
            if (videoId) {
                yield axios_1.default.post(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet`, {
                    snippet: {
                        playlistId: playlistId,
                        resourceId: {
                            kind: "youtube#video",
                            videoId: videoId,
                        },
                    },
                }, {
                    headers: {
                        Authorization: `Bearer ${YOUTUBE_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                });
            }
        }
        return `https://www.youtube.com/playlist?list=${playlistId}`;
    }
    catch (error) {
        console.error("Error creating YouTube playlist:", ((_d = error.response) === null || _d === void 0 ? void 0 : _d.data) || error.message);
        throw new Error("Failed to create YouTube playlist");
    }
});
exports.createYouTubePlaylist = createYouTubePlaylist;
const getSpotifyTracks = (playlistId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const res = yield axios_1.default.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: { Authorization: `Bearer ${SPOTIFY_TOKEN}` },
        });
        return res.data.items.map((item) => {
            const track = item.track;
            return `${track.name} ${track.artists[0].name}`;
        });
    }
    catch (error) {
        console.error("Error fetching Spotify tracks:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        throw new Error("Failed to fetch Spotify tracks");
    }
});
exports.getSpotifyTracks = getSpotifyTracks;
