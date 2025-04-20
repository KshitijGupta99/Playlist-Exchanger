import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } =
  process.env;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REDIRECT_URI) {
    throw new Error("Missing required Spotify environment variables");
  }

class SpotifyService {
  static getAuthUrl(): string {
    const scopes = "playlist-read-private playlist-modify-public playlist-modify-private";
    return `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${SPOTIFY_REDIRECT_URI}&scope=${encodeURIComponent(scopes)}`;
  }

  static async exchangeCodeForToken(code: string) : Promise<{ access_token: string; user: any }> {
    if (!code) {
      throw new Error("Authorization code is missing!");
    }
    if (!SPOTIFY_REDIRECT_URI || !SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      throw new Error("Missing Spotify environment variables");
    }
  
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        client_id: SPOTIFY_CLIENT_ID,
        client_secret: SPOTIFY_CLIENT_SECRET,
      }).toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
  
    const { access_token } = response.data;
    if(!access_token){
      throw new Error("Access token is missing in the response!");
    }
    // Fetch user data using the access token
    const userResponse = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if(!userResponse.data){
      throw new Error("User data is missing in the response!");
    }
  
    return { access_token, user: userResponse.data };
  }

  static async getUserPlaylists(access_token: string) : Promise<any> {
    if (!access_token) {
      throw new Error("Access token is missing!");
    }
    try {
      const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });
  
      return response.data;
    } catch (error : any) {
      console.error("Error fetching playlists from Spotify:");
  
      if (axios.isAxiosError(error)) {
        console.error("Status:", error.response?.status);
        console.error("Data:", error.response?.data);
      } else {
        console.error("Unexpected error:", error.data.error);
      }
  
      throw new Error("Failed to fetch playlists");
    }
  }
  
  
}

export default SpotifyService;
