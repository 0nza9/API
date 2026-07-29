// Options du cookie de session, partagées entre /login (pose le cookie) et
// /logout (le supprime) — elles doivent être identiques pour que la suppression
// fonctionne.
//
// En production, le front-end (Vercel) et l'API (Render) sont sur des domaines
// différents : le navigateur n'envoie le cookie en contexte "cross-site" que s'il
// est SameSite=None ET Secure (HTTPS). En local (même domaine localhost), on reste
// en SameSite=Lax sans Secure pour que ça marche en HTTP.
const isProd = process.env.NODE_ENV === 'production'

const cookieOptions = {
  httpOnly: true,                       // inaccessible au JavaScript (anti-XSS)
  sameSite: isProd ? 'none' : 'lax',    // 'none' = autorisé cross-site (prod)
  secure: isProd,                       // HTTPS obligatoire si SameSite=None
  path: '/',
}

module.exports = { cookieOptions }
