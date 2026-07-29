// Formulaire "mot de passe oublié" (daisyUI).
'use client';

import { useState } from 'react';
import { ForgotPassword } from '@/service/password';

export default function Forgot() {
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [devToken, setDevToken] = useState('');

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        setSubmitting(true);
        const result = await ForgotPassword({ email });
        setSubmitting(false);

        if (result.error) { setMessage(result.message); return; }
        setMessage(result.message || 'Si un compte existe, un lien de réinitialisation a été envoyé.');
        if (result.resetToken) setDevToken(result.resetToken);
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-base-200 px-4 py-10">
            <div className="card w-full max-w-sm bg-base-100 shadow-xl">
                <div className="card-body">
                    <h1 className="text-center text-2xl font-bold">Mot de passe oublié</h1>
                    <p className="mb-2 text-center text-sm opacity-70">On vous envoie un lien de réinitialisation.</p>

                    <form onSubmit={handleSubmit} noValidate className="space-y-3">
                        <div>
                            <label htmlFor="fg-email" className="mb-1 block text-sm font-medium">Email</label>
                            <input id="fg-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input w-full" />
                        </div>
                        <button type="submit" disabled={submitting} className="btn btn-primary w-full">
                            {submitting ? <span className="loading loading-spinner loading-sm"></span> : 'Envoyer le lien'}
                        </button>
                    </form>

                    {message && <div className="alert mt-4 py-2 text-sm"><span>{message}</span></div>}

                    {devToken && (
                        <p className="mt-2 text-sm">
                            <span className="opacity-50">(dev) </span>
                            <a href={`/password-reset?token=${devToken}`} className="link link-primary">Réinitialiser mon mot de passe</a>
                        </p>
                    )}

                    <p className="mt-2 text-center text-sm opacity-70">
                        <a href="/login" className="link link-primary">Retour à la connexion</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
