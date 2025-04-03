import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } =
  process.env;

class SpotifyService {
  static getAuthUrl(): string {
    const scopes = "playlist-read-private playlist-modify-public";
    return `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${SPOTIFY_REDIRECT_URI}&scope=${encodeURIComponent(scopes)}`;
  }

  static async exchangeCodeForToken(code: string) {
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
  
    // Fetch user data using the access token
    const userResponse = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
  
    return { access_token, user: userResponse.data };
  }

  static async getUserPlaylists(access_token: string) {
    const response = <Response>await axios.get("https://api.spotify.com/v1/me/playlists", {
      headers: { "Authorization": `Bearer ${access_token}` , "Content-Type": "application/json"},
    });
    if (!response.ok) throw new Error("Failed to fetch playlists");

    return await response.json();
  }
  
}

export default SpotifyService;
