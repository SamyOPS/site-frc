"use client";

import { useState } from "react";
import { formationImage } from "@/lib/formationImages";

/**
 * Vignette d'un article du panier. Priorité à l'image de la catégorie CACES
 * concernée (`/caces/<slug>/<code>.<ext>`) ; à défaut, l'image de la formation.
 * Essaie les candidats dans l'ordre et se masque si aucun ne charge.
 */
export function CartItemThumb({
  slug,
  categories,
  size = "sm",
}: {
  slug: string;
  categories: string[];
  size?: "sm" | "lg";
}) {
  const [i, setI] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const srcs: string[] = [];
  const cat = categories[0];
  if (cat && slug.startsWith("caces-")) {
    const safe = cat.replace(/[^a-zA-Z0-9]/g, "");
    for (const ext of ["png", "jpg", "jpeg", "webp"]) {
      srcs.push(`/caces/${slug}/${safe}.${ext}`);
    }
  }
  const fi = formationImage(slug);
  if (fi) srcs.push(fi.src);

  if (srcs.length === 0 || i >= srcs.length) return null;

  const box = size === "lg" ? "w-20 h-20" : "w-14 h-14";

  return (
    <div className={`relative ${box} shrink-0 border border-rule bg-white`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={srcs[i]}
        alt=""
        onLoad={() => setLoaded(true)}
        onError={() => {
          setLoaded(false);
          setI((n) => n + 1);
        }}
        className={`absolute inset-0 w-full h-full object-contain p-1 transition-opacity ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
