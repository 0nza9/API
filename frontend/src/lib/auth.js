// Auth client for the Express API (/register, /login) + session storage.
import { useSyncExternalStore } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const SESSION_KEY = "mds-avis-session";

async function postJson(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Erreur ${res.status}`);
  return data;
}

export function registerUser({ email, password }) {
  return postJson("/register", { email, password }); // -> { id, email }
}

export function loginUser({ email, password }) {
  return postJson("/login", { email, password }); // -> { token, user }
}

export function forgotPassword({ email }) {
  return postJson("/forgot-password", { email }); // -> { message, resetToken? }
}

export function resetPassword({ token, password }) {
  return postJson("/reset-password", { token, password }); // -> { message }
}

// --- Session (localStorage) ---
// A custom "auth-change" event lets components in the same tab react instantly.
export function saveSession(session) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("auth-change"));
}

// Cache the parsed session so getSession() returns a STABLE reference until the
// stored string actually changes — required for useSyncExternalStore below.
let cachedRaw = null;
let cachedSession = null;

export function getSession() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedSession = raw ? JSON.parse(raw) : null;
    } catch {
      cachedSession = null;
    }
  }
  return cachedSession;
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("auth-change"));
}

function subscribe(callback) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("auth-change", callback); // same tab
  window.addEventListener("storage", callback); // other tabs
  return () => {
    window.removeEventListener("auth-change", callback);
    window.removeEventListener("storage", callback);
  };
}

// React hook: re-renders the component whenever the session changes.
// Returns null on the server and during hydration, then the real session.
export function useSession() {
  return useSyncExternalStore(subscribe, getSession, () => null);
}
