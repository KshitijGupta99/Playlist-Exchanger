"use client";
import YTButton from "@/components/ButtonYTLogin";
import LogoutButton from "@/components/LogoutButton";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import AppShell from "@/components/AppShell";
import GlassCard from "@/components/GlassCard";

interface SpotifyImage {
  url: string;
  height?: number | null;
  width?: number | null;
}

interface SpotifyUser {
  display_name: string;
  id: string;
  images: SpotifyImage[];
  // Add other fields as needed
}

interface SpotifyPlaylistItem {
  id: string;
  name: string;
  images: SpotifyImage[];
  // Add other fields as needed
}

interface SpotifyPlaylistResponse {
  items: SpotifyPlaylistItem[];
  // Add other fields as needed
}

export default function Dashboard() {
  const url = process.env.NEXT_PUBLIC_BACKEND_URI
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [playlist, setplaylist] = useState<SpotifyPlaylistResponse>(null);
  const [showPlaylist, setShowPlaylist] = useState<boolean>(false);
  const router = useRouter();
  const { hydrated, spotifyUser: authUser, spotifyToken } = useAuth();

  useEffect(() => {
    if (hydrated && !spotifyToken) router.replace("/");
  }, [hydrated, spotifyToken, router]);

  const getPlaylist = async () => {
    setShowPlaylist(true);
    if (playlist) return;
    const user = authUser || {};
    if (!user.id) return;
    const accessToken = spotifyToken;
    fetch(`${url}/v1/playlist/spotify`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Spotify Response:", data);
        if (data) {
          setplaylist(data);
        } else {
          console.error("❌ Authentication failed", data);
        }
      })
      .catch((err) => console.error("❌ Spotify Auth Error:", err));
  };

  useEffect(() => {
    setUser(authUser as SpotifyUser | null);
  }, [authUser]);

  return (
    <AppShell className="flex flex-col items-center justify-center">
  <GlassCard className="w-full max-w-3xl space-y-6 p-6 text-center sm:p-8">
    <div className="flex items-center justify-between gap-4">
      <div className="text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">Spotify space</p>
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
      </div>
      <LogoutButton />
    </div>

    {user ? (
      <>
        <div>
          <h2 className="mb-2 text-2xl font-semibold text-white">
            Welcome, {user.display_name}
          </h2>
          <Image
            src={user.images?.[0]?.url || ""}
            alt="Profile"
            width={100}
            height={100}
            className="mx-auto rounded-full shadow-md"
          />
          <p className="text-muted mt-2 text-sm">Spotify ID: {user.id}</p>
        </div>

        <div>
          <h4 className="text-muted mb-2 text-lg">Also, connect YouTube to exchange playlists</h4>
          <YTButton />
        </div>

        {!showPlaylist && (
          <button
            onClick={getPlaylist}
            className="glass-button rounded-xl bg-emerald-500/80 px-6 py-2 font-medium text-white"
          >
            Get Playlist Data
          </button>
        )}

        {playlist && showPlaylist && (
          <div className="glass-card-strong space-y-4 rounded-2xl p-6 text-left">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">Your Playlists</h3>
              <button
                onClick={() => setShowPlaylist(false)}
                className="font-medium text-rose-300 hover:underline"
              >
                Hide
              </button>
            </div>

            <ul className="space-y-4">
              {playlist.items.map((item: SpotifyPlaylistItem) => (
                <li
                  key={item.id}
                  className="playlist-item flex items-center gap-4 rounded-xl p-3"
                >
                  <Image
                    src={item.images?.[0]?.url}
                    alt="Playlist"
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <span className="font-medium text-white">{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </>
    ) : (
      <p className="text-lg text-gray-600">Loading...</p>
    )}
  </GlassCard>
</AppShell>

  );
}
