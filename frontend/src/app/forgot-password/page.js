"use client";

import Link from "next/link";
import { useState } from "react";
import { forgotPassword } from "@/lib/auth";

const field =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [resetToken, setResetToken] = useState(null);

  const submitting = status.state === "submitting";

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) {
      setStatus({ state: "error", message: "Email requis." });
      return;
    }
    setStatus({ state: "submitting", message: "" });
    try {
      const data = await forgotPassword({ email: email.trim() });
      setStatus({ state: "success", message: data.message });
      // En dev, l'API renvoie le token (pas d'envoi d'email). On l'affiche.
      setResetToken(data.resetToken || null);
    } catch (err) {
      setStatus({ state: "error", message: err.message || "Une erreur est survenue." });
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
            Mot de passe oublié
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Entrez votre email pour recevoir un lien de réinitialisation.
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

          {resetToken && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
              <p className="font-medium">Mode démo (pas d&apos;envoi d&apos;email)</p>
              <p className="mt-1">
                Utilisez ce lien pour réinitialiser :{" "}
                <Link
                  href={`/reset-password?token=${resetToken}`}
                  className="font-medium underline"
                >
                  réinitialiser mon mot de passe
                </Link>
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-slate-900"
          >
            {submitting ? "Envoi…" : "Envoyer le lien"}
          </button>
        </form>
      </div>
    </div>
  );
}
