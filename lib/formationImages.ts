import type { StaticImageData } from "next/image";
import { formations } from "@/lib/data";

const imageBySlug = new Map<string, StaticImageData | undefined>(
  formations.map((f) => [f.slug, f.image])
);

/** Image d'illustration d'une formation (undefined si aucune). */
export function formationImage(slug: string): StaticImageData | undefined {
  return imageBySlug.get(slug);
}
