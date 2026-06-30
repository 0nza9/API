"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginUser, saveSession } from "@/lib/auth";

const field =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const submitting = status.state === "submitting";

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setStatus({ state: "error", message: "Email et mot de passe requis." });
      return;
    }
    setStatus({ state: "submitting", message: "" });
    try {
      const session = await loginUser({ email: email.trim(), password });
      saveSession(session);
      router.push("/");
    } catch (err) {
      setStatus({ state: "error", message: err.message || "Connexion impossible." });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
            ← Retour aux avis
          </Link>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Connexion
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Heureux de vous revoir.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              className={field}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={field}
            />
          </div>

          <div className="-mt-2 text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          {status.message && (
            <p className="text-sm text-rose-600 dark:text-rose-400">{status.message}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-slate-900"
          >
            {submitting ? "Connexion…" : "Se connecter"}
          </button>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Pas encore de compte ?{" "}
            <Link href="/register" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
              Créer un compte
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
