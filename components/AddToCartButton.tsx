"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useCategorySelection } from "@/components/CategorySelection";

type CategoryDetail = { code: string; label: string };

type Props = {
  slug: string;
  title: string;
  priceFrom: number | null;
  categoriesDetail?: CategoryDetail[];
  /** CACES : les catégories (multi) sont partagées avec le carrousel. */
  sharedCategory?: boolean;
};

export function AddToCartButton({
  slug,
  title,
  priceFrom,
  categoriesDetail,
  sharedCategory = false,
}: Props) {
  const { addItem } = useCart();
  const shared = useCategorySelection();
  // Sélection interne (utilisée hors CACES) ; en mode CACES on lit le contexte.
  const [localSelected, setLocalSelected] = useState<Set<string>>(new Set());
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const hasCategories = !!categoriesDetail && categoriesDetail.length > 0;

  // Codes retenus pour le devis, selon le mode.
  const selectedCodes = sharedCategory
    ? shared.selected
    : [...localSelected];

  function toggle(code: string) {
    if (sharedCategory) {
      shared.toggle(code);
      shared.setCurrent(code); // affiche l'image de la catégorie cliquée
      return;
    }
    setLocalSelected((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  function onAdd() {
    addItem({
      slug,
      title,
      priceFrom,
      categories: selectedCodes,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  const canAdd = !hasCategories || selectedCodes.length > 0;

  return (
    <div className="bg-light border border-rule p-5 md:p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="block w-8 h-px bg-primary" />
        <span className="eyebrow">Demander un devis</span>
      </div>

      {hasCategories && (
        <div className="mb-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gray mb-2">
            Catégories souhaitées
          </p>
          <div className="flex flex-wrap gap-2">
            {categoriesDetail!.map((c) => {
              const isSelected = selectedCodes.includes(c.code);
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => toggle(c.code)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border transition-colors ${
                    isSelected
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-ink border-rule hover:border-ink"
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className="font-semibold">{c.code}</span>
                </button>
              );
            })}
          </div>
          {selectedCodes.length === 0 && (
            <p className="mt-2 text-[11px] text-gray normal-case">
              Sélectionnez une ou plusieurs catégories
              {sharedCategory ? " (ou via les flèches de l'image)" : ""}.
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-end gap-3 mb-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
            Participants
          </span>
          <div className="inline-flex items-stretch border border-rule bg-white">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-9 text-ink hover:bg-light"
              aria-label="Diminuer"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={99}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Math.min(99, Number(e.target.value) || 1)))
              }
              className="w-12 text-center text-sm text-ink outline-none"
            />
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              className="w-9 text-ink hover:bg-light"
              aria-label="Augmenter"
            >
              +
            </button>
          </div>
        </label>
      </div>

      <button
        type="button"
        onClick={onAdd}
        disabled={!canAdd}
        className="btn w-full hover:bg-primary-dark hover:border-primary-dark disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {added ? "✓ Ajouté au panier" : "Ajouter au panier"}
      </button>
    </div>
  );
}
