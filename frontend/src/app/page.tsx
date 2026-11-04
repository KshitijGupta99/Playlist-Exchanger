"use client";
import SpotifyButton from "@/components/ButtonSpotifyLogin";
import YTButton from "@/components/ButtonYTLogin";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppShell from "@/components/AppShell";
import GlassCard from "@/components/GlassCard";

export default function Home() {
  const router = useRouter();
  const { hydrated, spotifyToken, youtubeToken } = useAuth();

  useEffect(() => {
    if (!hydrated) return;
    if (spotifyToken && youtubeToken) router.replace("/dashboard/home");
    else if (spotifyToken) router.replace("/dashboard");
    else if (youtubeToken) router.replace("/dashboard/ytdashboard");
  }, [hydrated, spotifyToken, youtubeToken, router]);

  if (!hydrated || spotifyToken || youtubeToken) {
    return <AppShell className="flex items-center justify-center"><p className="text-muted animate-pulse">Loading your workspace...</p></AppShell>;
  }

  return (
    <AppShell className="flex flex-col items-center justify-center">
      <GlassCard className="w-full max-w-xl space-y-8 p-7 text-center sm:p-10" strong>
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">Playlist Exchanger</p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Your music, beautifully connected <span aria-hidden="true">🎵</span></h1>
          <p className="text-muted">Move playlists between Spotify and YouTube in a few clicks.</p>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <SpotifyButton />
          <YTButton />
        </div>
      </GlassCard>
    </AppShell>
  );
}
