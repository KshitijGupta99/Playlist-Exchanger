"use client";
const SpotifyButton = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URI
  const signIn = async () => {
    try {
      const res = await fetch(`${url}/v1/auth/spotify`);
      if (!res.ok) throw new Error("Unable to start Spotify sign-in");
      const data = await res.json();
      if (!data.url) throw new Error("Spotify sign-in URL was not returned");
      window.location.href = data.url;
    } catch (error) {
      console.error("Spotify sign-in failed:", error);
    }
  };

  return (
    <div>
      <button className="glass-button w-60 rounded-xl bg-emerald-500/80 px-6 py-3 text-center font-semibold text-white" onClick={() => signIn()}>Login with Spotify</button>
    </div>
  );
};

export default SpotifyButton;
