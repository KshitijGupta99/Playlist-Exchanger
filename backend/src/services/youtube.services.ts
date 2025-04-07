import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const { YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REDIRECT_URI } =
    process.env;

class YoutubeService {



    static getAuthUrl(): string {
        const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

        const options = {
            client_id: process.env.YT_CLIENT_ID,
            redirect_uri: process.env.YT_REDIRECT_URI,
            response_type: 'code',
            access_type: 'offline', // needed to get refresh_token
            prompt: 'consent',
            scope: [
                'https://www.googleapis.com/auth/youtube.readonly',
                'https://www.googleapis.com/auth/userinfo.email',
            ].join(' '),
        };

        const urlParams = new URLSearchParams(options).toString();
        const authUrl = `${rootUrl}?${urlParams}`;
        return authUrl;
    }

    static async exchangeCodeForToken(code: string) {
        if (!YT_REDIRECT_URI || !YT_CLIENT_ID || !YT_CLIENT_SECRET) {
          throw new Error("Missing Spotify environment variables");
        }
      
        const response = await axios.post(
          "https://accounts.spotify.com/api/token",
          new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: YT_REDIRECT_URI,
            client_id: YT_CLIENT_ID,
            client_secret: YT_CLIENT_SECRET,
          }).toString(),
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        );
        console.log(response.data);
        const { access_token } = response.data;
      
        // Fetch user data using the access token
        const userResponse = await axios.get("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${access_token}` },
        });
      
        return { access_token, user: userResponse.data };
      }
}
export default YoutubeService;