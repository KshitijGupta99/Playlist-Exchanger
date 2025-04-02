import { Request, Response } from "express";

import { SpotifyService } from "../services";

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } =
  process.env;

class SpotifyController {
  SpotifyService: SpotifyService;

  constructor() {
    this.SpotifyService = new SpotifyService();
    console.log("controller called");
  }

  login = async (req: Request, res: Response) => {
    const authUrl = SpotifyService.getAuthUrl();
    try {
      console.log(authUrl);
      const scope = "playlist-read-private playlist-modify-public";

      // Fetch the authorization page from your backend
      const response = await fetch(authUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Forward the response to the frontend
      res.json({ url: response.url });
    } catch (error) {
      console.error("Error fetching Spotify auth URL:", error);
      res.status(500).json({ error: "Failed to generate auth URL" });
    }
  };

  callback = async (req: Request, res: Response) => {
    try {
      const code = req.query.code as string;
      const { access_token, user } = await SpotifyService.exchangeCodeForToken(code);
      
      res.status(200).json({ access_token, user });
    } catch (error) {
      console.error("Spotify Auth Error:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  };
  
}

export default SpotifyController;
