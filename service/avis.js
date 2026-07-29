// Service des avis : tous les appels AJAX liés aux avis passent par ici.
// Chaque appel envoie le cookie de session (credentials: 'include') pour que
// les actions réservées aux admins soient authentifiées.

const BASE = () => process.env.NEXT_PUBLIC_BASE_URL

// Petit utilitaire commun : envoie une requête et renvoie soit les données,
// soit un objet { error: true, message } exploitable par les composants.
async function request(path, options = {}) {
    try {
        const response = await fetch(`${BASE()}${path}`, {
            credentials: 'include',
            ...options,
        })
        // 204 No Content (suppression) : pas de corps à parser.
        const data = response.status === 204 ? {} : await response.json()
        if (!response.ok) {
            return { error: true, status: response.status, message: data.message || 'Erreur' }
        }
        return data
    } catch (error) {
        return { error: true, message: 'Serveur injoignable. Réessayez.' }
    }
}

// --- Public ---

// Liste publique (avis autorisés uniquement).
const GetReviews = () => request('/avis')

// Publier un avis (public). data = { author, email?, description, rating }.
export const PostReview = (data) =>
    request('/avis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })

// --- Admin (modération) ---

// Tous les avis, y compris ceux en attente (réservé admin).
export const GetModeration = () => request('/avis/moderation')

// Autoriser un avis (réservé admin).
export const AuthorizeReview = (id) => request(`/avis/${id}/autoriser`, { method: 'PUT' })

// Modifier un avis (réservé admin). data = champs à changer.
export const EditReview = (id, data) =>
    request(`/avis/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })

// Supprimer un avis (réservé admin).
export const DeleteReview = (id) => request(`/avis/${id}`, { method: 'DELETE' })

export default GetReviews
