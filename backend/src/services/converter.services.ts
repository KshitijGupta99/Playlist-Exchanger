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

  static async getYoutubeVideos(playlistId, token){
    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if(!res.ok) {
        throw new Error("Failed to fetch Youtube videos");
      }
      
      if (res.status === 404) {
        throw new Error("Playlist not found");
      }
      if (res.status === 403) {
        throw new Error("Access forbidden to the playlist");
      }
      if (res.status === 401) {
        throw new Error("Unauthorized access to the playlist");
      }
      if (res.status === 500) {
        throw new Error("Internal server error while fetching playlist items");
      }
      if (res.status === 429) {
        throw new Error("Quota exceeded for YouTube API requests");
      }
      if (res.status === 400) {
        throw new Error("Bad request to YouTube API");
      }
      if (res.status === 408) {
        throw new Error("Request timeout while fetching playlist items");
      }
      const data = await res.json();

      if (!data.items || data.items.length === 0) {
        throw new Error("No videos found in the playlist");
      }

      return data.items.map((item) => {
        const video = item.snippet;
        return `${video.title} ${video.channelTitle}`;
      }
      );
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
      throw error;
    }
  };

  static async createSpotifyPlaylist(title, token) {
    try {
      const res = await fetch(`https://api.spotify.com/v1/me/playlists`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: title,
          public: false,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to create Spotify playlist");
      }
      const data = await res.json();
      return data.id;
    } catch (error) {
      console.error("Error creating Spotify playlist:", error);
      throw error;
    }
  }


  static async searchAndAddToSpotify(track, playlistId, spotifyAccessToken) {
    try {
      // Search for the track on Spotify
      const query = track;
      const searchRes = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=track&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${spotifyAccessToken}`,
            Accept: "application/json",
          },
        }
      );

      const searchData = await searchRes.json();
      if (!searchData.tracks || searchData.tracks.items.length === 0) {
        console.warn(`❌ No result found for: ${query}`);
        return;
      }
      console.log(`✅ Found track for ${query}:`, searchData.tracks.items[0].name);
      const trackId = searchData.tracks.items[0].id;

      // Add the found track to the playlist
      const insertRes = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${spotifyAccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: [`spotify:track:${trackId}`],
          }),
        }
      );

      const insertData = await insertRes.json();
      if (insertRes.ok) {
        console.log(`✅ Added ${query} to Spotify playlist`);
      } else {
        console.error("❌ Failed to add to playlist:", insertData);
      }
    } catch (err) {
      console.error("❌ Error in searchAndAddToSpotifyPlaylist:", err);
    }
  }

}

export default ConverterService;