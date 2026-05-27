"use client";

import { useRef, useState, useTransition } from "react";
import { createSession, deleteSession, updateSessionStatus } from "./actions";
import type { SessionRow } from "./page";

type FormationItem = { slug: string; title: string };

const statusLabel: Record<string, string> = {
  open: "Ouvert",
  full: "Complet",
  cancelled: "Annulé",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function SessionsManager({
  formations,
  sessions,
}: {
  formations: FormationItem[];
  sessions: SessionRow[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const titleBySlug = new Map(formations.map((f) => [f.slug, f.title]));

  function onCreate(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await createSession(formData);
      if (res.ok) {
        formRef.current?.reset();
      } else {
        setError(res.error ?? "Erreur");
      }
    });
  }

  function onDelete(id: string) {
    startTransition(async () => {
      await deleteSession(id);
    });
  }

  function onStatus(id: string, status: string) {
    startTransition(async () => {
      await updateSessionStatus(id, status);
    });
  }

  const inputClass =
    "border border-rule bg-light px-3 py-2.5 text-sm text-ink outline-none focus:border-ink";

  return (
    <section className="bg-white border border-rule p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="block w-8 h-px bg-primary" />
        <span className="eyebrow">Planning des sessions</span>
      </div>

      {/* Formulaire d'ajout */}
      <form
        ref={formRef}
        action={onCreate}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 items-end mb-8 pb-8 border-b border-rule"
      >
        <label className="flex flex-col gap-1.5 lg:col-span-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
            Formation
          </span>
          <select name="formation_slug" required className={inputClass}>
            <option value="">— Choisir —</option>
            {formations.map((f) => (
              <option key={f.slug} value={f.slug}>
                {f.title}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
            Date de début
          </span>
          <input type="date" name="starts_on" required className={inputClass} />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
            Date de fin
          </span>
          <input type="date" name="ends_on" className={inputClass} />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
            Places
          </span>
          <input
            type="number"
            name="seats_total"
            min={0}
            placeholder="—"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
            Lieu
          </span>
          <input
            type="text"
            name="location"
            placeholder="Montataire (60)"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
            Statut
          </span>
          <select name="status" defaultValue="open" className={inputClass}>
            <option value="open">Ouvert</option>
            <option value="full">Complet</option>
            <option value="cancelled">Annulé</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={pending}
          className="btn hover:bg-primary-dark hover:border-primary-dark disabled:opacity-50"
        >
          {pending ? "…" : "Ajouter la session"}
        </button>
      </form>

      {error && <p className="mb-4 text-xs text-red-500">{error}</p>}

      {/* Liste des sessions */}
      {sessions.length === 0 ? (
        <p className="text-sm text-gray normal-case">
          Aucune session programmée pour le moment.
        </p>
      ) : (
        <ul className="border-t border-rule">
          {sessions.map((s) => (
            <li
              key={s.id}
              className="flex flex-wrap items-center gap-3 py-3 border-b border-rule"
            >
              <span className="text-sm font-medium text-ink min-w-[140px]">
                {formatDate(s.starts_on)}
                {s.ends_on ? ` → ${formatDate(s.ends_on)}` : ""}
              </span>
              <span className="flex-1 text-sm text-gray min-w-[180px]">
                {titleBySlug.get(s.formation_slug) ?? s.formation_slug}
              </span>
              {s.seats_total != null && (
                <span className="text-xs text-gray">{s.seats_total} places</span>
              )}
              <select
                value={s.status}
                onChange={(e) => onStatus(s.id, e.target.value)}
                disabled={pending}
                className="border border-rule bg-light px-2 py-1.5 text-xs text-ink outline-none"
                aria-label="Statut de la session"
              >
                {Object.entries(statusLabel).map(([v, label]) => (
                  <option key={v} value={v}>
                    {label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => onDelete(s.id)}
                disabled={pending}
                className="text-[11px] uppercase tracking-[0.16em] border border-rule px-3 py-1.5 text-ink hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors disabled:opacity-50"
              >
                Suppr.
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
