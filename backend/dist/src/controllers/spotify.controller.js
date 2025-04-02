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
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } = process.env;
class SpotifyController {
    constructor() {
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const authUrl = services_1.SpotifyService.getAuthUrl();
            try {
                console.log(authUrl);
                const scope = "playlist-read-private playlist-modify-public";
                // Fetch the authorization page from your backend
                const response = yield fetch(authUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                // Forward the response to the frontend
                res.json({ url: response.url });
            }
            catch (error) {
                console.error("Error fetching Spotify auth URL:", error);
                res.status(500).json({ error: "Failed to generate auth URL" });
            }
        });
        this.callback = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const code = req.query.code;
                const { access_token, user } = yield services_1.SpotifyService.exchangeCodeForToken(code);
                res.status(200).json({ access_token, user });
            }
            catch (error) {
                console.error("Spotify Auth Error:", error);
                res.status(500).json({ error: "Authentication failed" });
            }
        });
        this.SpotifyService = new services_1.SpotifyService();
        console.log("controller called");
    }
}
exports.default = SpotifyController;
