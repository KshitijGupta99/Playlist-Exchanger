"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeService = exports.SpotifyService = void 0;
const spotify_services_1 = __importDefault(require("./spotify.services"));
exports.SpotifyService = spotify_services_1.default;
const youtube_services_1 = __importDefault(require("./youtube.services"));
exports.YoutubeService = youtube_services_1.default;
