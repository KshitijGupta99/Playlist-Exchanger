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
class SpotifyController {
    constructor() {
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const authUrl = services_1.SpotifyService.getAuthUrl();
                res.redirect(authUrl);
            }
            catch (error) {
                res.status(500).json({ error: "failed to genrate auth url" });
            }
        });
        this.callback = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const code = req.query.code;
                const token = yield services_1.SpotifyService.exchangeCodeForToken(code);
                res.status(200).json({ token });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ error: "failed to get tokens, authenticatoin failed" });
            }
        });
        this.SpotifyService = new services_1.SpotifyService();
    }
}
exports.default = SpotifyController;
