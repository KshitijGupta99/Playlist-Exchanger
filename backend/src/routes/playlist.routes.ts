import express from "express";
const router = express.Router()


import { SpotifyController, YoutubeController, YoutubeController } from "../controllers";

const spotifyController = new SpotifyController();
const YoutubeController = new YoutubeController();

router.get("/get", YoutubeController.get);
router.post("/swap", YoutubeController.swap);
// router.post('/youtube', YoutubeController );


export default router;