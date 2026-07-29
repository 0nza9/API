// Vue de modération réservée aux administrateurs (daisyUI).
// Protège la route côté client : redirige si l'utilisateur n'est pas admin.
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GetMe from '@/service/me';
import { GetModeration, AuthorizeReview, EditReview, DeleteReview } from '@/service/avis';

function Row({ avis, onChange }) {
    const [editing, setEditing] = useState(false);
    const [description, setDescription] = useState(avis.description);
    const [rating, setRating] = useState(avis.rating);
    const [busy, setBusy] = useState(false);

    const approve = async () => { setBusy(true); await AuthorizeReview(avis.id); setBusy(false); onChange(); };
    const save = async () => { setBusy(true); await EditReview(avis.id, { description, rating: Number(rating) }); setBusy(false); setEditing(false); onChange(); };
    const remove = async () => {
        if (!confirm('Supprimer cet avis définitivement ?')) return;
        setBusy(true); await DeleteReview(avis.id); setBusy(false); onChange();
    };

    return (
        <div className="card bg-base-100 shadow-md">
            <div className="card-body p-5">
                <div className="flex items-center justify-between">
                    <span className="font-semibold">{avis.author}</span>
                    <span className={`badge ${avis.authorized ? 'badge-success' : 'badge-warning'}`}>
                        {avis.authorized ? 'Publié' : 'En attente'}
                    </span>
                </div>

                {editing ? (
                    <div className="mt-2 space-y-2">
                        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="textarea w-full" />
                        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="select">
                            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
                        </select>
                    </div>
                ) : (
                    <p className="opacity-80">{avis.description} <span className="opacity-50">({avis.rating}★)</span></p>
                )}

                <div className="card-actions mt-3">
                    {!avis.authorized && !editing && (
                        <button onClick={approve} disabled={busy} className="btn btn-success btn-sm">Approuver</button>
                    )}
                    {editing ? (
                        <>
                            <button onClick={save} disabled={busy} className="btn btn-primary btn-sm">Enregistrer</button>
                            <button onClick={() => setEditing(false)} disabled={busy} className="btn btn-ghost btn-sm">Annuler</button>
                        </>
                    ) : (
                        <button onClick={() => setEditing(true)} disabled={busy} className="btn btn-outline btn-sm">Modifier</button>
                    )}
                    <button onClick={remove} disabled={busy} className="btn btn-error btn-sm">Supprimer</button>
                </div>
            </div>
        </div>
    );
}

export default function Moderation() {
    const router = useRouter();
    const [state, setState] = useState('checking');
    const [reviews, setReviews] = useState([]);

    const load = async () => {
        const data = await GetModeration();
        if (!data.error) setReviews(data);
    };

    useEffect(() => {
        (async () => {
            const me = await GetMe();
            if (!me) { router.replace('/login'); return; }
            if (!me.isAdmin) { setState('denied'); return; }
            setState('ready');
            load();
        })();
    }, [router]);

    if (state === 'checking') {
        return <div className="py-16 text-center"><span className="loading loading-spinner loading-lg"></span></div>;
    }
    if (state === 'denied') {
        return (
            <div className="mx-auto max-w-2xl px-4 py-10">
                <div className="alert alert-error"><span>Accès réservé aux administrateurs.</span></div>
            </div>
        );
    }

    const pending = reviews.filter((r) => !r.authorized).length;

    return (
        <div className="mx-auto max-w-2xl px-4 py-10">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Modération des avis</h1>
                {pending > 0 && <span className="badge badge-warning badge-lg">{pending} en attente</span>}
            </div>
            {reviews.length === 0 ? (
                <p className="opacity-70">Aucun avis.</p>
            ) : (
                <div className="space-y-4">
                    {reviews.map((a) => <Row key={a.id} avis={a} onChange={load} />)}
                </div>
            )}
        </div>
    );
}
