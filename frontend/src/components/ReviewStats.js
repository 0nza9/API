import { StarDisplay } from "@/components/StarRating";

export default function ReviewStats({ reviews }) {
  const count = reviews.length;
  const average = count
    ? reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / count
    : 0;

  // Count per star level, 5 down to 1.
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    n: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:gap-10 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col items-center justify-center text-center sm:px-4">
        <span className="text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {average.toFixed(1)}
        </span>
        <div className="mt-2">
          <StarDisplay value={average} size="size-5" />
        </div>
        <span className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {count} avis
        </span>
      </div>

      <div className="flex-1 space-y-2">
        {distribution.map(({ star, n }) => {
          const pct = count ? (n / count) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-3 text-sm">
              <span className="w-6 shrink-0 text-slate-500 dark:text-slate-400">
                {star}★
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-6 shrink-0 text-right text-slate-400">{n}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
