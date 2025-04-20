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
class SpotifyService {
    static getAuthUrl() {
        const scopes = "playlist-read-private playlist-modify-public playlist-modify-private";
        return `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${SPOTIFY_REDIRECT_URI}&scope=${encodeURIComponent(scopes)}`;
    }
    static exchangeCodeForToken(code) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!code) {
                throw new Error("Authorization code is missing!");
            }
            if (!SPOTIFY_REDIRECT_URI || !SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
                throw new Error("Missing Spotify environment variables");
            }
            const response = yield axios_1.default.post("https://accounts.spotify.com/api/token", new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: SPOTIFY_REDIRECT_URI,
                client_id: SPOTIFY_CLIENT_ID,
                client_secret: SPOTIFY_CLIENT_SECRET,
            }).toString(), {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });
            const { access_token } = response.data;
            if (!access_token) {
                throw new Error("Access token is missing in the response!");
            }
            // Fetch user data using the access token
            const userResponse = yield axios_1.default.get("https://api.spotify.com/v1/me", {
                headers: { Authorization: `Bearer ${access_token}` },
            });
            if (!userResponse.data) {
                throw new Error("User data is missing in the response!");
            }
            return { access_token, user: userResponse.data };
        });
    }
    static getUserPlaylists(access_token) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!access_token) {
                throw new Error("Access token is missing!");
            }
            try {
                const response = yield axios_1.default.get("https://api.spotify.com/v1/me/playlists", {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type": "application/json",
                    },
                });
                return response.data;
            }
            catch (error) {
                console.error("Error fetching playlists from Spotify:");
                if (axios_1.default.isAxiosError(error)) {
                    console.error("Status:", (_a = error.response) === null || _a === void 0 ? void 0 : _a.status);
                    console.error("Data:", (_b = error.response) === null || _b === void 0 ? void 0 : _b.data);
                }
                else {
                    console.error("Unexpected error:", error.data.error);
                }
                throw new Error("Failed to fetch playlists");
            }
        });
    }
}
exports.default = SpotifyService;
