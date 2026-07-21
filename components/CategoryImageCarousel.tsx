"use client";

import { useEffect, useState } from "react";
import { useCategorySelection } from "./CategorySelection";

type Cat = { code: string; label: string };

/**
 * Carrousel d'images par catégorie de CACES (sidebar). Les flèches font défiler
 * les catégories ; un bouton permet d'ajouter/retirer la catégorie affichée du
 * devis. La catégorie affichée est synchronisée avec les chips « Demander un
 * devis » via le contexte partagé. Placeholder tant qu'aucune photo n'existe.
 */
export function CategoryImageCarousel({
  slug,
  code,
  categories,
}: {
  slug: string;
  code?: string;
  categories: Cat[];
}) {
  const { current, setCurrent } = useCategorySelection();
  const [srcIdx, setSrcIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Index dérivé de la catégorie courante (source de vérité = contexte).
  const index = Math.max(
    0,
    categories.findIndex((c) => c.code === current)
  );
  const cat = categories[index];

  // Initialise la catégorie courante si nécessaire.
  useEffect(() => {
    if (!current && categories[0]) setCurrent(categories[0].code);
  }, [current, categories, setCurrent]);

  // Réinitialise le chargement d'image à chaque changement de catégorie.
  useEffect(() => {
    setSrcIdx(0);
    setLoaded(false);
  }, [current]);

  if (!cat) return null;

  const safe = cat.code.replace(/[^a-zA-Z0-9]/g, "");
  const srcs = [".png", ".jpg", ".jpeg", ".webp"].map(
    (ext) => `/caces/${slug}/${safe}${ext}`
  );
  const exhausted = srcIdx >= srcs.length;

  function go(delta: number) {
    const next = (index + delta + categories.length) % categories.length;
    setCurrent(categories[next].code);
  }

  return (
    <div className="mb-6">
      <div className="relative aspect-[4/3] bg-white border border-rule overflow-hidden">
        {/* Placeholder tant qu'aucune photo n'a chargé */}
        {!loaded && (
          <div
            className="absolute inset-0 grid place-items-center text-gray/40"
            aria-hidden="true"
          >
            <svg
              width="46"
              height="46"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="16" rx="1.5" />
              <circle cx="8.5" cy="9" r="1.5" />
              <path d="M21 16l-5-5-5 5-2-2-6 6" />
            </svg>
          </div>
        )}

        {!exhausted && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={srcs[srcIdx]}
            alt={`CACES® ${code ?? ""} — catégorie ${cat.code}`}
            onLoad={() => setLoaded(true)}
            onError={() => {
              setLoaded(false);
              setSrcIdx((n) => n + 1);
            }}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        <span className="absolute top-2 left-2 bg-ink text-white text-[10px] uppercase tracking-[0.16em] px-2 py-1 font-medium">
          Cat. {cat.code}
        </span>

        {categories.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Catégorie précédente"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center bg-white/90 text-ink border border-rule hover:bg-primary hover:text-white transition-colors"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Catégorie suivante"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center bg-white/90 text-ink border border-rule hover:bg-primary hover:text-white transition-colors"
            >
              →
            </button>
          </>
        )}
      </div>

      {/* Légende + position */}
      <div className="mt-2 flex items-start justify-between gap-3">
        <p className="text-xs text-gray normal-case leading-snug">
          {cat.label}
        </p>
        {categories.length > 1 && (
          <span className="text-[10px] uppercase tracking-[0.16em] text-gray shrink-0 pt-0.5">
            {index + 1}/{categories.length}
          </span>
        )}
      </div>
    </div>
  );
}
