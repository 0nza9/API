"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { resetPassword } from "@/lib/auth";

// Read ?token=... on the client only (returns "" on the server / during
// hydration, then the real value) without a setState-in-effect.
const noopSubscribe = () => () => {};
function useUrlToken() {
  return useSyncExternalStore(
    noopSubscribe,
    () => new URLSearchParams(window.location.search).get("token") || "",
    () => "",
  );
}

const field =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100";

export default function ResetPasswordPage() {
  const router = useRouter();
  // Prefilled from the URL, but overridable if the user edits/pastes a token.
  const urlToken = useUrlToken();
  const [tokenEdit, setTokenEdit] = useState(null);
  const token = tokenEdit ?? urlToken;
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const submitting = status.state === "submitting";

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token.trim()) {
      setStatus({ state: "error", message: "Token manquant." });
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
      await resetPassword({ token: token.trim(), password });
      setStatus({
        state: "success",
        message: "Mot de passe mis à jour. Redirection vers la connexion…",
      });
      setTimeout(() => router.push("/login"), 1200);
    } catch (err) {
      setStatus({ state: "error", message: err.message || "Réinitialisation impossible." });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/login" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
            ← Retour à la connexion
          </Link>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Nouveau mot de passe
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Choisissez un nouveau mot de passe pour votre compte.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="token" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Token de réinitialisation
            </label>
            <input
              id="token"
              type="text"
              value={token}
              onChange={(e) => setTokenEdit(e.target.value)}
              placeholder="Collez votre token ici"
              className={`${field} font-mono text-xs`}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Nouveau mot de passe
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
            <p
              className={`text-sm ${
                status.state === "error"
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {status.message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-slate-900"
          >
            {submitting ? "Mise à jour…" : "Réinitialiser"}
          </button>
        </form>
      </div>
    </div>
  );
}
