// Liste publique des avis (daisyUI). Charge les données depuis l'API.
'use client';

import { useEffect, useState } from 'react';
import GetReviews from '@/service/avis';

function Stars({ note }) {
    return (
        <span aria-label={`Note : ${note} sur 5`}>
            <span className="text-warning">{'★'.repeat(note)}</span>
            <span className="text-base-300">{'★'.repeat(5 - note)}</span>
        </span>
    );
}

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            const result = await GetReviews();
            if (result.error) setError(result.message);
            else setReviews(result);
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return (
            <div className="py-16 text-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }
    if (error) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-10">
                <div className="alert alert-error"><span>{error}</span></div>
            </div>
        );
    }
    if (reviews.length === 0) {
        return <p className="py-16 text-center opacity-70">Aucun avis pour le moment.</p>;
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-10">
            <h1 className="mb-6 text-2xl font-bold">Les avis</h1>
            <div className="space-y-4">
                {reviews.map((avis) => (
                    <div key={avis.id} className="card bg-base-100 shadow-md">
                        <div className="card-body p-5">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold">{avis.author}</h3>
                                <Stars note={avis.rating} />
                            </div>
                            <p className="opacity-80">{avis.description}</p>
                            <div className="text-xs opacity-50">
                                {new Date(avis.createdAt).toLocaleDateString('fr-FR')}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
