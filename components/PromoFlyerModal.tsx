"use client";

import { useEffect, useState } from "react";
import type { PromoFlyer } from "@/lib/queries";

const SESSION_KEY = "promoFlyersDismissed";

/**
 * Affiche les flyers de promotion en surimpression à l'arrivée sur le site.
 * Un clic (n'importe où) les fait disparaître ; ne se réaffiche pas pendant
 * la même session de navigation.
 */
export function PromoFlyerModal({ flyers }: { flyers: PromoFlyer[] }) {
  const [open, setOpen] = useState(false);
  // Flyer tiré au sort à l'ouverture (un seul affiché à la fois).
  const [chosen, setChosen] = useState<PromoFlyer | null>(null);

  useEffect(() => {
    if (flyers.length === 0) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      /* sessionStorage indisponible : on affiche quand même */
    }
    const index = Math.floor(Math.random() * flyers.length);
    setChosen(flyers[index]);
    setOpen(true);
  }, [flyers]);

  function dismiss() {
    setOpen(false);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  if (!open || !chosen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Promotions en cours"
      onClick={dismiss}
      className="fixed inset-0 z-[200] bg-ink/70 backdrop-blur-sm flex items-start justify-center p-4 sm:p-8 overflow-y-auto cursor-pointer"
    >
      <div className="relative w-full max-w-lg my-auto">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Fermer"
          className="absolute -top-3 -right-3 z-10 w-9 h-9 grid place-items-center bg-white text-ink border border-rule shadow-lg hover:bg-primary hover:text-white transition-colors"
        >
          ✕
        </button>

        <div className="flex flex-col gap-4">
          {chosen.mime && chosen.mime.startsWith("image/") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={chosen.url}
              alt={chosen.label}
              className="block w-full h-auto shadow-2xl"
            />
          ) : (
            <a
              href={chosen.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white p-8 text-center text-sm font-medium text-ink shadow-2xl hover:text-primary transition-colors"
            >
              {chosen.label} — ouvrir le flyer ↗
            </a>
          )}
        </div>

        <p className="mt-4 text-center text-[11px] uppercase tracking-[0.18em] text-white/80">
          Cliquez n&apos;importe où pour fermer
        </p>
      </div>
    </div>
  );
}
