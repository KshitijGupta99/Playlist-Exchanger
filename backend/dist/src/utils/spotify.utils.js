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
// Make sure to retrieve token from env/localStorage securely
const SPOTIFY_TOKEN = process.env.SPOTIFY_TOKEN;
exports.createYouTubePlaylist = (name, trackNames) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    // 1. Create YouTube playlist
    const createRes = yield fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet,status`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${YOUTUBE_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            snippet: { title: name, description: "Converted from Spotify" },
            status: { privacyStatus: "private" },
        }),
    });
    const createData = yield createRes.json();
    const playlistId = createData.id;
    // 2. Add each track by searching on YouTube
    for (const query of trackNames) {
        const searchRes = yield fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=1&type=video`, {
            headers: { Authorization: `Bearer ${YOUTUBE_TOKEN}` },
        });
        const searchData = yield searchRes.json();
        const videoId = (_c = (_b = (_a = searchData.items) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.videoId;
        if (videoId) {
            yield fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${YOUTUBE_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    snippet: {
                        playlistId: playlistId,
                        resourceId: {
                            kind: "youtube#video",
                            videoId: videoId,
                        },
                    },
                }),
            });
        }
    }
    return `https://www.youtube.com/playlist?list=${playlistId}`;
});
exports.getSpotifyTracks = (playlistId) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: { Authorization: `Bearer ${SPOTIFY_TOKEN}` }
    });
    const data = yield res.json();
    return data.items.map(item => {
        const track = item.track;
        return `${track.name} ${track.artists[0].name}`;
    });
});
