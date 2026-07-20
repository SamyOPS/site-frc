import { formations } from "@/lib/data";

/**
 * Palette harmonisée : une couleur stable et distincte par formation.
 * Toutes les teintes sont assez soutenues pour un texte blanc lisible.
 * L'attribution suit l'ordre des formations (stable d'un rendu à l'autre).
 */
const PALETTE = [
  "#16a34a", // vert (primary)
  "#2563eb", // bleu
  "#db2777", // rose
  "#ea580c", // orange
  "#7c3aed", // violet
  "#0d9488", // teal
  "#ca8a04", // ambre
  "#dc2626", // rouge
  "#0891b2", // cyan
  "#4d7c0f", // olive
  "#be123c", // framboise
  "#6366f1", // indigo
  "#9333ea", // pourpre
  "#b45309", // brun doré
];

const colorBySlug = new Map<string, string>(
  formations.map((f, i) => [f.slug, PALETTE[i % PALETTE.length]])
);

/** Couleur (hex) associée à une formation. Vert par défaut si inconnue. */
export function formationColor(slug: string): string {
  return colorBySlug.get(slug) ?? "#16a34a";
}
