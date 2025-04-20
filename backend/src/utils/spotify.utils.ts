import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const { SPOTIFY_TOKEN, YOUTUBE_TOKEN } = process.env;

if (!SPOTIFY_TOKEN || !YOUTUBE_TOKEN) {
  throw new Error("Missing required environment variables: SPOTIFY_TOKEN or YOUTUBE_TOKEN");
}

export const createYouTubePlaylist = async (name: string, trackNames: string[]): Promise<string> => {
  try {
    // 1. Create YouTube playlist
    const createRes = await axios.post(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet,status`,
      {
        snippet: { title: name, description: "Converted from Spotify" },
        status: { privacyStatus: "private" },
      },
      {
        headers: {
          Authorization: `Bearer ${YOUTUBE_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const playlistId = createRes.data.id;

    // 2. Add each track by searching on YouTube
    for (const query of trackNames) {
      const searchRes = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=1&type=video`,
        {
          headers: { Authorization: `Bearer ${YOUTUBE_TOKEN}` },
        }
      );

      const videoId = searchRes.data.items?.[0]?.id?.videoId;

      if (videoId) {
        await axios.post(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet`,
          {
            snippet: {
              playlistId: playlistId,
              resourceId: {
                kind: "youtube#video",
                videoId: videoId,
              },
            },
          },
          {
            headers: {
              Authorization: `Bearer ${YOUTUBE_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
    }

    return `https://www.youtube.com/playlist?list=${playlistId}`;
  } catch (error: any) {
    console.error("Error creating YouTube playlist:", error.response?.data || error.message);
    throw new Error("Failed to create YouTube playlist");
  }
};

export const getSpotifyTracks = async (playlistId: string): Promise<string[]> => {
  try {
    const res = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: { Authorization: `Bearer ${SPOTIFY_TOKEN}` },
    });

    return res.data.items.map((item: any) => {
      const track = item.track;
      return `${track.name} ${track.artists[0].name}`;
    });
  } catch (error: any) {
    console.error("Error fetching Spotify tracks:", error.response?.data || error.message);
    throw new Error("Failed to fetch Spotify tracks");
  }
};
