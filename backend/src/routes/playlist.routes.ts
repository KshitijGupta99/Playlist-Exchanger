import express from "express";
import { youtube } from "googleapis/build/src/apis/youtube";
import { YoutubeController, SpotifyController, ConverterController} from "../controllers";
const router = express.Router()
const youtubeController = new YoutubeController();
const spotifyController = new SpotifyController();
const converterController = new ConverterController();
router.get("/youtube", youtubeController.getPlaylists);
router.get("/spotify", spotifyController.getPlayList);
router.post('/connvert', converterController.convert);
// router.post("/swap", YoutubeController.swap);
// router.post('/youtube', YoutubeController );


export default router;