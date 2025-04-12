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
    if(playlist) return;
    const user = JSON.parse(localStorage.getItem("spotifyUser") || "{}");
    if(!user.id) return;
    const rawToken = localStorage.getItem("access_token");
    const accessToken = rawToken?.replace(/^"(.*)"$/, "$1");
    fetch("http://localhost:5000/v1/playlist/spotify", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },})
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
  }
  

    

  useEffect(() => {
    const storedUser = localStorage.getItem("spotifyUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <div>
          <h2>Welcome, {user.display_name}</h2>
          <img src={user.images?.[0]?.url} alt="Profile" width="100" />
          <p>Spotify ID: {user.id}</p>

          <h4>Also you should login to youtube</h4>
          <YTButton />
          {!showPlaylist && <button onClick={getPlaylist}>Get PLaylist Data</button>}
          {playlist && showPlaylist && (
            <div>
              <button onClick = {()=>setShowPlaylist(false)} > hide </button>
              <h3>Your Playlists:</h3>
              <ul>
                {playlist.items.map((item: any) => (
                  <li key={item.id}>
                    <img src={item.images?.[0]?.url} alt="Playlist" width="50" />
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
