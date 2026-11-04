"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { persistAuth } from "@/components/AuthProvider";
import AppShell from "@/components/AppShell";
import GlassCard from "@/components/GlassCard";

export default function SpotifyCallback() {
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_BACKEND_URI


  useEffect(() => {
    console.log("Youtube Callback Page Loaded");
    // const urlParams = new URLSearchParams(window.location.search);
    console.log("🔍 Full URL:", window.location.href);
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    console.log("🎟️ Authorization Code:", code);
    if (!code) {
      console.error("YouTube authorization code is missing");
      router.replace("/");
      return;
    }

    try {
        fetch(`${url}/v1/auth/youtube`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.access_token && data.user) {
              persistAuth("access_token_youtube", "youtubeuser", data.access_token, data.user);

              // Check if Spotify token exists
              if (localStorage.getItem("access_token") !== null) {
                router.push("/dashboard/home"); // Redirect to home if both YouTube and Spotify are logged in
              } else {
                router.push("/dashboard/ytdashboard"); // Redirect to YouTube dashboard otherwise
              }
            } else throw new Error(data.error || "Authentication failed");
          })
          .catch((err) => console.error("YouTube authentication failed:", err));
    } catch (error) {
      console.error("❌ Error during fetch:", error);
    }
  }, [router, url]);

  return <AppShell className="flex items-center justify-center"><GlassCard className="px-8 py-10 text-center" strong><p className="animate-pulse text-lg text-rose-100">Connecting to YouTube...</p></GlassCard></AppShell>;
}
