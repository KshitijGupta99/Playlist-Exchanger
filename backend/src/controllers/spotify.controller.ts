import { Request, Response } from "express";
import { SpotifyService } from "../services";

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } = process.env;

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REDIRECT_URI) {
  throw new Error("Missing required Spotify environment variables");
}

class SpotifyController {
  private SpotifyService: SpotifyService;

  constructor() {
    this.SpotifyService = new SpotifyService();
    console.log("SpotifyController initialized");
  }

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const authUrl = SpotifyService.getAuthUrl();
      console.log("Generated Spotify Auth URL:", authUrl);
      res.status(200).json({ url: authUrl });
    } catch (error) {
      console.error("Error generating Spotify auth URL:", error);
      res.status(500).json({ error: "Failed to generate Spotify auth URL" });
    }
  };

  // Handle Spotify OAuth callback
  callback = async (req: Request, res: Response): Promise<void> => {
    try {
      const code = req.body.code as string;
      if (!code) {
        res.status(400).json({ error: "Authorization code missing!" });
      }

      const { access_token, user } = await SpotifyService.exchangeCodeForToken(code);

      console.log("Spotify Access Token:", access_token);
      console.log("Spotify User Data:", user);

      res.status(200).json({ access_token, user });
    } catch (error: any) {
      console.error("Spotify Auth Error:", error.message || error);
      res.status(500).json({ error: error.message || "Authentication failed" });
    }
  };

  // Fetch Spotify playlists
  getPlayList = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Unauthorized" });
      }

      const accessToken = authHeader?.split(" ")[1];
      if (!accessToken) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      console.log("Spotify Access Token:", accessToken);

      const playlists = await SpotifyService.getUserPlaylists(accessToken);
      res.status(200).json(playlists);
    } catch (error: any) {
      console.error("Error fetching Spotify playlists:", error.message || error);
      res.status(500).json({ error: error.message || "Failed to fetch playlists" });
    }
  };
}

export default SpotifyController;
