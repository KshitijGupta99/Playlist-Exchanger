'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-500">
      <div className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl text-white text-center animate-fade-in">
        <h1 className="text-7xl font-extrabold mb-4 drop-shadow-md">404</h1>
        <p className="text-xl mb-6">Oops! This page does not exist.</p>
        <Link
          href="/"
          className="inline-block px-6 py-2 bg-white text-blue-600 font-semibold rounded-full shadow hover:bg-blue-100 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
