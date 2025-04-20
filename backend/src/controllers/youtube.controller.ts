import { Request, Response } from "express";

import { YoutubeService } from "../services";

const { YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REDIRECT_URI } = process.env;

if (!YT_CLIENT_ID || !YT_CLIENT_SECRET || !YT_REDIRECT_URI) {
    throw new Error("Missing required YouTube environment variables");
}

class YoutubeController {
    private YoutubeService: YoutubeService;

    constructor() {
        this.YoutubeService = new YoutubeService();
        console.log("YouTubecontroller called");
    }

    login = async (req: Request, res: Response) : Promise<void> => {
        try {
            const authUrl = YoutubeService.getAuthUrl();
            res.status(200).json({ url: authUrl }); // Send the URL to the frontend
        } catch (error) {
            console.error("Error generating YouTube auth URL:", error);
            res.status(500).json({ error: "Failed to generate auth URL" });
        }
    };

    callback = async (req: Request, res: Response): Promise<void> => {
        try {
            const code = req.body.code as string;

            if (!code) {
                res.status(400).json({ error: "Authorization code missing!" });
            }

            const { access_token, user } =
                await YoutubeService.exchangeCodeForToken(code);

            console.log("Access Token:", access_token);
            console.log("User Data:", user);

            res.status(200).json({ access_token, user });
        } catch (error : any ) {
            console.error("Spotify Auth Error:", error);
            res.status(500).json({ error: error.message || "Authentication failed" });
        }
    };

    getPlaylists = async (req: Request, res: Response) :Promise<void> => {
        try {
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                res.status(400).json({ error: "Access token missing or invalid!" });
            }
            const accessToken = (authHeader) ? authHeader.split(" ")[1] : null; // Extract token from "Bearer <token>"
            const playlists = await YoutubeService.getPlaylists(accessToken ? accessToken : 'null');    
            res.status(200).json(playlists);
        } catch (error :any) {
            console.error("Error fetching playlists:", error);
            res.status(500).json({ error: error.message || "Failed to fetch playlists" });
        }
    };

    getPlaylistItems = async (req: Request, res: Response) : Promise<void> => {
        try {
            const { access_token, playlistId } = req.body;
            console.log("Access Token:", access_token);
            console.log("Playlist ID:", playlistId);

            if (!access_token || !playlistId) {
                res.status(400).json({ error: "Access token or Playlist ID missing!" });
            }

            const items = await YoutubeService.getPlaylistItems(access_token, playlistId);
            res.status(200).json(items);
        } catch (error :any) {
            console.error("Error fetching playlist items:", error);
            res.status(500).json({ error: "Failed to fetch playlist items" });
        }
    }
}

export default YoutubeController;
