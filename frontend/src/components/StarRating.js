"use client";

import { useState } from "react";

function Star({ filled, className = "" }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.5}
    >
      <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77 4.8 17.5l.99-5.79L1.58 7.62l5.82-.85L10 1.5z" />
    </svg>
  );
}

// Read-only display of a rating (supports a sizes via `size`).
export function StarDisplay({ value, size = "size-4" }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400" aria-label={`${value} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} filled={i <= Math.round(value)} className={size} />
      ))}
    </div>
  );
}

// Interactive star input for the form.
export function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          aria-label={`Donner ${i} étoile${i > 1 ? "s" : ""}`}
          className="rounded p-0.5 text-amber-400 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <Star filled={i <= shown} className="size-7" />
        </button>
      ))}
      <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
        {value ? `${value}/5` : "Notez"}
      </span>
    </div>
  );
}
