"use client";
const Button = () => {
  const signIn = async () => {
    const res = await fetch("/api/auth/spotify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ provider: "spotify" }),
    });
    const data = await res.json();
    console.log(data);

  };

  return (
    <div>
      <button onClick={() => signIn()}>Login with Spotify</button>
    </div>
  );
};

export default Button;
