"use client";

import SpotifyButton from "@/components/ButtonSpotifyLogin";
import LogoutButton from "@/components/LogoutButton";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useEffect, useState } from "react";

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
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-800">YouTube Dashboard</h1>
                    <LogoutButton />
                </div>
                <p className="text-gray-600 mb-6">
                    Welcome to your YouTube Dashboard! Here you can view your playlists and manage them.
                </p>
                <h4>Also you should log in to Spotify</h4>
                <SpotifyButton />
                <button
                    onClick={getPlaylist}
                    className="bg-blue-500 hover:bg-blue-600  text-white font-semibold py-2 px-4 rounded mb-6"
                >
                    Fetch Playlists
                </button>

                {playlists.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {playlists.map((playlist) => (
                            <div
                                key={playlist.id}
                                className="bg-gray-50 border border-gray-200 rounded-lg shadow-md overflow-hidden"
                            >
                                <Image
                                    src={playlist.snippet.thumbnails.default.url}
                                    alt="Playlist Thumbnail"
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        {playlist.snippet.title}
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-2">
                                        {playlist.snippet.description || "No description available."}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center mt-6">
                        <h2 className="text-xl font-semibold text-gray-800">No Playlists Found</h2>
                        <p className="text-gray-600">
                            Please log in to your YouTube account and create a playlist to see it here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
