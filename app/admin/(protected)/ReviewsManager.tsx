"use client";

import { useState, useTransition } from "react";
import { deleteReview, setReviewStatus } from "./actions";
import type { ReviewRow } from "./page";

const MONTHS = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juil.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5 text-primary align-middle">
      {[1, 2, 3, 4, 5].map((value) => (
        <svg
          key={value}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={value <= rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

const statusMeta: Record<string, { label: string; className: string }> = {
  pending: { label: "En attente", className: "text-amber-600" },
  approved: { label: "Publié", className: "text-emerald-600" },
  rejected: { label: "Rejeté", className: "text-red-500" },
};

export function ReviewsManager({ reviews }: { reviews: ReviewRow[] }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) setError(res.error ?? "Erreur");
    });
  }

  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  return (
    <section className="bg-white border border-rule p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="block w-8 h-px bg-primary" />
        <span className="eyebrow">Avis clients</span>
        {pendingCount > 0 && (
          <span className="text-[10px] uppercase tracking-[0.16em] bg-amber-100 text-amber-700 px-2 py-0.5">
            {pendingCount} en attente
          </span>
        )}
      </div>

      {error && <p className="mb-4 text-xs text-red-500">{error}</p>}

      {reviews.length === 0 ? (
        <p className="text-sm text-gray normal-case">
          Aucun avis pour le moment.
        </p>
      ) : (
        <ul className="border-t border-rule">
          {reviews.map((r) => {
            const meta = statusMeta[r.status] ?? statusMeta.pending;
            return (
              <li
                key={r.id}
                className="flex flex-col gap-3 py-4 border-b border-rule"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="headline text-sm text-ink">{r.name}</span>
                  <Stars rating={r.rating} />
                  <span
                    className={`text-[10px] uppercase tracking-[0.16em] ${meta.className}`}
                  >
                    {meta.label}
                  </span>
                  <span className="text-xs text-gray ml-auto">
                    {formatDate(r.created_at)}
                  </span>
                </div>

                <p className="text-sm text-ink normal-case leading-relaxed">
                  {r.quote}
                </p>

                <div className="flex flex-wrap gap-2">
                  {r.status !== "approved" && (
                    <button
                      type="button"
                      onClick={() => run(() => setReviewStatus(r.id, "approved"))}
                      disabled={pending}
                      className="text-[11px] uppercase tracking-[0.16em] border border-rule px-3 py-1.5 text-ink hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-colors disabled:opacity-50"
                    >
                      Valider
                    </button>
                  )}
                  {r.status !== "rejected" && (
                    <button
                      type="button"
                      onClick={() => run(() => setReviewStatus(r.id, "rejected"))}
                      disabled={pending}
                      className="text-[11px] uppercase tracking-[0.16em] border border-rule px-3 py-1.5 text-ink hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-colors disabled:opacity-50"
                    >
                      Rejeter
                    </button>
                  )}
                  {r.status === "approved" && (
                    <button
                      type="button"
                      onClick={() => run(() => setReviewStatus(r.id, "pending"))}
                      disabled={pending}
                      className="text-[11px] uppercase tracking-[0.16em] border border-rule px-3 py-1.5 text-ink hover:bg-ink hover:text-white hover:border-ink transition-colors disabled:opacity-50"
                    >
                      Dépublier
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => run(() => deleteReview(r.id))}
                    disabled={pending}
                    className="text-[11px] uppercase tracking-[0.16em] border border-rule px-3 py-1.5 text-ink hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors disabled:opacity-50"
                  >
                    Suppr.
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
