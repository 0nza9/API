// Page de connexion de l'application (URL : "/login").
// Le dossier "login" donne l'URL, et ce page.js définit son contenu.

// Import du composant barre de navigation (le menu du haut).
import Navbar from '@/components/navbar'
// Import du composant qui contient le formulaire de connexion.
import Login from '@/components/login'

// Composant de la page de connexion : il assemble la barre de navigation
// et le formulaire de connexion.
export default function Home() {
  // Le "return" décrit le rendu (le JSX = du HTML écrit en JavaScript).
  return (
    <div>
      {/* Barre de navigation affichée en haut de la page */}
      <Navbar/>
      {/* Formulaire de connexion */}
      <Login/>
    </div>
  );
}
