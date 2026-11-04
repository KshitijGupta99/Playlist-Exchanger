"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import LogoutButton from "@/components/LogoutButton";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import GlassCard from "@/components/GlassCard";
 
export default function HomePage() {
  const url = process.env.NEXT_PUBLIC_BACKEND_URI;
  const [spotifyPlaylists, setSpotifyPlaylists] = useState([]);
  const [youtubePlaylists, setYoutubePlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const router = useRouter();
  const { hydrated, spotifyToken, youtubeToken } = useAuth();

  useEffect(() => {
    if (hydrated && (!spotifyToken || !youtubeToken)) {
      router.replace(spotifyToken ? "/dashboard" : "/dashboard/ytdashboard");
    }
  }, [hydrated, spotifyToken, youtubeToken, router]);

  useEffect(() => {
    if (!hydrated || !spotifyToken || !youtubeToken) return;
    const Youtube_accessToken = youtubeToken;
    const Spotify_accessToken = spotifyToken;

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
  }, [hydrated, spotifyToken, youtubeToken]);

  const handleConvert = async () => {
    if (!selectedPlaylist) return;
    const from = selectedPlaylist.platform;
    const to = from === "spotify" ? "youtube" : "spotify";

    try {
      const res = await fetch(`${url}/v1/playlist/convert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "spotify-token": spotifyToken,
          "youtube-token": youtubeToken,
        },
        body: JSON.stringify(selectedPlaylist),
      });
      const data = await res.json();
      if (!res.ok) {
        const reason = data.providerReason ? ` (${data.providerReason})` : "";
        const providerMessage = data.providerMessage && data.providerMessage !== data.error
          ? `\n\nProvider details: ${data.providerMessage}`
          : "";
        throw new Error(`${data.error || `Conversion failed (${res.status})`}${reason}${providerMessage}`);
      }
      alert(`Converted to ${to} ✔️`);
    } catch (error) {
      console.error("Playlist conversion failed:", error);
      alert(error.message || "Playlist conversion failed");
    }
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
          className="playlist-item flex cursor-pointer items-center gap-4 rounded-xl p-4"
          data-selected={isSelected}
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
              className="text-lg font-semibold text-cyan-200 hover:underline"
            >
              {title}
            </a>
          </div>
        </div>
      );
    });

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
      <div className="mb-10 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">Your library</p>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Playlist Exchanger <span aria-hidden="true">🎵</span></h2>
        </div>
        <LogoutButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h3 className="mb-6 text-2xl font-bold text-emerald-300">
            Spotify Playlists
          </h3>
          <div className="flex flex-col gap-5">
            {renderPlaylists(spotifyPlaylists, "spotify")}
          </div>
        </div>

        <div>
          <h3 className="mb-6 text-2xl font-bold text-rose-300">
            YouTube Playlists
          </h3>
          <div className="flex flex-col gap-5">
            {renderPlaylists(youtubePlaylists, "youtube")}
          </div>
        </div>
      </div>

      {selectedPlaylist && (
        <div className="mt-14 text-center">
          <GlassCard className="inline-block p-6" strong>
            <p className="mb-4 text-lg font-medium text-white">
              Selected Playlist:
              <span className="ml-1 font-bold text-cyan-200">
                {selectedPlaylist.name || selectedPlaylist.snippet?.title}
              </span>{" "}
              from <strong>{selectedPlaylist.platform}</strong>
            </p>
            <button
              onClick={handleConvert}
              className="glass-button rounded-xl bg-cyan-500/80 px-6 py-2 font-semibold text-white"
            >
              Convert to{" "}
              {selectedPlaylist.platform === "spotify" ? "YouTube" : "Spotify"}
            </button>
          </GlassCard>
        </div>
      )}
      </div>
    </AppShell>
  );
}
