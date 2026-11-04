"use client";
const YTButton = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URI
  const signIn = async () => {
    try {
      const res = await fetch(`${url}/v1/auth/youtube`);
      if (!res.ok) throw new Error("Unable to start YouTube sign-in");
      const data = await res.json();
      if (!data.url) throw new Error("YouTube sign-in URL was not returned");
      window.location.href = data.url;
    } catch (error) {
      console.error("YouTube sign-in failed:", error);
    }
  };

  return (
    <div>
      <button className="glass-button w-60 rounded-xl bg-rose-500/80 px-6 py-3 text-center font-semibold text-white" onClick={() => signIn()}>Login with YouTube</button>
    </div>
  );
};

export default YTButton;
