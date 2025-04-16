import axios from "axios";
import dotenv from "dotenv";
import { response } from "express";

dotenv.config();

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } =
  process.env;

class ConverterService {

  static async getSpotifyTracks(playlistId, token) {
    try {
      const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch Spotify tracks");
      }
      const data = await res.json();
      return data.items.map((item) => {
        const track = item.track;
        return `${track.name} ${track.artists.map((a) => a.name).join(" ")}`;
      });
    } catch (error) {
      console.error("Error fetching Spotify tracks:", error);
      throw error;

    }


  }


  static async createYouTubePlaylist(title: String, token) {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet,status`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        snippet: {
          title: title,
          description: "Converted from Spotify",
        },
        status: { privacyStatus: "private" },
      }),
    });
    const data = await res.json();
    return data.id;
  }

  // services/conversionService.js

  static async searchAndAddToYoutube(track, playlistId, youtubeAccessToken) {
    try {
      // Search for the track on YouTube
      const query = track;
      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          query
        )}&type=video&maxResults=1`,
        {
          headers: {
            Authorization: `Bearer ${youtubeAccessToken}`,
            Accept: "application/json",
          },
        }
      );

      const searchData = await searchRes.json();
      if (!searchData.items || searchData.items.length === 0) {
        console.warn(`❌ No result found for: ${query}`);
        return;
      }
      console.log(`✅ Found video for ${query}:`, searchData.items[0].snippet.title);
      const videoId = searchData.items[0].id.videoId;

      // Add the found video to the playlist
      const insertRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${youtubeAccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            snippet: {
              playlistId,
              resourceId: {
                kind: "youtube#video",
                videoId,
              },
            },
          }),
        }
      );

      const insertData = await insertRes.json();
      if (insertRes.ok) {
        console.log(`✅ Added ${query} to YouTube playlist`);
      } else {
        console.error("❌ Failed to add to playlist:", insertData);
      }
    } catch (err) {
      console.error("❌ Error in searchAndAddToYouTubePlaylist:", err);
    }
  }


}

export default ConverterService;