import express from "express";
const router = express.Router();

import { SpotifyController, YoutubeController } from "../controllers";

const spotifyController = new SpotifyController();

router.get("/spotify", spotifyController.login);
// router.post('/youtube', YoutubeController );

export default router;
