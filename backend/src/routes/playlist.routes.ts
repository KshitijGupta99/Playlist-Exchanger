import express from "express";
import { youtube } from "googleapis/build/src/apis/youtube";
import { YoutubeController, SpotifyController} from "../controllers";
const router = express.Router()
const youtubeController = new YoutubeController();
const spotifyController = new SpotifyController();
router.get("/youtube", youtubeController.getPlaylists);
router.get("/spotify", spotifyController.getPlayList);
router.post('/connvert');
// router.post("/swap", YoutubeController.swap);
// router.post('/youtube', YoutubeController );


export default router;