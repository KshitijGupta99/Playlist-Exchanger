"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const spotify_controller_1 = __importDefault(require("./spotify.controller"));
const youtube_controller_1 = __importDefault(require("./youtube.controller"));
const controllers = { SpotifyController: spotify_controller_1.default, YoutubeController: youtube_controller_1.default };
module.exports = controllers;
