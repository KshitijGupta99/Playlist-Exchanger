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
      <button className="px-6 py-3 rounded-lg font-semibold transition-all shadow-md text-white w-60 text-center bg-green-600 hover:bg-green-700" onClick={() => signIn()}>Login with Spotify</button>
    </div>
  );
};

export default SpotifyButton;
