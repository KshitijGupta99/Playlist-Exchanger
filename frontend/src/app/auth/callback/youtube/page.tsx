"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SpotifyCallback() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("Youtube Callback Page Loaded");
    // const urlParams = new URLSearchParams(window.location.search);
    console.log("🔍 Full URL:", window.location.href);
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    console.log("🎟️ Authorization Code:", code);
    if (code) {
      try {
        fetch("http://localhost:5000/v1/auth/youtube", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("✅ Youtube Response:", data);
            if (data.access_token) {
              setUser(data.user);
              localStorage.setItem("youtubeuser", JSON.stringify(data.user));
              localStorage.setItem("access_token_youtube", JSON.stringify(data.access_token));
              router.push("/dashboard/ytdashboard"); // ✅ Redirect to dashboard
            } else {
              console.error("❌ Authentication failed", data);
            }
          })
          .catch((err) => console.error("❌ Youyube Auth Error:", err));
      } catch (error) {
        console.error("❌ Error during fetch:", error);
      }
    }
  }, []);

  return <h1>Authenticating with Youtube...</h1>;
}
