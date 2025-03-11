import express from 'express';
const router = express.Router();

import {SpotifyController, YoutubeController} from '../controllers/index';


router.post('/spotify', SpotifyController );
router.post('/youtube', YoutubeController );

export default router;
