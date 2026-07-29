// Page des avis (URL : "/avis").
// Affiche la barre de navigation, le formulaire public de publication,
// puis la liste des avis autorisés chargée depuis l'API.

import Navbar from '@/components/navbar'
import ReviewForm from '@/components/reviewform'
import Reviews from '@/components/reviews'

export default function AvisPage() {
    return (
        <div>
            <Navbar />
            <div className="py-8">
                <ReviewForm />
            </div>
            <Reviews />
        </div>
    );
}
