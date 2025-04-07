import { Request, Response } from "express";

import { YoutubeService } from "../services";

const { YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REDIRECT_URI } =
    process.env;

class YoutubeController {
    YoutubeService: YoutubeService;

    constructor() {
        this.YoutubeService = new YoutubeService();
        console.log("controller called");
    }

    login = async (req: Request, res: Response) => {
        const { code } = req.body;
        const authUrl = YoutubeService.getAuthUrl();
        try {

            const token = await YoutubeService.exchangeCodeForToken("code");
            console.log("Access Token:", token);
            const {access_token} = token;

        } catch (error) {
            console.error("Error fetching Youtube auth URL:", error);
            res.status(500).json({ error: "Failed to generate auth URL" });

        }

    };
}

export default YoutubeController;
