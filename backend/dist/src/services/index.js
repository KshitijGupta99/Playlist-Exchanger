"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const spotify_services_1 = __importDefault(require("./spotify.services"));
// import YoutubeController from "./youtube.services";
exports.default = { SpotifyService: spotify_services_1.default };
