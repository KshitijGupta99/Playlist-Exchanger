"use client";
import SpotifyButton from "@/components/ButtonSpotifyLogin";
import YTButton from "@/components/ButtonYTLogin";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-10 text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to Playlist Exchanger 🎵</h1>

        <div className="flex flex-col gap-4 items-center">
          <SpotifyButton />
          <YTButton />
        </div>
      </div>
    </div>
  );
}
