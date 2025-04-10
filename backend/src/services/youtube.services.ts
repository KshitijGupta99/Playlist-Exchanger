import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const { YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REDIRECT_URI } = process.env;

class YoutubeService {
  static getAuthUrl(): string {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  
    const options = {
      client_id: YT_CLIENT_ID!,
      redirect_uri: YT_REDIRECT_URI!,
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
    };
  
    const authUrl = `${rootUrl}?${new URLSearchParams(options)}`;
    return authUrl;
  }
  

  static async exchangeCodeForToken(code: string) {
    if (!YT_REDIRECT_URI || !YT_CLIENT_ID || !YT_CLIENT_SECRET) {
      throw new Error("Missing YouTube environment variables");
    }
    try {
      const response = await axios.post(
        "https://oauth2.googleapis.com/token", // ✅ Correct endpoint for Google
        new URLSearchParams({
          code,
          client_id: YT_CLIENT_ID,
          client_secret: YT_CLIENT_SECRET,
          redirect_uri: YT_REDIRECT_URI,
          grant_type: "authorization_code",
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      console.log(response.data);
      const { access_token } = response.data;

      // ✅ YouTube uses the same userinfo endpoint as Google
      const userResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${access_token}` },
        },
      );

      return { access_token, user: userResponse.data };
    } catch (error) {
      console.error("Error in exchangeCodeForToken in youtube :", error);
      throw new Error("Failed to exchange code for token");
    }
  }

  static async getPlaylists(access_token: string) {
    try {
      const response = await axios.get("https://www.googleapis.com/youtube/v3/playlists", {
        headers: { Authorization: `Bearer ${access_token}` },
        params: {
          part: "snippet",
          mine: true,
          maxResults: 25,
        },
      });
      return response.data.items;
    } catch (error) {
      console.error("Error fetching playlists:", error);
      throw new Error("Failed to fetch playlists");
    }
  }

  static async getPlaylistItems(access_token: string, playlistId: string) {
    try {
      const response = await axios.get("https://www.googleapis.com/youtube/v3/playlistItems", {
        headers: { Authorization: `Bearer ${access_token}` },
        params: {
          part: "snippet",
          playlistId,
          maxResults: 50,
        },
      });
      return response.data.items;
    } catch (error) {
      console.error("Error fetching playlist items:", error);
      throw new Error("Failed to fetch playlist items");
    }
  }
}
export default YoutubeService;
