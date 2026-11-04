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
      <button className="px-6 py-3 rounded-lg font-semibold transition-all shadow-md text-white w-60 text-center bg-red-600 hover:bg-red-700" onClick={() => signIn()}>Login with Youtube</button>
    </div>
  );
};

export default YTButton;
