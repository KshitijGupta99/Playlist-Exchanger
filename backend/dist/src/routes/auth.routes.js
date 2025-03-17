"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const index_1 = require("../controllers/index");
router.post('/spotify', index_1.SpotifyController);
router.post('/youtube', index_1.YoutubeController);
exports.default = router;
