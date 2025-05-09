"use client";
const YTButton = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URI
  console.log(url);
  const signIn = async () => {
    const res = await fetch(`${url}/v1/auth/youtube`, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log(data);
    window.location.href = data.url;
  };

  return (
    <div>
      <button className="px-6 py-3 rounded-lg font-semibold transition-all shadow-md text-white w-60 text-center bg-red-600 hover:bg-red-700" onClick={() => signIn()}>Login with Youtube</button>
    </div>
  );
};

export default YTButton;
