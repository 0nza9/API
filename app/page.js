// Page d'accueil (URL : "/") — vitrine du site.
import Navbar from '@/components/navbar'
import LandingReviews from '@/components/landing-reviews'

export default function Home() {
  return (
    <div>
      <Navbar />

      {/* Section "hero" : accroche + boutons d'action. */}
      <section className="hero min-h-[55vh] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold sm:text-5xl">
              Ce que nos clients pensent de nous
            </h1>
            <p className="py-6 text-lg opacity-80">
              Des avis authentiques et modérés. Consultez les retours de la communauté
              ou partagez votre expérience en quelques secondes.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="/avis" className="btn btn-primary">Voir les avis</a>
              <a href="/avis" className="btn btn-outline">Laisser un avis</a>
            </div>
          </div>
        </div>
      </section>

      {/* Aperçu : statistiques + avis récents. */}
      <LandingReviews />
    </div>
  );
}
