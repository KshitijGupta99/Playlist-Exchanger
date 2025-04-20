import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } = process.env;

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REDIRECT_URI) {
  throw new Error("Missing required Spotify environment variables");
}

class ConverterService {
  // Fetch tracks from a Spotify playlist
  static async getSpotifyTracks(playlistId: string, token: string): Promise<string[]> {
    try {
      const res = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.items.map((item: any) => {
        const track = item.track;
        return `${track.name} ${track.artists.map((a: any) => a.name).join(" ")}`;
      });
    } catch (error: any) {
      console.error("Error fetching Spotify tracks:", error.response?.data || error.message);
      throw new Error("Failed to fetch Spotify tracks");
    }
  }

  // Create a YouTube playlist
  static async createYouTubePlaylist(title: string, token: string): Promise<string> {
    try {
      const res = await axios.post(
        `https://www.googleapis.com/youtube/v3/playlists?part=snippet,status`,
        {
          snippet: {
            title,
            description: "Converted from Spotify",
          },
          status: { privacyStatus: "private" },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return res.data.id;
    } catch (error: any) {
      console.error("Error creating YouTube playlist:", error.response?.data || error.message);
      throw new Error("Failed to create YouTube playlist");
    }
  }

  // Search and add a track to a YouTube playlist
  static async searchAndAddToYoutube(track: string, playlistId: string, youtubeAccessToken: string): Promise<void> {
    try {
      const searchRes = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(track)}&type=video&maxResults=1`,
        {
          headers: {
            Authorization: `Bearer ${youtubeAccessToken}`,
          },
        }
      );

      const searchData = searchRes.data;
      if (!searchData.items || searchData.items.length === 0) {
        console.warn(`❌ No result found for: ${track}`);
        return;
      }

      const videoId = searchData.items[0].id.videoId;

      await axios.post(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet`,
        {
          snippet: {
            playlistId,
            resourceId: {
              kind: "youtube#video",
              videoId,
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${youtubeAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`✅ Added ${track} to YouTube playlist`);
    } catch (error: any) {
      console.error("❌ Error in searchAndAddToYoutube:", error.response?.data || error.message);
      throw new Error("Failed to add track to YouTube playlist");
    }
  }

  // Fetch videos from a YouTube playlist
  static async getYoutubeVideos(playlistId: string, token: string): Promise<{ title: string; id: string }[]> {
    try {
      const res = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.data.items || res.data.items.length === 0) {
        throw new Error("No videos found in the playlist");
      }

      return res.data.items.map((item: any) => {
        const video = item.snippet;
        return { title: video.title, id: item.id };
      });
    } catch (error: any) {
      console.error("Error fetching YouTube videos:", error.response?.data || error.message);
      throw new Error("Failed to fetch YouTube videos");
    }
  }

  // Create a Spotify playlist
  static async createSpotifyPlaylist(title: string, token: string): Promise<string> {
    try {
      const res = await axios.post(
        `https://api.spotify.com/v1/me/playlists`,
        {
          name: title,
          public: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return res.data.id;
    } catch (error: any) {
      console.error("Error creating Spotify playlist:", error.response?.data || error.message);
      throw new Error("Failed to create Spotify playlist");
    }
  }

  // Search and add a track to a Spotify playlist
  static async searchAndAddToSpotify(track: string, playlistId: string, spotifyAccessToken: string): Promise<void> {
    try {
      const searchRes = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(track)}&type=track&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${spotifyAccessToken}`,
          },
        }
      );

      const searchData = searchRes.data;
      if (!searchData.tracks || searchData.tracks.items.length === 0) {
        console.warn(`❌ No result found for: ${track}`);
        return;
      }

      const trackId = searchData.tracks.items[0].id;

      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          uris: [`spotify:track:${trackId}`],
        },
        {
          headers: {
            Authorization: `Bearer ${spotifyAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`✅ Added ${track} to Spotify playlist`);
    } catch (error: any) {
      console.error("❌ Error in searchAndAddToSpotify:", error.response?.data || error.message);
      throw new Error("Failed to add track to Spotify playlist");
    }
  }
}

export default ConverterService;