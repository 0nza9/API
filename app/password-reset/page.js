// Page de réinitialisation (URL : "/password-reset?token=...").
import Navbar from '@/components/navbar'
import Reset from '@/components/reset'

export default function PasswordResetPage() {
    return (
        <div>
            <Navbar />
            <Reset />
        </div>
    );
}
