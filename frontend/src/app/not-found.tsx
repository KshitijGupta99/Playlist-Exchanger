'use client';

import Link from 'next/link';
import AppShell from "@/components/AppShell";
import GlassCard from "@/components/GlassCard";

export default function NotFound() {
  return (
    <AppShell className="flex items-center justify-center">
      <GlassCard className="animate-fade-in p-10 text-center" strong>
        <h1 className="text-7xl font-extrabold mb-4 drop-shadow-md">404</h1>
        <p className="text-muted mb-6 text-xl">Oops! This page does not exist.</p>
        <Link
          href="/"
          className="glass-button inline-block rounded-xl bg-cyan-500/80 px-6 py-2 font-semibold text-white"
        >
          Go Home
        </Link>
      </GlassCard>
    </AppShell>
  );
}
