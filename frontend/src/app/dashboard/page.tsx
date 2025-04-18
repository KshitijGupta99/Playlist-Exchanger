"use client";
import YTButton from "@/components/ButtonYTLogin";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [playlist, setplaylist] = useState<any>(null);
  const [showPlaylist, setShowPlaylist] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getPlaylist = async () => {
    setShowPlaylist(true);
    if (playlist) return;
    const user = JSON.parse(localStorage.getItem("spotifyUser") || "{}");
    if (!user.id) return;
    const rawToken = localStorage.getItem("access_token");
    const accessToken = rawToken?.replace(/^"(.*)"$/, "$1");
    fetch("http://localhost:5000/v1/playlist/spotify", {
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
    const storedUser = localStorage.getItem("spotifyUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-6">
  <div className="max-w-3xl w-full bg-white shadow-xl rounded-2xl p-8 text-center space-y-6">
    <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>

    {user ? (
      <>
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Welcome, {user.display_name}
          </h2>
          <img
            src={user.images?.[0]?.url}
            alt="Profile"
            width="100"
            className="mx-auto rounded-full shadow-md"
          />
          <p className="text-sm text-gray-500 mt-2">Spotify ID: {user.id}</p>
        </div>

        <div>
          <h4 className="text-lg text-gray-700 mb-2">Also, you should log in to YouTube</h4>
          <YTButton />
        </div>

        {!showPlaylist && (
          <button
            onClick={getPlaylist}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition"
          >
            Get Playlist Data
          </button>
        )}

        {playlist && showPlaylist && (
          <div className="bg-gray-50 p-6 rounded-xl shadow-inner space-y-4 text-left">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">Your Playlists</h3>
              <button
                onClick={() => setShowPlaylist(false)}
                className="text-red-600 font-medium hover:underline"
              >
                Hide
              </button>
            </div>

            <ul className="space-y-4">
              {playlist.items.map((item: any) => (
                <li
                  key={item.id}
                  className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm"
                >
                  <img
                    src={item.images?.[0]?.url}
                    alt="Playlist"
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <span className="font-medium text-gray-700">{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </>
    ) : (
      <p className="text-lg text-gray-600">Loading...</p>
    )}
  </div>
</div>

  );
}
