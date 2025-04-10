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
const { YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REDIRECT_URI } = process.env;
class YoutubeController {
    constructor() {
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const authUrl = services_1.YoutubeService.getAuthUrl();
                console.log("Generated Auth URL:", authUrl); // Log the URL for debugging
                res.json({ url: authUrl }); // Send the URL to the frontend
            }
            catch (error) {
                console.error("Error generating YouTube auth URL:", error);
                res.status(500).json({ error: "Failed to generate auth URL" });
            }
        });
        this.callback = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const code = req.body.code;
                console.log("Authorization Code:", code);
                if (!code) {
                    return res.status(400).json({ error: "Authorization code missing!" });
                }
                const { access_token, user } = yield services_1.YoutubeService.exchangeCodeForToken(code);
                console.log("Access Token:", access_token);
                console.log("User Data:", user);
                res.status(200).json({ access_token, user });
            }
            catch (error) {
                console.error("Spotify Auth Error:", error);
                res.status(500).json({ error: error.message || "Authentication failed" });
            }
        });
        this.YoutubeService = new services_1.YoutubeService();
        console.log("controller called");
    }
}
exports.default = YoutubeController;
