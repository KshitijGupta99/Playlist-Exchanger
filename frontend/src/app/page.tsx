"use client"
import { useSession } from "next-auth/react";
import Image from "next/image";
import SpotifyButton from "@/components/ButtonSpotifyLogin";
import YTButton from "@/components/ButtonYTLogin";

export default function Home() {

  return (
    <div>
      <h1>basic home page</h1>
      <div><SpotifyButton /> </div>
      <div><YTButton/></div>
    </div>
  );
}
