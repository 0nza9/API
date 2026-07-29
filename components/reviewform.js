// Formulaire public de publication d'un avis (daisyUI).
'use client';

import { useState } from 'react';
import { PostReview } from '@/service/avis';

export default function ReviewForm() {
    const [author, setAuthor] = useState('');
    const [email, setEmail] = useState('');
    const [rating, setRating] = useState(5);
    const [description, setDescription] = useState('');
    const [website, setWebsite] = useState(''); // honeypot anti-spam (caché)

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const validate = () => {
        const e = {};
        if (!author.trim()) e.author = 'Le nom est requis.';
        else if (author.length > 80) e.author = '80 caractères maximum.';
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email invalide.';
        if (!description.trim()) e.description = 'Le commentaire est requis.';
        else if (description.length > 1000) e.description = '1000 caractères maximum.';
        if (rating < 1 || rating > 5) e.rating = 'Note entre 1 et 5.';
        return e;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length > 0) return;

        setSubmitting(true);
        const result = await PostReview({
            author,
            email: email || undefined,
            rating: Number(rating),
            description,
            website,
        });
        setSubmitting(false);

        if (result.error) {
            setErrors({ form: result.message });
            return;
        }
        setSuccess(true);
        setAuthor(''); setEmail(''); setRating(5); setDescription('');
    };

    if (success) {
        return (
            <div className="mx-auto max-w-2xl px-4">
                <div className="alert alert-success">
                    <span>Merci ! Votre avis a été envoyé et sera publié après validation par un modérateur.</span>
                    <button onClick={() => setSuccess(false)} className="btn btn-sm btn-ghost">Publier un autre avis</button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl px-4">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Laisser un avis</h2>

                    {errors.form && (
                        <div className="alert alert-error py-2 text-sm"><span>{errors.form}</span></div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="space-y-3">
                        {/* Honeypot : champ caché, piège à bots. */}
                        <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                        <div>
                            <label htmlFor="rf-author" className="mb-1 block text-sm font-medium">Nom</label>
                            <input id="rf-author" value={author} onChange={(e) => setAuthor(e.target.value)} className={`input w-full ${errors.author ? 'input-error' : ''}`} />
                            {errors.author && <p className="mt-1 text-sm text-error">{errors.author}</p>}
                        </div>

                        <div>
                            <label htmlFor="rf-email" className="mb-1 block text-sm font-medium">Email <span className="opacity-50">(optionnel)</span></label>
                            <input id="rf-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`input w-full ${errors.email ? 'input-error' : ''}`} />
                            {errors.email && <p className="mt-1 text-sm text-error">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="rf-rating" className="mb-1 block text-sm font-medium">Note</label>
                            <select id="rf-rating" value={rating} onChange={(e) => setRating(Number(e.target.value))} className="select w-full">
                                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>)}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="rf-desc" className="mb-1 block text-sm font-medium">Commentaire</label>
                            <textarea id="rf-desc" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={`textarea w-full ${errors.description ? 'textarea-error' : ''}`} />
                            {errors.description && <p className="mt-1 text-sm text-error">{errors.description}</p>}
                        </div>

                        <button type="submit" disabled={submitting} className="btn btn-primary w-full">
                            {submitting ? <span className="loading loading-spinner loading-sm"></span> : 'Envoyer mon avis'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
