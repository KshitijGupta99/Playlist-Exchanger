"use client";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [spotifyPlaylists, setSpotifyPlaylists] = useState([]);
  const [youtubePlaylists, setYoutubePlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    let rawToken = localStorage.getItem("access_token_youtube");
    const Youtube_accessToken = rawToken?.replace(/^"(.*)"$/, "$1");
    rawToken = localStorage.getItem("access_token");
    const Spotify_accessToken = rawToken?.replace(/^"(.*)"$/, "$1");

    // Fetch Spotify playlists
    fetch("http://localhost:5000/v1/playlist/spotify", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Spotify_accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.items)) setSpotifyPlaylists(data.items);
        else console.error("❌ Unexpected Spotify data:", data);
      });

    // Fetch YouTube playlists
    fetch("http://localhost:5000/v1/playlist/youtube", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Youtube_accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setYoutubePlaylists(data);
        else console.error("❌ Unexpected Youtube data:", data);
      });
  }, []);

  const handleConvert = async () => {
    if (!selectedPlaylist) return;
    const from = selectedPlaylist.platform;
    const to = from === "spotify" ? "youtube" : "spotify";

    const res = await fetch(`http://localhost:5000/v1/convert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedPlaylist),
    });
    const data = await res.json();
    alert(`Converted to ${to} ✔️`);
  };

  const renderPlaylists = (playlists, platform) =>
    playlists.map((p) => {
      const isSelected = selectedPlaylist?.id === p.id && selectedPlaylist?.platform === platform;
      const title = p.name || p.snippet?.title || "Untitled";
      const image = p.images?.[0]?.url || p.snippet?.thumbnails?.default?.url || "https://via.placeholder.com/150";
      const url = p.external_urls?.spotify || p.snippet?.thumbnails?.default?.url || "#";

      return (
        <div
          key={p.id}
          className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer p-4 flex gap-4 items-center border-2 ${
            isSelected ? "border-blue-500" : "border-transparent"
          }`}
          onClick={() => setSelectedPlaylist({ ...p, platform })}
        >
          <img
            src={image}
            alt="Playlist Cover"
            className="w-16 h-16 rounded object-cover"
            height={80}
            width={80}
          />
          <div className="flex-1">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-medium text-blue-600 hover:underline"
            >
              {title}
            </a>
          </div>
        </div>
      );
    });

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        🎵 Playlist Exchanger
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-green-700">
            Spotify Playlists
          </h3>
          <div className="flex flex-col gap-4">
            {renderPlaylists(spotifyPlaylists, "spotify")}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4 text-red-700">
            YouTube Playlists
          </h3>
          <div className="flex flex-col gap-4">
            {renderPlaylists(youtubePlaylists, "youtube")}
          </div>
        </div>
      </div>

      {selectedPlaylist && (
        <div className="mt-10 bg-white p-6 rounded-xl shadow-lg text-center">
          <p className="text-lg font-semibold mb-2">
            Selected:{" "}
            <span className="text-blue-600">
              {selectedPlaylist.name || selectedPlaylist.snippet?.title}
            </span>{" "}
            from <strong>{selectedPlaylist.platform}</strong>
          </p>
          <button
            onClick={handleConvert}
            className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-6 py-2 mt-3 rounded-lg"
          >
            Convert to{" "}
            {selectedPlaylist.platform === "spotify" ? "YouTube" : "Spotify"}
          </button>
        </div>
      )}
    </div>
  );
}
