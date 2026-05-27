"use client";

import { useState, useTransition } from "react";
import { savePrice } from "./actions";
import type { PriceRow } from "./page";

type FormationItem = {
  slug: string;
  title: string;
  fallbackPrice: number | null;
};

function PriceRowItem({
  formation,
  initialPrice,
}: {
  formation: FormationItem;
  initialPrice: number | null;
}) {
  const [value, setValue] = useState(
    initialPrice != null ? String(initialPrice) : ""
  );
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSave() {
    setSaved(false);
    setError(null);
    const num = Number(value);
    if (!Number.isFinite(num) || num < 0) {
      setError("Prix invalide");
      return;
    }
    startTransition(async () => {
      const res = await savePrice(formation.slug, num);
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        setError(res.error ?? "Erreur");
      }
    });
  }

  return (
    <div className="flex items-center gap-4 py-3 border-b border-rule">
      <span className="flex-1 text-sm text-ink">{formation.title}</span>
      <div className="flex items-center gap-2">
        <div className="flex items-center border border-rule bg-light focus-within:border-ink">
          <input
            type="number"
            min={0}
            step={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="—"
            className="w-24 bg-transparent px-3 py-2 text-sm text-ink outline-none text-right"
          />
          <span className="px-2 text-sm text-gray">€</span>
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={pending}
          className="text-[11px] uppercase tracking-[0.18em] font-medium border border-ink px-4 py-2.5 text-ink hover:bg-ink hover:text-white transition-colors disabled:opacity-50"
        >
          {pending ? "…" : saved ? "✓" : "Enregistrer"}
        </button>
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

export function PriceEditor({
  formations,
  prices,
}: {
  formations: FormationItem[];
  prices: PriceRow[];
}) {
  const priceBySlug = new Map(prices.map((p) => [p.slug, p.price_from]));

  return (
    <section className="bg-white border border-rule p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="block w-8 h-px bg-primary" />
        <span className="eyebrow">Prix des formations</span>
      </div>

      <div>
        {formations.map((f) => (
          <PriceRowItem
            key={f.slug}
            formation={f}
            initialPrice={priceBySlug.get(f.slug) ?? f.fallbackPrice}
          />
        ))}
      </div>
      <p className="mt-4 text-xs text-gray normal-case">
        Le prix s&apos;affiche sous la forme « Dès X € » sur le site. Laissez
        vide pour ne pas afficher de prix.
      </p>
    </section>
  );
}
