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
exports.createSpotifyPlaylist = exports.getYouTubeTracks = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { YOUTUBE_TOKEN, SPOTIFY_TOKEN, SPOTIFY_USER_ID } = process.env;
if (!YOUTUBE_TOKEN || !SPOTIFY_TOKEN || !SPOTIFY_USER_ID) {
    throw new Error("Missing required environment variables: YOUTUBE_TOKEN, SPOTIFY_TOKEN, or SPOTIFY_USER_ID");
}
// Fetch tracks from a YouTube playlist
const getYouTubeTracks = (playlistId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const res = yield axios_1.default.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50`, {
            headers: { Authorization: `Bearer ${YOUTUBE_TOKEN}` },
        });
        const data = res.data;
        if (!data.items || data.items.length === 0) {
            throw new Error("No tracks found in the YouTube playlist");
        }
        return data.items.map((item) => item.snippet.title);
    }
    catch (error) {
        console.error("Error fetching YouTube tracks:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        throw new Error("Failed to fetch YouTube tracks");
    }
});
exports.getYouTubeTracks = getYouTubeTracks;
// Create a Spotify playlist and add tracks
const createSpotifyPlaylist = (name, trackNames) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        // 1. Create Spotify playlist
        const createRes = yield axios_1.default.post(`https://api.spotify.com/v1/users/${SPOTIFY_USER_ID}/playlists`, {
            name: name,
            description: "Converted from YouTube",
            public: false,
        }, {
            headers: {
                Authorization: `Bearer ${SPOTIFY_TOKEN}`,
                "Content-Type": "application/json",
            },
        });
        const playlistId = createRes.data.id;
        if (!playlistId) {
            throw new Error("Failed to create Spotify playlist");
        }
        const uris = [];
        // 2. Search each track and collect URIs
        for (const query of trackNames) {
            const searchRes = yield axios_1.default.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`, {
                headers: { Authorization: `Bearer ${SPOTIFY_TOKEN}` },
            });
            const uri = (_c = (_b = (_a = searchRes.data.tracks) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.uri;
            if (uri)
                uris.push(uri);
        }
        // 3. Add all found tracks to the new playlist
        yield axios_1.default.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, { uris }, {
            headers: {
                Authorization: `Bearer ${SPOTIFY_TOKEN}`,
                "Content-Type": "application/json",
            },
        });
        return `https://open.spotify.com/playlist/${playlistId}`;
    }
    catch (error) {
        console.error("Error creating Spotify playlist:", ((_d = error.response) === null || _d === void 0 ? void 0 : _d.data) || error.message);
        throw new Error("Failed to create Spotify playlist");
    }
});
exports.createSpotifyPlaylist = createSpotifyPlaylist;
