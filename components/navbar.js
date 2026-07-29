// Barre de navigation (daisyUI). S'adapte à l'état de connexion.
'use client'

import { useEffect, useState } from 'react'
import GetMe, { Logout } from '@/service/me'

export default function Navbar() {
  const [me, setMe] = useState(null) // utilisateur connecté (null si déconnecté)

  useEffect(() => {
    GetMe().then(setMe)
  }, [])

  const handleLogout = async () => {
    await Logout()
    window.location.href = '/login'
  }

  return (
    <div className="navbar sticky top-0 z-50 bg-base-100 shadow-sm">
      {/* Gauche : menu mobile + logo */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu dropdown-content menu-sm z-10 mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
            <li><a href="/">Accueil</a></li>
            <li><a href="/avis">Les avis</a></li>
            {me?.isAdmin && <li><a href="/avis/moderation">Modération</a></li>}
          </ul>
        </div>
        <a href="/" className="btn btn-ghost text-xl">
          <span className="font-bold text-primary">MDS</span>&nbsp;Avis
        </a>
      </div>

      {/* Centre : navigation (grand écran) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><a href="/">Accueil</a></li>
          <li><a href="/avis">Les avis</a></li>
          {me?.isAdmin && <li><a href="/avis/moderation" className="text-primary">Modération</a></li>}
        </ul>
      </div>

      {/* Droite : actions selon l'état de connexion */}
      <div className="navbar-end gap-2">
        {me ? (
          <>
            <span className="hidden text-sm opacity-70 sm:inline">{me.email}</span>
            <button onClick={handleLogout} className="btn btn-outline btn-sm">Déconnexion</button>
          </>
        ) : (
          <>
            <a href="/login" className="btn btn-ghost btn-sm">Connexion</a>
            <a href="/register" className="btn btn-primary btn-sm">Inscription</a>
          </>
        )}
      </div>
    </div>
  )
}
