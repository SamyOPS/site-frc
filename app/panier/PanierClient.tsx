"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { itemKey, useCart } from "@/lib/cart";
import { CartItemThumb } from "@/components/CartItemThumb";
import { submitQuoteRequest } from "./actions";

const inputClass =
  "w-full border border-rule bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-ink";

export function PanierClient() {
  const { items, hydrated, updateQuantity, removeItem, clear } = useCart();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await submitQuoteRequest(items, form);
      if (res.ok) {
        setSent(true);
        clear();
      } else {
        setError(res.error ?? "Erreur lors de l'envoi.");
      }
    });
  }

  if (!hydrated) {
    return (
      <p className="text-sm text-gray normal-case">Chargement du panier…</p>
    );
  }

  if (sent) {
    return (
      <div className="border border-rule bg-light p-8 md:p-12 text-center">
        <h2 className="headline text-2xl md:text-3xl text-ink">
          Demande envoyée !
        </h2>
        <p className="mt-4 text-sm md:text-base text-gray normal-case max-w-xl mx-auto">
          Nous avons bien reçu votre demande de devis. Un conseiller FRC
          Technique vous recontactera sous 48 h ouvrées.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex btn hover:bg-primary-dark hover:border-primary-dark"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="border border-rule bg-light p-8 md:p-12 text-center">
        <h2 className="headline text-2xl md:text-3xl text-ink">
          Votre panier est vide
        </h2>
        <p className="mt-4 text-sm md:text-base text-gray normal-case max-w-xl mx-auto">
          Parcourez nos formations et ajoutez-les à votre panier pour demander
          un devis personnalisé.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex btn hover:bg-primary-dark hover:border-primary-dark"
        >
          Voir les formations
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce(
    (sum, i) => sum + (i.priceFrom ?? 0) * i.quantity,
    0
  );
  const hasUnpricedItem = items.some((i) => i.priceFrom == null);

  return (
    <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="headline text-xl md:text-2xl text-ink">
            {items.length} formation{items.length > 1 ? "s" : ""}
          </h2>
          <button
            type="button"
            onClick={clear}
            className="text-[11px] uppercase tracking-[0.18em] text-gray hover:text-red-500 transition-colors"
          >
            Vider le panier
          </button>
        </div>

        <ul className="border-t border-rule">
          {items.map((item) => {
            const key = itemKey(item.slug, item.categories, item.sessionId);
            return (
              <li
                key={key}
                className="flex flex-col sm:flex-row sm:items-start gap-4 py-5 border-b border-rule"
              >
                <CartItemThumb
                  slug={item.slug}
                  categories={item.categories}
                  size="lg"
                />
                <div className="flex-1">
                  <Link
                    href={`/formations/${item.slug}`}
                    className="text-sm md:text-base font-medium text-ink hover:text-primary transition-colors"
                  >
                    {item.title}
                  </Link>
                  {item.sessionLabel && (
                    <p className="mt-1 text-xs text-ink normal-case">
                      <span className="text-gray">Session :</span>{" "}
                      <span className="font-medium">{item.sessionLabel}</span>
                    </p>
                  )}
                  {item.categories.length > 0 && (
                    <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-primary font-medium">
                      Catégorie{item.categories.length > 1 ? "s" : ""}{" "}
                      {item.categories.join(" · ")}
                    </p>
                  )}
                  {item.priceFrom != null && (
                    <p className="mt-1 text-xs text-gray normal-case">
                      Dès {item.priceFrom} € / participant
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="inline-flex items-stretch border border-rule">
                    <button
                      type="button"
                      onClick={() => updateQuantity(key, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 text-ink hover:bg-light disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Diminuer"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          key,
                          Math.max(1, Math.min(99, Number(e.target.value) || 1))
                        )
                      }
                      className="w-10 text-center text-sm text-ink outline-none"
                      aria-label="Nombre de participants"
                    />
                    <button
                      type="button"
                      onClick={() => updateQuantity(key, item.quantity + 1)}
                      className="w-8 text-ink hover:bg-light"
                      aria-label="Augmenter"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(key)}
                    className="text-[11px] uppercase tracking-[0.16em] text-gray hover:text-red-500 transition-colors"
                    aria-label={`Retirer ${item.title}`}
                  >
                    Retirer
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex justify-between items-baseline">
          <span className="text-xs uppercase tracking-[0.18em] text-gray">
            Sous-total estimé
          </span>
          <span className="headline text-2xl text-ink">
            {subtotal > 0 ? `Dès ${subtotal} €` : "—"}
          </span>
        </div>
        {hasUnpricedItem && (
          <p className="mt-2 text-[11px] text-gray normal-case">
            Certaines formations n&apos;ont pas de tarif public — un devis sur
            mesure vous sera transmis.
          </p>
        )}
        <p className="mt-1 text-[11px] text-gray normal-case">
          Le montant final sera précisé dans le devis, après étude de votre
          demande.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="bg-light border border-rule p-6 md:p-8 self-start"
      >
        <div className="flex items-center gap-3 mb-5">
          <span className="block w-8 h-px bg-primary" />
          <span className="eyebrow">Vos coordonnées</span>
        </div>

        <div className="grid gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
              Nom complet *
            </span>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
              Email *
            </span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
              Téléphone *
            </span>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
              Message (facultatif)
            </span>
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Dates souhaitées, intra/inter, financement, contraintes…"
              className={`${inputClass} resize-y`}
            />
          </label>
        </div>

        {error && <p className="mt-3 text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 btn w-full hover:bg-primary-dark hover:border-primary-dark disabled:opacity-50"
        >
          {pending ? "Envoi…" : "Valider la demande de devis"}
        </button>
        <p className="mt-3 text-[11px] text-gray normal-case text-center">
          Réponse sous 48 h ouvrées.
        </p>
      </form>
    </div>
  );
}
