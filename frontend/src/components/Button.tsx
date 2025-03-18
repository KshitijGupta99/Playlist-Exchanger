"use client";
const Button = () => {
  const signIn = async () => {
    const res = await fetch("http://localhost:5000/v1/auth/spotify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
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
