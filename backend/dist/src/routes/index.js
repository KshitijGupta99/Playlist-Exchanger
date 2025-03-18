"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
// import playlistRoutes from './playlist.routes';
const v1Routes = express_1.default.Router();
v1Routes.use("/auth", auth_routes_1.default);
// router.use('/playlist', playlistRoutes);
exports.default = v1Routes;
