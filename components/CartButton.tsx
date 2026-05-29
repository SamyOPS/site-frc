"use client";

import { useCart } from "@/lib/cart";

export function CartButton({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const { count, hydrated, openCart } = useCart();
  const showBadge = hydrated && count > 0;

  const color =
    variant === "light"
      ? "text-ink/80 hover:text-ink"
      : "text-white/80 hover:text-white";

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Ouvrir le panier (${count} formation${count > 1 ? "s" : ""})`}
      className={`relative inline-flex items-center justify-center w-10 h-10 transition-colors ${color}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="w-5 h-5"
      >
        <path d="M3 4h2l2.4 12.5a2 2 0 0 0 2 1.5h8.2a2 2 0 0 0 2-1.5L21 8H6" />
        <circle cx="9" cy="21" r="1" />
        <circle cx="18" cy="21" r="1" />
      </svg>
      {showBadge && (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center"
        >
          {count}
        </span>
      )}
    </button>
  );
}
