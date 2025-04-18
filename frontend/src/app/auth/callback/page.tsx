"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SpotifyCallback() {
  const router = useRouter();

  useEffect(() => {
    console.log("Spotify Callback Page Loaded");
    // const urlParams = new URLSearchParams(window.location.search);
    console.log("🔍 Full URL:", window.location.href);
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    console.log("🎟️ Authorization Code:", code);
    if (code) {
      try {
        fetch("http://localhost:5000/v1/auth/spotify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("✅ Spotify Response:", data);
            if (data.access_token && data.user) {
              localStorage.setItem("spotifyUser", JSON.stringify(data.user));
              localStorage.setItem("access_token", JSON.stringify(data.access_token));
              if(localStorage.getItem("access_token_youtube") !== null){
                // localStorage.removeItem("access_token");
                router.push("/dashboard/home"); 
              }else{
                router.push("/dashboard"); // ✅ Redirect to dashboard
              }
            } else {
              console.error("❌ Authentication failed", data);
            }
          })
          .catch((err) => console.error("❌ Spotify Auth Error:", err));
      } catch (error) {
        console.error("❌ Error during fetch:", error);
      }
    }
  }, []);

  return <h1>Authenticating with Spotify...</h1>;
}
