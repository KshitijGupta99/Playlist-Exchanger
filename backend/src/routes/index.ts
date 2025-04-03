import express from "express";
import authRoutes from "./auth.routes";
import playlistRoutes from './playlist.routes';

const v1Routes = express.Router();

v1Routes.use("/auth", authRoutes);
v1Routes.use('/playlist', playlistRoutes);

export default v1Routes;
