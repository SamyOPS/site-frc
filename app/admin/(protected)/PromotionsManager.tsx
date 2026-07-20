"use client";

import { useRef, useState, useTransition } from "react";
import {
  createPromotion,
  deletePromotion,
  setPromotionActive,
  updatePromotion,
} from "./actions";
import type { PromotionRow } from "./page";

const MONTHS = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juil.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
];

function formatDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

function windowLabel(p: PromotionRow): string | null {
  if (p.starts_on && p.ends_on)
    return `Du ${formatDate(p.starts_on)} au ${formatDate(p.ends_on)}`;
  if (p.starts_on) return `À partir du ${formatDate(p.starts_on)}`;
  if (p.ends_on) return `Jusqu'au ${formatDate(p.ends_on)}`;
  return null;
}

export function PromotionsManager({
  promotions,
}: {
  promotions: PromotionRow[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) setError(res.error ?? "Erreur");
    });
  }

  function onUpdate(
    id: string,
    data: { label: string; startsOn: string; endsOn: string }
  ) {
    setError(null);
    startTransition(async () => {
      const res = await updatePromotion(id, data);
      if (res.ok) setEditingId(null);
      else setError(res.error ?? "Erreur");
    });
  }

  function onCreate(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await createPromotion(formData);
      if (res.ok) formRef.current?.reset();
      else setError(res.error ?? "Erreur");
    });
  }

  const inputClass =
    "border border-rule bg-light px-3 py-2.5 text-sm text-ink outline-none focus:border-ink";

  const activeCount = promotions.filter((p) => p.active).length;

  return (
    <section className="bg-white border border-rule p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="block w-8 h-px bg-primary" />
        <span className="eyebrow">Promotions</span>
        {activeCount > 0 && (
          <span className="text-[10px] uppercase tracking-[0.16em] bg-primary/10 text-primary px-2 py-0.5">
            {activeCount} active{activeCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <p className="mb-6 text-sm text-gray normal-case">
        Les promotions actives défilent dans le bandeau en haut de la page
        d&apos;accueil. Renseignez des dates pour programmer une promotion (ces
        champs sont facultatifs).
      </p>

      {/* Formulaire d'ajout */}
      <form
        ref={formRef}
        action={onCreate}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-end mb-8 pb-8 border-b border-rule"
      >
        <label className="flex flex-col gap-1.5 lg:col-span-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
            Texte de la promotion
          </span>
          <input
            type="text"
            name="label"
            required
            maxLength={200}
            placeholder="−15% sur le CACES R489 en juin"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
            Début (optionnel)
          </span>
          <input type="date" name="starts_on" className={inputClass} />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
            Fin (optionnel)
          </span>
          <input type="date" name="ends_on" className={inputClass} />
        </label>

        <button
          type="submit"
          disabled={pending}
          className="btn hover:bg-primary-dark hover:border-primary-dark disabled:opacity-50 lg:col-span-4 lg:justify-self-start"
        >
          {pending ? "…" : "Ajouter la promotion"}
        </button>
      </form>

      {error && <p className="mb-4 text-xs text-red-500">{error}</p>}

      {/* Liste des promotions */}
      {promotions.length === 0 ? (
        <p className="text-sm text-gray normal-case">
          Aucune promotion pour le moment.
        </p>
      ) : (
        <ul className="border-t border-rule">
          {promotions.map((p) => {
            if (editingId === p.id) {
              return (
                <li key={p.id} className="py-4 border-b border-rule">
                  <PromotionEditor
                    promotion={p}
                    disabled={pending}
                    onCancel={() => setEditingId(null)}
                    onSave={(data) => onUpdate(p.id, data)}
                  />
                </li>
              );
            }
            const win = windowLabel(p);
            return (
              <li
                key={p.id}
                className="flex flex-wrap items-center gap-3 py-4 border-b border-rule"
              >
                <span
                  className={`text-[10px] uppercase tracking-[0.16em] ${
                    p.active ? "text-emerald-600" : "text-gray"
                  }`}
                >
                  {p.active ? "Active" : "Inactive"}
                </span>
                <span className="flex-1 min-w-[200px] text-sm text-ink normal-case">
                  {p.label}
                  {win && (
                    <span className="ml-2 text-[11px] text-gray">· {win}</span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => setEditingId(p.id)}
                  disabled={pending}
                  className="text-[11px] uppercase tracking-[0.16em] border border-rule px-3 py-1.5 text-ink hover:bg-ink hover:text-white hover:border-ink transition-colors disabled:opacity-50"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => run(() => setPromotionActive(p.id, !p.active))}
                  disabled={pending}
                  className="text-[11px] uppercase tracking-[0.16em] border border-rule px-3 py-1.5 text-ink hover:bg-ink hover:text-white hover:border-ink transition-colors disabled:opacity-50"
                >
                  {p.active ? "Désactiver" : "Activer"}
                </button>
                <button
                  type="button"
                  onClick={() => run(() => deletePromotion(p.id))}
                  disabled={pending}
                  className="text-[11px] uppercase tracking-[0.16em] border border-rule px-3 py-1.5 text-ink hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors disabled:opacity-50"
                >
                  Suppr.
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function PromotionEditor({
  promotion,
  disabled,
  onCancel,
  onSave,
}: {
  promotion: PromotionRow;
  disabled: boolean;
  onCancel: () => void;
  onSave: (data: { label: string; startsOn: string; endsOn: string }) => void;
}) {
  const [label, setLabel] = useState(promotion.label);
  const [startsOn, setStartsOn] = useState(
    promotion.starts_on ? promotion.starts_on.slice(0, 10) : ""
  );
  const [endsOn, setEndsOn] = useState(
    promotion.ends_on ? promotion.ends_on.slice(0, 10) : ""
  );

  const editClass =
    "border border-rule bg-light px-3 py-2.5 text-sm text-ink outline-none focus:border-ink";

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-end">
        <label className="flex flex-col gap-1.5 lg:col-span-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
            Texte de la promotion
          </span>
          <input
            type="text"
            value={label}
            maxLength={200}
            onChange={(e) => setLabel(e.target.value)}
            className={editClass}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
            Début (optionnel)
          </span>
          <input
            type="date"
            value={startsOn}
            onChange={(e) => setStartsOn(e.target.value)}
            className={editClass}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
            Fin (optionnel)
          </span>
          <input
            type="date"
            value={endsOn}
            onChange={(e) => setEndsOn(e.target.value)}
            className={editClass}
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onSave({ label, startsOn, endsOn })}
          disabled={disabled}
          className="btn hover:bg-primary-dark hover:border-primary-dark disabled:opacity-50"
        >
          Enregistrer
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={disabled}
          className="text-[11px] uppercase tracking-[0.16em] border border-rule px-3 py-1.5 text-ink hover:bg-light transition-colors disabled:opacity-50"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
