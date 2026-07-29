// Formulaire de connexion (daisyUI).
'use client';

import { useState } from 'react';
import Login from '@/service/login';
import Toast from '@/components/toast';

export default function LoginPages() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e?.preventDefault?.();
        setSubmitting(true);
        try {
            const result = await Login({ email, password });
            if (result.error) {
                setMessage(result.message);
                setError(true);
                setTimeout(() => setError(false), 3000);
            } else {
                // Session posée par l'API (cookie httpOnly) : on redirige.
                document.location.href = '/avis';
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
                    <h1 className="text-center text-2xl font-bold">Connexion</h1>
                    <p className="mb-2 text-center text-sm opacity-70">Content de vous revoir 👋</p>

                    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                        <div>
                            <label htmlFor="l-email" className="mb-1 block text-sm font-medium">Email</label>
                            <input
                                id="l-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                className="input w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="l-password" className="mb-1 block text-sm font-medium">Mot de passe</label>
                            <input
                                id="l-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                className="input w-full"
                            />
                            <a href="/password-forgot" className="link link-hover mt-1 inline-block text-sm opacity-70">
                                Mot de passe oublié ?
                            </a>
                        </div>

                        <button type="submit" disabled={submitting} className="btn btn-primary w-full">
                            {submitting ? <span className="loading loading-spinner loading-sm"></span> : 'Se connecter'}
                        </button>
                    </form>

                    <p className="mt-2 text-center text-sm opacity-70">
                        Pas encore de compte ?{' '}
                        <a href="/register" className="link link-primary">S'inscrire</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
