"use client";

import { useState } from "react";
import { StarInput } from "@/components/StarRating";

export default function ReviewForm({ onSubmit }) {
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const submitting = status.state === "submitting";

  async function handleSubmit(e) {
    e.preventDefault();
    if (!author.trim() || !description.trim() || rating < 1) {
      setStatus({
        state: "error",
        message: "Nom, commentaire et note sont obligatoires.",
      });
      return;
    }
    setStatus({ state: "submitting", message: "" });
    try {
      await onSubmit({ author: author.trim(), description: description.trim(), rating });
      setAuthor("");
      setDescription("");
      setRating(0);
      setStatus({ state: "success", message: "Merci pour votre avis !" });
    } catch (err) {
      setStatus({ state: "error", message: err.message || "Une erreur est survenue." });
    }
  }

  const field =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900"
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Laisser un avis
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Partagez votre expérience avec la communauté.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="author" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Votre nom
        </label>
        <input
          id="author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Jean Dupont"
          className={field}
          maxLength={60}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Votre note
        </span>
        <StarInput value={rating} onChange={setRating} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Votre commentaire
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez votre expérience…"
          rows={4}
          className={`${field} resize-y`}
          maxLength={500}
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
        {submitting ? "Envoi…" : "Publier mon avis"}
      </button>
    </form>
  );
}
