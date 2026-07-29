// Service de session : sait qui est connecté et permet de se déconnecter.

const BASE = () => process.env.NEXT_PUBLIC_BASE_URL

// GetMe : renvoie l'utilisateur connecté { id, email, isAdmin } ou null.
// Utilisé pour la protection des routes et l'affichage conditionnel (navbar…).
const GetMe = async () => {
    try {
        const response = await fetch(`${BASE()}/me`, { credentials: 'include' })
        if (!response.ok) return null // 401 = non connecté
        const data = await response.json()
        return data.user
    } catch (error) {
        return null
    }
}

// Logout : invalide la session côté serveur (supprime le cookie httpOnly).
export const Logout = async () => {
    try {
        await fetch(`${BASE()}/logout`, { method: 'POST', credentials: 'include' })
    } catch (error) {
        // On ignore l'erreur réseau : on redirigera de toute façon.
    }
}

export default GetMe
