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
      className="rounded-lg bg-gray-800 px-4 py-2 font-semibold text-white transition hover:bg-gray-900"
    >
      Log out
    </button>
  );
}
