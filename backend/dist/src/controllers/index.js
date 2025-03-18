"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeController = exports.SpotifyController = void 0;
const spotify_controller_1 = __importDefault(require("./spotify.controller"));
exports.SpotifyController = spotify_controller_1.default;
const youtube_controller_1 = __importDefault(require("./youtube.controller"));
exports.YoutubeController = youtube_controller_1.default;
