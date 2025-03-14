import { Request, Response } from "express";

import {SpotifyService} from "../services/index";



class SpotifyController{
    static async login(req: Request, res: Response){
        try {
            const authUrl = SpotifyService.getAuthUrl();
            res.redirect(authUrl);
        } catch (error) {
            res.status(500).json({error : "failed to genrate auth url"});
        }
    }

    static async callback(req: Request, res: Response){
        try {
            const code = req.query.code as string;
            const token = await SpotifyService.exchangeCodeForToken(code);
            res.status(200).json({token});
        } catch (error) {
            res.status(500).json({error : "failed to get tokens, authenticatoin failed"});
        }
    }


}

export default SpotifyController;