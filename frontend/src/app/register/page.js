"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerUser, loginUser, saveSession } from "@/lib/auth";

const field =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const submitting = status.state === "submitting";

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setStatus({ state: "error", message: "Email et mot de passe requis." });
      return;
    }
    if (password.length < 8) {
      setStatus({
        state: "error",
        message: "Le mot de passe doit faire au moins 8 caractères.",
      });
      return;
    }
    if (password !== confirm) {
      setStatus({ state: "error", message: "Les mots de passe ne correspondent pas." });
      return;
    }
    setStatus({ state: "submitting", message: "" });
    try {
      await registerUser({ email: email.trim(), password });
      // Auto-connexion après inscription pour enchaîner directement.
      const session = await loginUser({ email: email.trim(), password });
      saveSession(session);
      router.push("/");
    } catch (err) {
      setStatus({ state: "error", message: err.message || "Inscription impossible." });
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
            Créer un compte
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Rejoignez la communauté en quelques secondes.
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8 caractères minimum"
              className={field}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirm" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Confirmer le mot de passe
            </label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              className={field}
            />
          </div>

          {status.message && (
            <p className="text-sm text-rose-600 dark:text-rose-400">{status.message}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-slate-900"
          >
            {submitting ? "Création…" : "Créer mon compte"}
          </button>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Déjà un compte ?{" "}
            <Link href="/login" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
