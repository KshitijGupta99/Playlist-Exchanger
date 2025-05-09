"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function HomePage() {
  const url = process.env.NEXT_PUBLIC_BACKEND_URI;
  const [spotifyPlaylists, setSpotifyPlaylists] = useState([]);
  const [youtubePlaylists, setYoutubePlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    let rawToken = localStorage.getItem("access_token_youtube");
    const Youtube_accessToken = rawToken?.replace(/^"(.*)"$/, "$1");
    rawToken = localStorage.getItem("access_token");
    const Spotify_accessToken = rawToken?.replace(/^"(.*)"$/, "$1");

    // Fetch Spotify playlists
    fetch(`${url}/v1/playlist/spotify`, {
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
    fetch(`${url}/v1/playlist/youtube`, {
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

    const res = await fetch(`${url}/v1/playlist/convert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "spotify-token": localStorage.getItem("access_token"),
        "youtube-token": localStorage.getItem("access_token_youtube"),
      },
      body: JSON.stringify(selectedPlaylist),
    });

    const data = await res.json();
    alert(`Converted to ${to} ✔️`);
  };

  const renderPlaylists = (playlists, platform) =>
    playlists.map((p) => {
      const isSelected =
        selectedPlaylist?.id === p.id &&
        selectedPlaylist?.platform === platform;
      const title = p.name || p.snippet?.title || "Untitled";
      console.log(p);
      const image =
        p.images?.[0]?.url || p.snippet?.thumbnails?.default?.url || null;
      const url =
        p.external_urls?.spotify || p.snippet?.thumbnails?.default?.url || "#";

      return (
        <div
          key={p.id}
          onClick={() => setSelectedPlaylist({ ...p, platform })}
          className={`flex items-center gap-4 bg-white/90 backdrop-blur rounded-xl p-4 border-2 transition-all duration-200 shadow hover:shadow-md hover:bg-white/95 cursor-pointer ${
            isSelected ? "border-blue-500" : "border-transparent"
          }`}
        >
          {image !== null && (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
              <Image
                src={image}
                alt="Playlist Cover"
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-blue-600 hover:underline"
            >
              {title}
            </a>
          </div>
        </div>
      );
    });

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-800 drop-shadow">
        🎵 Playlist Exchanger
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h3 className="text-2xl font-bold text-green-700 mb-6">
            Spotify Playlists
          </h3>
          <div className="flex flex-col gap-5">
            {renderPlaylists(spotifyPlaylists, "spotify")}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-red-700 mb-6">
            YouTube Playlists
          </h3>
          <div className="flex flex-col gap-5">
            {renderPlaylists(youtubePlaylists, "youtube")}
          </div>
        </div>
      </div>

      {selectedPlaylist && (
        <div className="mt-14 text-center">
          <div className="inline-block bg-white shadow-lg rounded-xl p-6">
            <p className="text-lg font-medium mb-4 text-gray-700">
              Selected Playlist:
              <span className="text-blue-600 font-bold ml-1">
                {selectedPlaylist.name || selectedPlaylist.snippet?.title}
              </span>{" "}
              from <strong>{selectedPlaylist.platform}</strong>
            </p>
            <button
              onClick={handleConvert}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Convert to{" "}
              {selectedPlaylist.platform === "spotify" ? "YouTube" : "Spotify"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
