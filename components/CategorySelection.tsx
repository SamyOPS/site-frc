"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type Ctx = {
  /** Catégories retenues pour le devis (sélection multiple). */
  selected: string[];
  toggle: (code: string) => void;
  /** Catégorie actuellement affichée dans le carrousel. */
  current: string | null;
  setCurrent: (code: string | null) => void;
};

const CategorySelectionContext = createContext<Ctx>({
  selected: [],
  toggle: () => {},
  current: null,
  setCurrent: () => {},
});

/**
 * Contexte partagé entre le carrousel d'images (sidebar) et le bloc « Demander
 * un devis » : on peut sélectionner plusieurs catégories pour le devis, et la
 * catégorie affichée dans le carrousel reste synchronisée avec les chips.
 */
export function CategorySelectionProvider({
  children,
  initialCurrent = null,
}: {
  children: ReactNode;
  initialCurrent?: string | null;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [current, setCurrent] = useState<string | null>(initialCurrent);

  function toggle(code: string) {
    setSelected((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  }

  return (
    <CategorySelectionContext.Provider
      value={{ selected, toggle, current, setCurrent }}
    >
      {children}
    </CategorySelectionContext.Provider>
  );
}

export function useCategorySelection() {
  return useContext(CategorySelectionContext);
}
