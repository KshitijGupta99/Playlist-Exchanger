"use client";
const SpotifyButton = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URI
  const signIn = async () => {
    const res = await fetch(`${url}/v1/auth/spotify`, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log(data, " data");
    window.location.href = data.url;
  };

  return (
    <div>
      <button className="px-6 py-3 rounded-lg font-semibold transition-all shadow-md text-white w-60 text-center bg-green-600 hover:bg-green-700" onClick={() => signIn()}>Login with Spotify</button>
    </div>
  );
};

export default SpotifyButton;
