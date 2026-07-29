// Formulaire d'inscription (daisyUI).
'use client';

import { useState } from 'react';
import Register from '@/service/register';
import Toast from '@/components/toast';

export default function RegisterPages() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const showError = (msg) => {
        setMessage(msg);
        setError(true);
        setTimeout(() => setError(false), 3000);
    };

    const handleSubmit = async (e) => {
        e?.preventDefault?.();
        // Vérification côté client : les deux mots de passe doivent être identiques.
        if (password !== confirmPassword) {
            showError('Les mots de passe ne correspondent pas.');
            return;
        }

        setSubmitting(true);
        try {
            // L'API n'utilise que email + password (elle ignore name/confirmPassword).
            const result = await Register({ email, password });
            if (result.error) {
                showError(result.message);
            } else {
                document.location.href = '/login';
            }
        } catch (err) {
            console.log(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-base-200 px-4 py-10">
            {message && error && <Toast message={message} />}

            <div className="card w-full max-w-sm bg-base-100 shadow-xl">
                <div className="card-body">
                    <h1 className="text-center text-2xl font-bold">Créer un compte</h1>
                    <p className="mb-2 text-center text-sm opacity-70">Rejoignez la communauté</p>

                    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                        <div>
                            <label htmlFor="r-name" className="mb-1 block text-sm font-medium">Nom</label>
                            <input id="r-name" type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="input w-full" />
                        </div>
                        <div>
                            <label htmlFor="r-email" className="mb-1 block text-sm font-medium">Email</label>
                            <input id="r-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="input w-full" />
                        </div>
                        <div>
                            <label htmlFor="r-password" className="mb-1 block text-sm font-medium">Mot de passe</label>
                            <input id="r-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" className="input w-full" />
                            <span className="mt-1 block text-xs opacity-60">Au moins 8 caractères.</span>
                        </div>
                        <div>
                            <label htmlFor="r-confirm" className="mb-1 block text-sm font-medium">Confirmer le mot de passe</label>
                            <input id="r-confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" className="input w-full" />
                        </div>

                        <button type="submit" disabled={submitting} className="btn btn-primary w-full">
                            {submitting ? <span className="loading loading-spinner loading-sm"></span> : "S'inscrire"}
                        </button>
                    </form>

                    <p className="mt-2 text-center text-sm opacity-70">
                        Déjà un compte ?{' '}
                        <a href="/login" className="link link-primary">Se connecter</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
