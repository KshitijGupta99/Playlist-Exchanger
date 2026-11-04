import type { ReactNode } from "react";

export default function AppShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <main className={`app-shell px-4 py-6 sm:px-6 sm:py-10 ${className}`}>{children}</main>;
}
