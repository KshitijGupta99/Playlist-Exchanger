import { Request, Response } from "express";

import { YoutubeService } from "../services";

const { YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REDIRECT_URI } = process.env;

class YoutubeController {
    YoutubeService: YoutubeService;

    constructor() {
        this.YoutubeService = new YoutubeService();
        console.log("controller called");
    }

    login = async (req: Request, res: Response) => {
        try {
            const authUrl = YoutubeService.getAuthUrl();
            console.log("Generated Auth URL:", authUrl); // Log the URL for debugging
            res.json({ url: authUrl }); // Send the URL to the frontend
        } catch (error) {
            console.error("Error generating YouTube auth URL:", error);
            res.status(500).json({ error: "Failed to generate auth URL" });
        }
    };

    callback = async (req: Request, res: Response) => {
        try {
            const code = req.body.code as string;
            console.log("Authorization Code:", code);

            if (!code) {
                return res.status(400).json({ error: "Authorization code missing!" });
            }

            const { access_token, user } =
                await YoutubeService.exchangeCodeForToken(code);

            console.log("Access Token:", access_token);
            console.log("User Data:", user);

            res.status(200).json({ access_token, user });
        } catch (error ) {
            console.error("Spotify Auth Error:", error);
            res.status(500).json({ error: error.message || "Authentication failed" });
        }
    };

    getPlaylists = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(400).json({ error: "Access token missing or invalid!" });
            }

            const accessToken = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
            console.log("Access Token:", accessToken);

            const playlists = await YoutubeService.getPlaylists(accessToken);
            res.status(200).json(playlists);
        } catch (error) {
            console.error("Error fetching playlists:", error);
            res.status(500).json({ error: "Failed to fetch playlists" });
        }
    };

    getPlaylistItems = async (req: Request, res: Response) => {
        try {
            const { access_token, playlistId } = req.body;
            console.log("Access Token:", access_token);
            console.log("Playlist ID:", playlistId);

            if (!access_token || !playlistId) {
                return res.status(400).json({ error: "Access token or Playlist ID missing!" });
            }

            const items = await YoutubeService.getPlaylistItems(access_token, playlistId);
            res.status(200).json(items);
        } catch (error) {
            console.error("Error fetching playlist items:", error);
            res.status(500).json({ error: "Failed to fetch playlist items" });
        }
    }
}

export default YoutubeController;
