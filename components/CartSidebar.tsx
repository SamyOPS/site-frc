"use client";

import Link from "next/link";
import { useEffect } from "react";
import { itemKey, useCart } from "@/lib/cart";

export function CartSidebar() {
  const {
    items,
    count,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clear,
    hydrated,
  } = useCart();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart();
    }
    if (isOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  const subtotal = items.reduce(
    (sum, i) => sum + (i.priceFrom ?? 0) * i.quantity,
    0
  );

  return (
    <>
      <div
        aria-hidden="true"
        onClick={closeCart}
        className={`fixed inset-0 z-[60] bg-ink/40 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        role="dialog"
        aria-label="Mon panier"
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 z-[70] h-full w-full sm:w-[420px] bg-white border-l border-rule shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.25)] flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-rule shrink-0">
          <div>
            <p className="eyebrow">Mon panier</p>
            <p className="mt-1 text-xs text-gray normal-case">
              {hydrated
                ? count === 0
                  ? "Aucune formation"
                  : `${count} formation${count > 1 ? "s" : ""}`
                : "—"}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center text-ink hover:text-primary transition-colors"
            aria-label="Fermer le panier"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {!hydrated ? (
            <p className="p-6 text-sm text-gray normal-case">Chargement…</p>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
              <p className="headline text-xl text-ink">Panier vide</p>
              <p className="mt-3 text-sm text-gray normal-case max-w-xs">
                Ajoutez des formations depuis le catalogue pour demander un
                devis personnalisé.
              </p>
              <Link
                href="/"
                onClick={closeCart}
                className="mt-6 btn hover:bg-primary-dark hover:border-primary-dark"
              >
                Voir les formations
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-rule">
              {items.map((item) => {
                const key = itemKey(item.slug, item.categories, item.sessionId);
                return (
                  <li key={key} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/formations/${item.slug}`}
                        onClick={closeCart}
                        className="text-sm font-medium text-ink hover:text-primary transition-colors leading-snug flex-1"
                      >
                        {item.title}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(key)}
                        className="text-gray hover:text-red-500 transition-colors shrink-0"
                        aria-label={`Retirer ${item.title}`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          className="w-4 h-4"
                          aria-hidden="true"
                        >
                          <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                      </button>
                    </div>

                    {item.sessionLabel && (
                      <p className="mt-1.5 text-xs text-ink normal-case">
                        <span className="text-gray">Session :</span>{" "}
                        <span className="font-medium">{item.sessionLabel}</span>
                      </p>
                    )}
                    {item.categories.length > 0 && (
                      <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-primary font-medium">
                        Cat. {item.categories.join(" · ")}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="inline-flex items-stretch border border-rule">
                        <button
                          type="button"
                          onClick={() => updateQuantity(key, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 text-ink hover:bg-light disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                          aria-label="Diminuer"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm text-ink leading-7">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(key, item.quantity + 1)}
                          className="w-7 h-7 text-ink hover:bg-light text-sm"
                          aria-label="Augmenter"
                        >
                          +
                        </button>
                      </div>

                      {item.priceFrom != null && (
                        <p className="text-sm font-semibold text-ink whitespace-nowrap">
                          {item.priceFrom * item.quantity} €
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {hydrated && items.length > 0 && (
          <footer className="border-t border-rule p-5 shrink-0 bg-light">
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-[11px] uppercase tracking-[0.18em] text-gray">
                Sous-total
              </span>
              <span className="headline text-xl text-ink">
                {subtotal > 0 ? `${subtotal} €` : "Sur devis"}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/panier"
                onClick={closeCart}
                className="btn w-full hover:bg-primary-dark hover:border-primary-dark"
              >
                Consulter le panier
                <span aria-hidden="true">→</span>
              </Link>
              <button
                type="button"
                onClick={closeCart}
                className="btn-outline text-ink w-full hover:bg-ink hover:text-white"
              >
                Continuer mes achats
              </button>
            </div>
            <button
              type="button"
              onClick={clear}
              className="mt-3 w-full text-[10px] uppercase tracking-[0.18em] text-gray hover:text-red-500 transition-colors"
            >
              Vider le panier
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}
