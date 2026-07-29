// Aperçu des avis sur la page d'accueil : statistiques + 3 avis récents.
'use client';

import { useEffect, useState } from 'react';
import GetReviews from '@/service/avis';

function Stars({ note }) {
    return (
        <span aria-label={`${note} sur 5`}>
            <span className="text-warning">{'★'.repeat(note)}</span>
            <span className="text-base-300">{'★'.repeat(5 - note)}</span>
        </span>
    );
}

export default function LandingReviews() {
    const [reviews, setReviews] = useState(null);

    useEffect(() => {
        GetReviews().then((r) => setReviews(Array.isArray(r) ? r : []));
    }, []);

    if (reviews === null) {
        return (
            <div className="py-16 text-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    const count = reviews.length;
    const avg = count ? (reviews.reduce((s, r) => s + r.rating, 0) / count).toFixed(1) : '—';
    const recent = reviews.slice(0, 3);

    return (
        <section className="mx-auto max-w-5xl px-4 py-14">
            {/* Statistiques */}
            <div className="stats mb-12 w-full shadow">
                <div className="stat place-items-center">
                    <div className="stat-title">Avis publiés</div>
                    <div className="stat-value text-primary">{count}</div>
                </div>
                <div className="stat place-items-center">
                    <div className="stat-title">Note moyenne</div>
                    <div className="stat-value">{avg}<span className="text-lg font-normal"> / 5</span></div>
                </div>
            </div>

            <h2 className="mb-6 text-2xl font-bold">Avis récents</h2>
            {recent.length === 0 ? (
                <p className="opacity-70">Aucun avis pour le moment. Soyez le premier à en laisser un !</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-3">
                    {recent.map((a) => (
                        <div key={a.id} className="card bg-base-100 shadow-md transition hover:shadow-lg">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <h3 className="card-title text-base">{a.author}</h3>
                                    <Stars note={a.rating} />
                                </div>
                                <p className="opacity-80">{a.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-10 text-center">
                <a href="/avis" className="btn btn-primary">Voir tous les avis</a>
            </div>
        </section>
    );
}
