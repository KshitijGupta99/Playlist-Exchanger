"use client"
import { useSession } from "next-auth/react";
import Image from "next/image";
import Button from "@/components/Button";

export default function Home() {

  return (
    <div>
      <h1>basic home page</h1>
      <div><Button /> </div>
    </div>
  );
}
