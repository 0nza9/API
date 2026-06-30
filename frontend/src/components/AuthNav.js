"use client";

import Link from "next/link";
import { useSession, clearSession } from "@/lib/auth";

// Top-right auth widget for the hero: shows login/register links when logged
// out, or the user's email + logout when logged in.
export default function AuthNav() {
  const session = useSession();

  if (session?.user) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="hidden text-indigo-100 sm:inline">{session.user.email}</span>
        <button
          onClick={clearSession}
          className="rounded-lg bg-white/15 px-3 py-1.5 font-medium text-white ring-1 ring-inset ring-white/25 transition-colors hover:bg-white/25"
        >
          Déconnexion
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <Link
        href="/login"
        className="rounded-lg px-3 py-1.5 font-medium text-white transition-colors hover:bg-white/15"
      >
        Connexion
      </Link>
      <Link
        href="/register"
        className="rounded-lg bg-white px-3 py-1.5 font-medium text-indigo-600 shadow-sm transition-colors hover:bg-indigo-50"
      >
        Inscription
      </Link>
    </div>
  );
}
