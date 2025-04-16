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
const { YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REDIRECT_URI } = process.env;
class YoutubeService {
    static getAuthUrl() {
        const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
        const options = {
            client_id: YT_CLIENT_ID,
            redirect_uri: YT_REDIRECT_URI,
            response_type: 'code',
            access_type: 'offline',
            prompt: 'consent',
            scope: [
                'https://www.googleapis.com/auth/youtube',
                'https://www.googleapis.com/auth/userinfo.email',
            ].join(' '),
        };
        const authUrl = `${rootUrl}?${new URLSearchParams(options)}`;
        return authUrl;
    }
    static exchangeCodeForToken(code) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!YT_REDIRECT_URI || !YT_CLIENT_ID || !YT_CLIENT_SECRET) {
                throw new Error("Missing YouTube environment variables");
            }
            try {
                const response = yield axios_1.default.post("https://oauth2.googleapis.com/token", // ✅ Correct endpoint for Google
                new URLSearchParams({
                    code,
                    client_id: YT_CLIENT_ID,
                    client_secret: YT_CLIENT_SECRET,
                    redirect_uri: YT_REDIRECT_URI,
                    grant_type: "authorization_code",
                }).toString(), {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                });
                console.log(response.data);
                const { access_token } = response.data;
                // ✅ YouTube uses the same userinfo endpoint as Google
                const userResponse = yield axios_1.default.get("https://www.googleapis.com/oauth2/v2/userinfo", {
                    headers: { Authorization: `Bearer ${access_token}` },
                });
                return { access_token, user: userResponse.data };
            }
            catch (error) {
                console.error("Error in exchangeCodeForToken in youtube :", error);
                throw new Error("Failed to exchange code for token");
            }
        });
    }
    static getPlaylists(access_token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get("https://www.googleapis.com/youtube/v3/playlists", {
                    headers: { Authorization: `Bearer ${access_token}` },
                    params: {
                        part: "snippet",
                        mine: true,
                        maxResults: 25,
                    },
                });
                return response.data.items;
            }
            catch (error) {
                console.error("Error fetching playlists:", error);
                throw new Error("Failed to fetch playlists");
            }
        });
    }
    static getPlaylistItems(access_token, playlistId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get("https://www.googleapis.com/youtube/v3/playlistItems", {
                    headers: { Authorization: `Bearer ${access_token}` },
                    params: {
                        part: "snippet",
                        playlistId,
                        maxResults: 50,
                    },
                });
                return response.data.items;
            }
            catch (error) {
                console.error("Error fetching playlist items:", error);
                throw new Error("Failed to fetch playlist items");
            }
        });
    }
}
exports.default = YoutubeService;
