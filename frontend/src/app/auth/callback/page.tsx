"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { persistAuth } from "@/components/AuthProvider";

export default function SpotifyCallback() {
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_BACKEND_URI

  useEffect(() => {
    console.log("Spotify Callback Page Loaded");
    // const urlParams = new URLSearchParams(window.location.search);
    console.log("🔍 Full URL:", window.location.href);
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    console.log("🎟️ Authorization Code:", code);
    if (!code) {
      console.error("Spotify authorization code is missing");
      router.replace("/");
      return;
    }

    try {
        fetch(`${url}/v1/auth/spotify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.access_token && data.user) {
              persistAuth("access_token", "spotifyUser", data.access_token, data.user);
              if(localStorage.getItem("access_token_youtube") !== null){
                // localStorage.removeItem("access_token");
                router.push("/dashboard/home"); 
              }else{
                router.push("/dashboard"); // ✅ Redirect to dashboard
              }
            } else throw new Error(data.error || "Authentication failed");
          })
          .catch((err) => console.error("Spotify authentication failed:", err));
    } catch (error) {
      console.error("❌ Error during fetch:", error);
    }
  }, [router, url]);

  return <h1>Authenticating with Spotify...</h1>;
}
