"use client";
const Button = () => {
  const signIn = async () => {
    const res = await fetch("http://localhost:5000/v1/auth/spotify", {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <div>
      <button onClick={() => signIn()}>Login with Spotify</button>
    </div>
  );
};

export default Button;
