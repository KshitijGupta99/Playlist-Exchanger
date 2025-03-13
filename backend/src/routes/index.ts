import express from 'express';
import authRoutes from './auth.routes';
import playlistRoutes from './playlist.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/playlist', playlistRoutes);

export default router;
