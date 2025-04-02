"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SpotifyCallback() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      fetch("http://localhost:5000/v1/auth/spotify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Spotify User Data:", data.user);
          setUser(data.user);
          localStorage.setItem("spotifyUser", JSON.stringify(data.user)); // Save for future use
          router.push("/dashboard"); // Redirect after auth
        })
        .catch((err) => console.error("Spotify Auth Error:", err));
    }
  }, []);

  return <h1>Authenticating with Spotify...</h1>;
}
