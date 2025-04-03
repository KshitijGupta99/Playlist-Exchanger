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
      const code = req.body.code as string;
      console.log("Authorization Code:", code);
  
      if (!code) {
        return res.status(400).json({ error: "Authorization code missing!" });
      }
  
      const { access_token, user } =
        await SpotifyService.exchangeCodeForToken(code);
  
      console.log("Access Token:", access_token);
      console.log("User Data:", user);
  
      res.status(200).json({ access_token, user });
    } catch (error) {
      console.error("Spotify Auth Error:", error);
      res.status(500).json({ error: error.message || "Authentication failed" });
    }
  
  };

  getPlayList = async (req: Request, res: Response) => {
    try {
      const accessToken = req.headers.authorization?.split(" ")[1]; // Extract token
  
      if (!accessToken) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      console.log("Access Token:", accessToken);
      
  
      const playlists = await SpotifyService.getUserPlaylists(accessToken);
      res.status(200).json(playlists);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      res.status(500).json({ error: error.message || "Failed to fetch playlists" });
    }
  };
  


}

export default SpotifyController;
