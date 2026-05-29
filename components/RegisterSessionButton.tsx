"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";

type Props = {
  slug: string;
  title: string;
  priceFrom: number | null;
  categories: string[];
  sessionId: string;
  sessionLabel: string;
  disabled?: boolean;
};

export function RegisterSessionButton({
  slug,
  title,
  priceFrom,
  categories,
  sessionId,
  sessionLabel,
  disabled,
}: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function onClick() {
    addItem({
      slug,
      title,
      priceFrom,
      categories,
      sessionId,
      sessionLabel,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="text-[11px] uppercase tracking-[0.18em] font-medium text-ink hover:text-primary transition-colors whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {added ? "✓ Ajouté au panier" : "S'inscrire →"}
    </button>
  );
}
