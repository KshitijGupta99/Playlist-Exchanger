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
            const authUrl = services_1.YoutubeService.getAuthUrl();
            try {
                console.log(authUrl);
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
                console.error("Error fetching Youtube auth URL:", error);
                res.status(500).json({ error: "Failed to generate auth URL" });
            }
        });
        this.YoutubeService = new services_1.YoutubeService();
        console.log("controller called");
    }
}
exports.default = YoutubeController;
