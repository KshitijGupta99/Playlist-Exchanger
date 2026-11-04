"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export default function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="glass-button rounded-xl bg-slate-950/40 px-4 py-2 font-semibold text-white"
    >
      Log out
    </button>
  );
}
