"use client";

import SpotifyButton from "@/components/ButtonSpotifyLogin";
import LogoutButton from "@/components/LogoutButton";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import GlassCard from "@/components/GlassCard";

export default function DashboardPage() {
    const url = process.env.NEXT_PUBLIC_BACKEND_URI
    const [playlists, setPlaylists] = useState([]);
    const router = useRouter();
    const { hydrated, youtubeToken } = useAuth();

    useEffect(() => {
        if (hydrated && !youtubeToken) router.replace("/");
    }, [hydrated, youtubeToken, router]);

    const getPlaylist = async () => {
        const accessToken = youtubeToken;
        if (!accessToken) {
            console.error("Access token is missing!");
            return;
        }
        console.log("Access Token:", accessToken);

        const res = await fetch(`${url}/v1/playlist/youtube`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`, // Pass token in Authorization header
            },
        });

        const data = await res.json();
        console.log(data);
        setPlaylists(data);
    };

    return (
        <AppShell>
            <GlassCard className="mx-auto max-w-4xl p-6 sm:p-8">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-300">YouTube space</p>
                        <h1 className="text-3xl font-bold text-white">YouTube Dashboard</h1>
                    </div>
                    <LogoutButton />
                </div>
                <p className="text-muted mb-6">
                    Welcome to your YouTube Dashboard! Here you can view your playlists and manage them.
                </p>
                <h4 className="text-muted mb-2">Connect Spotify to exchange playlists</h4>
                <SpotifyButton />
                <button
                    onClick={getPlaylist}
                    className="glass-button mb-6 rounded-xl bg-cyan-500/80 px-4 py-2 font-semibold text-white"
                >
                    Fetch Playlists
                </button>

                {playlists.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {playlists.map((playlist) => (
                            <div
                                key={playlist.id}
                                className="glass-card-strong overflow-hidden rounded-2xl border border-white/10"
                            >
                                <Image
                                    src={playlist.snippet.thumbnails.default.url}
                                    alt="Playlist Thumbnail"
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold text-white">
                                        {playlist.snippet.title}
                                    </h2>
                                    <p className="text-muted mt-2 text-sm">
                                        {playlist.snippet.description || "No description available."}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center mt-6">
                        <h2 className="text-xl font-semibold text-white">No Playlists Found</h2>
                        <p className="text-muted">
                            Please log in to your YouTube account and create a playlist to see it here.
                        </p>
                    </div>
                )}
            </GlassCard>
        </AppShell>
    );
}
