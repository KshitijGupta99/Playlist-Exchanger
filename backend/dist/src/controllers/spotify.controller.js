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
if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REDIRECT_URI) {
    throw new Error("Missing required Spotify environment variables");
}
class SpotifyController {
    constructor() {
        // Generate Spotify login URL
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const authUrl = services_1.SpotifyService.getAuthUrl();
                console.log("Generated Spotify Auth URL:", authUrl);
                res.status(200).json({ url: authUrl });
            }
            catch (error) {
                console.error("Error generating Spotify auth URL:", error);
                res.status(500).json({ error: "Failed to generate Spotify auth URL" });
            }
        });
        // Handle Spotify OAuth callback
        this.callback = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const code = req.body.code;
                if (!code) {
                    return res.status(400).json({ error: "Authorization code missing!" });
                }
                const { access_token, user } = yield services_1.SpotifyService.exchangeCodeForToken(code);
                console.log("Spotify Access Token:", access_token);
                console.log("Spotify User Data:", user);
                res.status(200).json({ access_token, user });
            }
            catch (error) {
                console.error("Spotify Auth Error:", error.message || error);
                res.status(500).json({ error: error.message || "Authentication failed" });
            }
        });
        // Fetch Spotify playlists
        this.getPlayList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const authHeader = req.headers.authorization;
                if (!authHeader || !authHeader.startsWith("Bearer ")) {
                    return res.status(401).json({ error: "Unauthorized" });
                }
                const accessToken = authHeader.split(" ")[1];
                console.log("Spotify Access Token:", accessToken);
                const playlists = yield services_1.SpotifyService.getUserPlaylists(accessToken);
                res.status(200).json(playlists);
            }
            catch (error) {
                console.error("Error fetching Spotify playlists:", error.message || error);
                res.status(500).json({ error: error.message || "Failed to fetch playlists" });
            }
        });
        this.SpotifyService = new services_1.SpotifyService();
        console.log("SpotifyController initialized");
    }
}
exports.default = SpotifyController;
