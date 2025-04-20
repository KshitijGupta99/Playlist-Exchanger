import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const { YOUTUBE_TOKEN, SPOTIFY_TOKEN, SPOTIFY_USER_ID } = process.env;

if (!YOUTUBE_TOKEN || !SPOTIFY_TOKEN || !SPOTIFY_USER_ID) {
  throw new Error("Missing required environment variables: YOUTUBE_TOKEN, SPOTIFY_TOKEN, or SPOTIFY_USER_ID");
}

// Fetch tracks from a YouTube playlist
export const getYouTubeTracks = async (playlistId: string): Promise<string[]> => {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50`,
      {
        headers: { Authorization: `Bearer ${YOUTUBE_TOKEN}` },
      }
    );

    const data = res.data;

    if (!data.items || data.items.length === 0) {
      throw new Error("No tracks found in the YouTube playlist");
    }

    return data.items.map((item: any) => item.snippet.title);
  } catch (error: any) {
    console.error("Error fetching YouTube tracks:", error.response?.data || error.message);
    throw new Error("Failed to fetch YouTube tracks");
  }
};

// Create a Spotify playlist and add tracks
export const createSpotifyPlaylist = async (name: string, trackNames: string[]): Promise<string> => {
  try {
    // 1. Create Spotify playlist
    const createRes = await axios.post(
      `https://api.spotify.com/v1/users/${SPOTIFY_USER_ID}/playlists`,
      {
        name: name,
        description: "Converted from YouTube",
        public: false,
      },
      {
        headers: {
          Authorization: `Bearer ${SPOTIFY_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const playlistId = createRes.data.id;

    if (!playlistId) {
      throw new Error("Failed to create Spotify playlist");
    }

    const uris: string[] = [];

    // 2. Search each track and collect URIs
    for (const query of trackNames) {
      const searchRes = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
        {
          headers: { Authorization: `Bearer ${SPOTIFY_TOKEN}` },
        }
      );

      const uri = searchRes.data.tracks?.items?.[0]?.uri;
      if (uri) uris.push(uri);
    }

    // 3. Add all found tracks to the new playlist
    await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      { uris },
      {
        headers: {
          Authorization: `Bearer ${SPOTIFY_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return `https://open.spotify.com/playlist/${playlistId}`;
  } catch (error: any) {
    console.error("Error creating Spotify playlist:", error.response?.data || error.message);
    throw new Error("Failed to create Spotify playlist");
  }
};
