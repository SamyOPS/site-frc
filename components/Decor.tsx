import type { ReactNode } from "react";

/**
 * Conteneur de formes décoratives (cercles / carrés) positionnées en absolu.
 * À placer comme premier enfant d'une section `relative`. Le contenu qui suit
 * doit être `relative` pour passer au-dessus.
 */
export function Decor({ children }: { children: ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {children}
    </div>
  );
}
