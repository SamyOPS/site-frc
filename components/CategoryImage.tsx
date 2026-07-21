"use client";

import { useState } from "react";

/**
 * Vignette d'une catégorie CACES. Affiche un placeholder neutre par défaut ;
 * si une vraie image existe (essaie plusieurs extensions), elle la recouvre
 * automatiquement. Il suffit de déposer le fichier au bon chemin pour remplacer
 * le placeholder — aucune modification de code nécessaire.
 */
export function CategoryImage({ srcs, alt }: { srcs: string[]; alt: string }) {
  const [i, setI] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const exhausted = i >= srcs.length;

  return (
    <div className="relative w-24 h-24 shrink-0 bg-light border border-rule overflow-hidden">
      {/* Placeholder visible tant qu'aucune vraie image n'a chargé */}
      {!loaded && (
        <div
          className="absolute inset-0 grid place-items-center text-gray/50"
          aria-hidden="true"
        >
          <svg
            width="34"
            height="34"
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
          src={srcs[i]}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false);
            setI((n) => n + 1);
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
