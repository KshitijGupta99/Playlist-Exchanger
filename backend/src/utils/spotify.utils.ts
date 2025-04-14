const fetch = require("node-fetch");

// Make sure to retrieve token from env/localStorage securely
const SPOTIFY_TOKEN = process.env.SPOTIFY_TOKEN;


exports.createYouTubePlaylist = async (name, trackNames) => {
  // 1. Create YouTube playlist
  const createRes = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet,status`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${YOUTUBE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      snippet: { title: name, description: "Converted from Spotify" },
      status: { privacyStatus: "private" },
    }),
  });

  const createData = await createRes.json();
  const playlistId = createData.id;

  // 2. Add each track by searching on YouTube
  for (const query of trackNames) {
    const searchRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=1&type=video`, {
      headers: { Authorization: `Bearer ${YOUTUBE_TOKEN}` },
    });
    const searchData = await searchRes.json();
    const videoId = searchData.items?.[0]?.id?.videoId;

    if (videoId) {
      await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${YOUTUBE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          snippet: {
            playlistId: playlistId,
            resourceId: {
              kind: "youtube#video",
              videoId: videoId,
            },
          },
        }),
      });
    }
  }

  return `https://www.youtube.com/playlist?list=${playlistId}`;
};



exports.getSpotifyTracks = async (playlistId) => {
  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers: { Authorization: `Bearer ${SPOTIFY_TOKEN}` }
  });

  const data = await res.json();

  return data.items.map(item => {
    const track = item.track;
    return `${track.name} ${track.artists[0].name}`;
  });
};
