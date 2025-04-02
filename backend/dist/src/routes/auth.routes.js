"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const controllers_1 = require("../controllers");
const spotifyController = new controllers_1.SpotifyController();
router.get("/spotify", spotifyController.login);
router.post("/spotify", spotifyController.callback);
// router.post('/youtube', YoutubeController );
exports.default = router;
