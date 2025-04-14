const fetch = require("node-fetch");

const YOUTUBE_TOKEN = process.env.YOUTUBE_TOKEN;

exports.getYouTubeTracks = async (playlistId) => {
  const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50`, {
    headers: { Authorization: `Bearer ${YOUTUBE_TOKEN}` }
  });

  const data = await res.json();

  return data.items.map(item => item.snippet.title);
};


const SPOTIFY_TOKEN = process.env.SPOTIFY_TOKEN;
const SPOTIFY_USER_ID = process.env.SPOTIFY_USER_ID;

exports.createSpotifyPlaylist = async (name, trackNames) => {
  // 1. Create Spotify playlist
  const createRes = await fetch(`https://api.spotify.com/v1/users/${SPOTIFY_USER_ID}/playlists`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SPOTIFY_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      description: "Converted from YouTube",
      public: false,
    }),
  });

  const createData = await createRes.json();
  const playlistId = createData.id;

  const uris = [];

  // 2. Search each track and collect URIs
  for (const query of trackNames) {
    const searchRes = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`, {
      headers: { Authorization: `Bearer ${SPOTIFY_TOKEN}` },
    });

    const searchData = await searchRes.json();
    const uri = searchData.tracks?.items?.[0]?.uri;
    if (uri) uris.push(uri);
  }

  // 3. Add all found tracks to the new playlist
  await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SPOTIFY_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uris }),
  });

  return `https://open.spotify.com/playlist/${playlistId}`;
};

