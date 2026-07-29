
// Service d'inscription : c'est ici qu'on fait la requête AJAX vers l'API.
// "AJAX" = envoyer/recevoir des données du serveur sans recharger la page.
// On utilise l'API "fetch" du navigateur, et "async/await" pour attendre la réponse.

// Fonction asynchrone qui envoie les données du nouvel utilisateur (data) à l'API.
// "async" permet d'utiliser "await" pour attendre le résultat du serveur.
const Register = async (data) => {
    try {
        // Envoi de la requête HTTP vers l'API (serveur back-end sur le port 5000).
        // await = on met en pause la fonction jusqu'à recevoir la réponse.
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/register`, {
            method: 'POST',                     // méthode POST car on envoie des données
            body: JSON.stringify(data),         // le corps de la requête : les données converties en texte JSON
            headers: {
                'Content-Type': 'application/json'  // on précise au serveur qu'on envoie du JSON
            }
        })
        // Conversion de la réponse du serveur (texte JSON) en objet JavaScript.
        const result = await response.json()

        // Si l'API répond avec un code d'erreur (409 email déjà pris, 400...),
        // on signale l'erreur avec le message renvoyé par l'API.
        if (!response.ok) {
            return { error: true, message: result.message || 'Inscription impossible' }
        }

        // Succès : l'API renvoie { id, email }. On le renvoie au composant.
        return result
    } catch (error) {
        // En cas d'erreur réseau (serveur injoignable...), on renvoie un objet d'erreur.
        return { error: true, message: 'Serveur injoignable. Réessayez.' }
    }
}

// On exporte la fonction pour pouvoir l'importer et l'utiliser ailleurs.
export default Register