// Client for the Express "avis" API.
// Override the base URL with NEXT_PUBLIC_API_URL (e.g. http://localhost:3000).
import { getSession } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Shown when the backend isn't reachable, so the design always renders.
export const SAMPLE_REVIEWS = [
  {
    id: -1,
    author: "Marie Curie",
    description:
      "Service impeccable du début à la fin. L'équipe est à l'écoute et très réactive. Je recommande les yeux fermés !",
    rating: 5,
    date: "2026-05-12T10:24:00.000Z",
    authorized: true,
  },
  {
    id: -2,
    author: "Jean Dupont",
    description:
      "Très bon rapport qualité-prix. Quelques détails à peaufiner mais l'expérience globale est vraiment positive.",
    rating: 4,
    date: "2026-05-28T16:03:00.000Z",
    authorized: true,
  },
  {
    id: -3,
    author: "Albert Einstein",
    description:
      "Correct dans l'ensemble. Le délai de réponse pourrait être amélioré, mais le résultat final est satisfaisant.",
    rating: 3,
    date: "2026-06-15T09:41:00.000Z",
    authorized: false,
  },
];

export async function fetchReviews() {
  const res = await fetch(`${API_URL}/avis`, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function createReview({ author, description, rating }) {
  const session = getSession();
  const res = await fetch(`${API_URL}/avis`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Posting requires login: the API rejects requests without a valid token.
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
    },
    body: JSON.stringify({ author, description, rating }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Erreur ${res.status}`);
  }
  return res.json();
}
