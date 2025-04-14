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
const fetch = require("node-fetch");
const YOUTUBE_TOKEN = process.env.YOUTUBE_TOKEN;
exports.getYouTubeTracks = (playlistId) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50`, {
        headers: { Authorization: `Bearer ${YOUTUBE_TOKEN}` }
    });
    const data = yield res.json();
    return data.items.map(item => item.snippet.title);
});
const SPOTIFY_TOKEN = process.env.SPOTIFY_TOKEN;
const SPOTIFY_USER_ID = process.env.SPOTIFY_USER_ID;
exports.createSpotifyPlaylist = (name, trackNames) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    // 1. Create Spotify playlist
    const createRes = yield fetch(`https://api.spotify.com/v1/users/${SPOTIFY_USER_ID}/playlists`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${SPOTIFY_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            description: "Converted from YouTube",
            public: false,
        }),
    });
    const createData = yield createRes.json();
    const playlistId = createData.id;
    const uris = [];
    // 2. Search each track and collect URIs
    for (const query of trackNames) {
        const searchRes = yield fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`, {
            headers: { Authorization: `Bearer ${SPOTIFY_TOKEN}` },
        });
        const searchData = yield searchRes.json();
        const uri = (_c = (_b = (_a = searchData.tracks) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.uri;
        if (uri)
            uris.push(uri);
    }
    // 3. Add all found tracks to the new playlist
    yield fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${SPOTIFY_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris }),
    });
    return `https://open.spotify.com/playlist/${playlistId}`;
});
