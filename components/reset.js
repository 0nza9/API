// Formulaire de réinitialisation du mot de passe (daisyUI).
// Le jeton est lu depuis l'URL (?token=...).
'use client';

import { useEffect, useState } from 'react';
import { ResetPassword } from '@/service/password';

export default function Reset() {
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [done, setDone] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setToken(params.get('token') || '');
    }, []);

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        setError('');
        if (!token) { setError('Jeton de réinitialisation manquant.'); return; }
        if (password.length < 8) { setError('Le mot de passe doit faire au moins 8 caractères.'); return; }
        if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return; }

        setSubmitting(true);
        const result = await ResetPassword({ token, password });
        setSubmitting(false);

        if (result.error) { setError(result.message); return; }
        setDone(true);
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-base-200 px-4 py-10">
            <div className="card w-full max-w-sm bg-base-100 shadow-xl">
                <div className="card-body">
                    {done ? (
                        <div className="alert alert-success">
                            <span>Mot de passe mis à jour. <a href="/login" className="link font-semibold">Se connecter</a></span>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-center text-2xl font-bold">Nouveau mot de passe</h1>
                            <form onSubmit={handleSubmit} noValidate className="space-y-3">
                                <div>
                                    <label htmlFor="rs-pwd" className="mb-1 block text-sm font-medium">Nouveau mot de passe</label>
                                    <input id="rs-pwd" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input w-full" />
                                </div>
                                <div>
                                    <label htmlFor="rs-confirm" className="mb-1 block text-sm font-medium">Confirmer le mot de passe</label>
                                    <input id="rs-confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input w-full" />
                                </div>
                                {error && <p className="text-sm text-error">{error}</p>}
                                <button type="submit" disabled={submitting} className="btn btn-primary w-full">
                                    {submitting ? <span className="loading loading-spinner loading-sm"></span> : 'Réinitialiser'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
