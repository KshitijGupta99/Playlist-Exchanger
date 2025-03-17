import express from 'express';
const router = express.Router();

import {SpotifyController} from '../controllers';
import {YoutubeController} from '../controllers';


router.post('/spotify', SpotifyController );
router.post('/youtube', YoutubeController );

export default router;
