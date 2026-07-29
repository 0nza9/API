// Service du cycle de vie du mot de passe : mot de passe oublié + réinitialisation.

const BASE = () => process.env.NEXT_PUBLIC_BASE_URL

async function post(path, body) {
    try {
        const response = await fetch(`${BASE()}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
        const data = await response.json()
        if (!response.ok) {
            return { error: true, message: data.message || 'Une erreur est survenue' }
        }
        return data
    } catch (error) {
        return { error: true, message: 'Serveur injoignable. Réessayez.' }
    }
}

// Demande un lien de réinitialisation. Réponse volontairement générique
// (l'API ne révèle pas si l'e-mail existe). En dev, l'API renvoie resetToken.
export const ForgotPassword = ({ email }) => post('/forgot-password', { email })

// Applique un nouveau mot de passe via le jeton reçu.
export const ResetPassword = ({ token, password }) => post('/reset-password', { token, password })
