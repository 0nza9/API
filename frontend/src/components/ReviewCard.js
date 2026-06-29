import { StarDisplay } from "@/components/StarRating";

const COLORS = [
  "bg-indigo-500",
  "bg-rose-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-sky-500",
  "bg-violet-500",
];

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export default function ReviewCard({ review }) {
  const { author, description, rating, date, authorized } = review;
  const color = COLORS[Math.abs(author.charCodeAt(0)) % COLORS.length];

  return (
    <article className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-center gap-3">
        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${color}`}
        >
          {initials(author) || "?"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-slate-900 dark:text-slate-100">
            {author}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {formatDate(date)}
          </p>
        </div>
        {!authorized && (
          <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
            En attente
          </span>
        )}
      </header>

      <StarDisplay value={rating} />

      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </article>
  );
}
