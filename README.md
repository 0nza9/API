# MDS Avis

Application de gestion d'avis clients : consultation publique, publication d'avis
avec **modération**, et espace **administrateur**. Le projet est composé d'un
**front-end** (site web) et d'une **API** (back-end) séparés.

## 🧱 Stack technique

| Partie | Technologies |
|---|---|
| **Front-end** | Next.js 16 (App Router, React 19), Tailwind CSS v4, daisyUI |
| **Back-end (API)** | Node.js, Express 5 |
| **Base de données** | Prisma (ORM) + SQLite en local, **Turso** (libSQL) en production |
| **Authentification** | Session par cookie **httpOnly**, mots de passe hachés avec **bcrypt** |
| **Hébergement** | Front → **Vercel**, API → **Render**, BDD → **Turso** |

## 🗂️ Architecture

```
API-main/
├── app/, components/, service/   ← Front-end Next.js (à la racine)
└── api/                          ← Back-end Express + Prisma
    ├── controllers/  routes/  middleware/  repositories/
    └── prisma/                   ← schéma + migrations de la base
```

Le front-end n'a **aucune** logique de données : il appelle l'API en HTTP
(`fetch`). L'API gère la base, l'authentification et les règles d'accès.

## 🔐 Fonctionnement (règles d'accès)

- **Consulter les avis** → public
- **Publier un avis** → public (protégé par un *honeypot* anti-spam) ; l'avis
  reste **en attente** jusqu'à validation
- **Valider / modifier / supprimer un avis** → **administrateur** uniquement
  (401 si non connecté, 403 si connecté mais non admin)

## 🚀 Lancer le projet en local

Prérequis : **Node.js 18+**. Il faut **deux terminaux** (l'API et le front
tournent en même temps).

**1. L'API** (terminal 1)
```bash
cd api
npm install
cp .env.example .env        # DATABASE_URL="file:./dev.db" suffit en local
npx prisma migrate dev      # crée la base SQLite locale
npm run db:seed             # crée l'admin + des avis de démo
npm start                   # API sur http://localhost:3000
```

**2. Le front-end** (terminal 2, à la racine)
```bash
npm install
cp .env.example .env.local  # NEXT_PUBLIC_BASE_URL="http://localhost:3000"
npm run dev                 # site sur http://localhost:3001
```

Ouvrir **http://localhost:3001**.

### Compte administrateur (de démonstration)
```
Email    : admin@mds-avis.fr
Password : admin1234
```

## 🔑 Variables d'environnement

Voir `api/.env.example` (back-end) et `.env.example` (front-end).

| Variable | Où | Rôle |
|---|---|---|
| `DATABASE_URL` | API (local) | Fichier SQLite local |
| `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` | API (prod) | Base Turso |
| `CORS_ORIGIN` | API (prod) | URL du front autorisée à appeler l'API |
| `NODE_ENV` | API (prod) | `production` (active le cookie sécurisé) |
| `NEXT_PUBLIC_BASE_URL` | Front | URL de l'API appelée par le site |

## ☁️ Déploiement

- **Base de données → Turso** : appliquer les migrations avec
  `npm run db:turso:migrate` puis `npm run db:seed` (variables `TURSO_*` définies
  dans le terminal).
- **API → Render** : *Web Service*, Root Directory `api`, build
  `npm install && npx prisma generate`, start `node index.js`, + les variables
  ci-dessus.
- **Front → Vercel** : Root Directory à la racine, variable
  `NEXT_PUBLIC_BASE_URL` = l'URL Render. Le dossier `api/` est exclu du build
  Vercel via `.vercelignore`.
