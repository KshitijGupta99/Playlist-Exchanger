"use client";
const YTButton = () => {
  const signIn = async () => {
    const res = await fetch("http://localhost:5000/v1/auth/youtube", {
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
      <button onClick={() => signIn()}>Login with Youtube</button>
    </div>
  );
};

export default YTButton;
