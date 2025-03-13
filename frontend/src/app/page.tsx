import { useSession } from "next-auth/react";
import LoginButton from "../components/LoginButton";
import LogoutButton from "../components/LogoutButton";
import Image from "next/image";
import Button from "@/components/Button";

export default async function Home() {

  return (
    <div>
      <h1>basic home page</h1>
      <div><Button /> </div>
    </div>
  );
}
