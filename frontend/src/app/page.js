"use client";

import { useEffect, useState } from "react";
import { fetchReviews, createReview, SAMPLE_REVIEWS } from "@/lib/api";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";
import ReviewStats from "@/components/ReviewStats";

export default function Home() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let active = true;
    fetchReviews()
      .then((data) => {
        if (!active) return;
        setReviews(Array.isArray(data) ? data : []);
        setOffline(false);
      })
      .catch(() => {
        if (!active) return;
        setReviews(SAMPLE_REVIEWS);
        setOffline(true);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(payload) {
    try {
      const created = await createReview(payload);
      setReviews((prev) => [created, ...prev]);
    } catch (err) {
      // Backend unreachable: add locally so the demo keeps working.
      if (offline) {
        setReviews((prev) => [
          {
            id: -Date.now(),
            ...payload,
            date: new Date().toISOString(),
            authorized: false,
          },
          ...prev,
        ]);
        return;
      }
      throw err;
    }
  }

  // Newest first.
  const sorted = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 dark:border-slate-800">
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(60rem_30rem_at_top,white,transparent)]" />
        <div className="relative mx-auto max-w-5xl px-6 py-16 text-center sm:py-24">
          <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white ring-1 ring-inset ring-white/25">
            ★ Avis vérifiés
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            MDS Avis
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-100">
            Découvrez ce que pensent nos clients, et partagez à votre tour votre
            expérience.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        {offline && (
          <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
            API injoignable — affichage de données de démonstration. Lancez le
            backend (<code className="font-mono">api/</code>) pour des données
            réelles.
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Reviews column */}
          <section className="order-2 lg:order-1">
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Les avis
              </h2>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {sorted.length} au total
              </span>
            </div>

            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-44 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                  />
                ))}
              </div>
            ) : sorted.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
                <p className="text-slate-500 dark:text-slate-400">
                  Aucun avis pour le moment. Soyez le premier à en laisser un !
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {sorted.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </section>

          {/* Sidebar: stats + form */}
          <aside className="order-1 flex flex-col gap-8 lg:order-2">
            <ReviewStats reviews={sorted} />
            <ReviewForm onSubmit={handleSubmit} />
          </aside>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400 dark:border-slate-800">
        MDS Avis — projet BTS SIO
      </footer>
    </div>
  );
}
