// Page de modération (URL : "/avis/moderation") — réservée aux administrateurs.
// La protection de route (vérification session + rôle) est faite dans <Moderation/>.

import Navbar from '@/components/navbar'
import Moderation from '@/components/moderation'

export default function ModerationPage() {
    return (
        <div>
            <Navbar />
            <Moderation />
        </div>
    );
}
