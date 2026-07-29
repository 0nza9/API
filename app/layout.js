// Import de la feuille de styles globale (Tailwind CSS + daisyUI).
import "./globals.css";

// "metadata" remplit les balises <head> (onglet du navigateur, SEO).
export const metadata = {
  title: "MDS Avis — Les avis de nos clients",
  description: "Consultez et laissez un avis sur nos services.",
};

// Layout racine : gabarit qui enveloppe TOUTES les pages du site.
export default function RootLayout({ children }) {
  return (
    // data-theme="corporate" applique le thème daisyUI clair sur tout le site.
    <html lang="fr" data-theme="corporate">
      <body className="min-h-screen bg-base-200 text-base-content">{children}</body>
    </html>
  );
}
