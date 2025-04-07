import express from "express";
const router = express.Router();

import { SpotifyController, YoutubeController } from "../controllers";

const spotifyController = new SpotifyController();
const youtubeController = new YoutubeController();

router.get("/spotify", spotifyController.login);
router.post("/spotify", spotifyController.callback);
router.get("/youtube", youtubeController.login);


export default router;
