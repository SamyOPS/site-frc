"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  createSession,
  deleteSession,
  updateSession,
  updateSessionSeats,
  updateSessionStatus,
} from "./actions";
import type { SessionRow } from "./page";

type CategoryDetail = { code: string; label: string };
type FormationItem = {
  slug: string;
  title: string;
  categories: CategoryDetail[] | null;
};

const statusLabel: Record<string, string> = {
  open: "Ouvert",
  full: "Complet",
  cancelled: "Annulé",
};

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

function formatDateTime(ts: string) {
  const [datePart, timePart = "00:00"] = ts.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm] = timePart.split(":");
  return `${d} ${MONTHS[m - 1]} ${y} · ${hh}h${mm}`;
}

export function SessionsManager({
  formations,
  sessions,
}: {
  formations: FormationItem[];
  sessions: SessionRow[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [recurrence, setRecurrence] = useState("none");
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const titleBySlug = new Map(formations.map((f) => [f.slug, f.title]));
  const categoriesBySlug = new Map(
    formations.map((f) => [f.slug, f.categories])
  );

  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  function toggleSlug(slug: string) {
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function toggleExpanded(slug: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function onCreate(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await createSession(formData);
      if (res.ok) {
        formRef.current?.reset();
        setRecurrence("none");
        setSelectedSlugs(new Set());
        setExpanded(new Set());
        setDropdownOpen(false);
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

  function onUpdate(
    id: string,
    data: { startDate: string; endDate: string; categories: string[] | null }
  ) {
    setError(null);
    startTransition(async () => {
      const res = await updateSession(id, data);
      if (res.ok) setEditingId(null);
      else setError(res.error ?? "Erreur");
    });
  }

  function onStatus(id: string, status: string) {
    startTransition(async () => {
      await updateSessionStatus(id, status);
    });
  }

  function onSeats(id: string, seats: number | null) {
    startTransition(async () => {
      await updateSessionSeats(id, seats);
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
        <div className="flex flex-col gap-1.5 lg:col-span-3" ref={dropdownRef}>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
            Formations à planifier
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((o) => !o)}
              className={`${inputClass} w-full flex items-center justify-between text-left`}
            >
              <span
                className={
                  selectedSlugs.size === 0 ? "text-gray normal-case" : ""
                }
              >
                {selectedSlugs.size === 0
                  ? "— Choisir une ou plusieurs formations —"
                  : `${selectedSlugs.size} formation${
                      selectedSlugs.size > 1 ? "s" : ""
                    } sélectionnée${selectedSlugs.size > 1 ? "s" : ""}`}
              </span>
              <span aria-hidden="true" className="text-ink text-base ml-2">
                {dropdownOpen ? "▲" : "▼"}
              </span>
            </button>

            <div
              className={`absolute z-20 left-0 right-0 mt-1 max-h-80 overflow-y-auto border border-rule bg-white shadow-lg ${
                dropdownOpen ? "block" : "hidden"
              }`}
            >
              {formations.map((f) => {
                const hasCategories =
                  f.categories && f.categories.length > 0;
                const isExpanded = expanded.has(f.slug);
                return (
                  <div key={f.slug} className="border-b border-rule last:border-b-0">
                    <div className="flex items-center gap-2 px-3 py-2 hover:bg-light">
                      {hasCategories ? (
                        <button
                          type="button"
                          onClick={() => toggleExpanded(f.slug)}
                          className="w-6 h-6 flex items-center justify-center border border-rule bg-light text-ink text-sm font-bold hover:bg-primary hover:text-white hover:border-primary transition-colors"
                          aria-label={
                            isExpanded ? "Replier les catégories" : "Voir les catégories"
                          }
                        >
                          {isExpanded ? "−" : "+"}
                        </button>
                      ) : (
                        <span className="w-6" />
                      )}
                      <label className="flex items-center gap-2 flex-1 cursor-pointer text-sm text-ink">
                        <input
                          type="checkbox"
                          name="formation_slugs"
                          value={f.slug}
                          checked={selectedSlugs.has(f.slug)}
                          onChange={() => toggleSlug(f.slug)}
                          className="accent-primary"
                        />
                        <span>{f.title}</span>
                      </label>
                    </div>
                    {hasCategories && (
                      <div
                        className={`pl-14 pr-3 pb-2 flex flex-col gap-1 ${
                          isExpanded ? "block" : "hidden"
                        }`}
                      >
                        {f.categories!.map((c) => (
                          <label
                            key={c.code}
                            className="flex items-center gap-2 text-xs text-ink cursor-pointer py-1 hover:text-primary"
                          >
                            <input
                              type="checkbox"
                              name={`categories_${f.slug}`}
                              value={c.code}
                              className="accent-primary"
                            />
                            <span className="font-medium">{c.code}</span>
                            <span className="text-gray normal-case">
                              — {c.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
            Date de début
          </span>
          <input
            type="date"
            name="start_date"
            required
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
            Date de fin (optionnel)
          </span>
          <input
            type="date"
            name="end_date"
            className={inputClass}
          />
        </label>

        <p className="text-[11px] text-gray normal-case lg:col-span-3">
          Les sessions se déroulent de 9h00 à 17h00. Renseignez une date de fin
          uniquement pour une formation qui s&apos;étale sur plusieurs jours.
        </p>

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
            Statut
          </span>
          <select name="status" defaultValue="open" className={inputClass}>
            <option value="open">Ouvert</option>
            <option value="full">Complet</option>
            <option value="cancelled">Annulé</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
            Récurrence
          </span>
          <select
            name="recurrence"
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value)}
            className={inputClass}
          >
            <option value="none">Aucune (session unique)</option>
            <option value="weekly">Chaque semaine</option>
            <option value="biweekly">Toutes les 2 semaines</option>
            <option value="monthly">Chaque mois</option>
          </select>
        </label>

        {recurrence !== "none" && (
          <>
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
                Nombre de séances
              </span>
              <input
                type="number"
                name="recurrence_count"
                min={2}
                max={52}
                placeholder="ex. 4"
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
                ou jusqu&apos;au
              </span>
              <input
                type="date"
                name="recurrence_until"
                className={inputClass}
              />
            </label>
          </>
        )}

        <button
          type="submit"
          disabled={pending || selectedSlugs.size === 0}
          className="btn hover:bg-primary-dark hover:border-primary-dark disabled:opacity-50"
        >
          {pending
            ? "…"
            : selectedSlugs.size > 1
            ? `Ajouter ${selectedSlugs.size} sessions`
            : "Ajouter la session"}
        </button>

        {recurrence !== "none" && (
          <p className="text-[11px] text-gray normal-case lg:col-span-3">
            Indiquez un nombre de séances <em>ou</em> une date de fin de série.
            Le jour de début est répété (ex. chaque lundi, de 9h00 à 17h00).
            Maximum 52 occurrences.
          </p>
        )}
      </form>

      {error && <p className="mb-4 text-xs text-red-500">{error}</p>}

      {/* Liste des sessions */}
      {sessions.length === 0 ? (
        <p className="text-sm text-gray normal-case">
          Aucune session programmée pour le moment.
        </p>
      ) : (
        <ul className="border-t border-rule">
          {sessions.map((s) =>
            editingId === s.id ? (
              <li key={s.id} className="py-4 border-b border-rule">
                <SessionEditor
                  session={s}
                  title={titleBySlug.get(s.formation_slug) ?? s.formation_slug}
                  availableCategories={
                    categoriesBySlug.get(s.formation_slug) ?? null
                  }
                  disabled={pending}
                  onCancel={() => setEditingId(null)}
                  onSave={(data) => onUpdate(s.id, data)}
                />
              </li>
            ) : (
              <li
                key={s.id}
                className="flex flex-wrap items-center gap-3 py-3 border-b border-rule"
              >
                <span className="text-sm font-medium text-ink min-w-[200px]">
                  {formatDateTime(s.starts_at)}
                  {s.ends_at ? ` → ${formatDateTime(s.ends_at)}` : ""}
                </span>
                <span className="flex-1 text-sm text-gray min-w-[180px]">
                  {titleBySlug.get(s.formation_slug) ?? s.formation_slug}
                  {s.categories && s.categories.length > 0 && (
                    <span className="ml-2 text-[10px] uppercase tracking-[0.16em] text-primary">
                      Cat. {s.categories.join(" · ")}
                    </span>
                  )}
                </span>
                <SeatsEditor
                  id={s.id}
                  value={s.seats_total}
                  onSave={onSeats}
                  disabled={pending}
                />
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
                  onClick={() => setEditingId(s.id)}
                  disabled={pending}
                  className="text-[11px] uppercase tracking-[0.16em] border border-rule px-3 py-1.5 text-ink hover:bg-ink hover:text-white hover:border-ink transition-colors disabled:opacity-50"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(s.id)}
                  disabled={pending}
                  className="text-[11px] uppercase tracking-[0.16em] border border-rule px-3 py-1.5 text-ink hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors disabled:opacity-50"
                >
                  Suppr.
                </button>
              </li>
            )
          )}
        </ul>
      )}
    </section>
  );
}

function SessionEditor({
  session,
  title,
  availableCategories,
  disabled,
  onCancel,
  onSave,
}: {
  session: SessionRow;
  title: string;
  availableCategories: CategoryDetail[] | null;
  disabled: boolean;
  onCancel: () => void;
  onSave: (data: {
    startDate: string;
    endDate: string;
    categories: string[] | null;
  }) => void;
}) {
  const startK = session.starts_at.slice(0, 10);
  const endK = session.ends_at ? session.ends_at.slice(0, 10) : startK;
  const [startDate, setStartDate] = useState(startK);
  // Date de fin laissée vide si la session tient sur un seul jour.
  const [endDate, setEndDate] = useState(endK !== startK ? endK : "");
  const [cats, setCats] = useState<Set<string>>(
    new Set(session.categories ?? [])
  );

  const editClass =
    "border border-rule bg-light px-3 py-2.5 text-sm text-ink outline-none focus:border-ink";

  function toggleCat(code: string) {
    setCats((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  function save() {
    const selected = availableCategories
      ? availableCategories.filter((c) => cats.has(c.code)).map((c) => c.code)
      : [];
    onSave({
      startDate,
      endDate,
      categories: selected.length > 0 ? selected : null,
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-ink">{title}</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
            Date de début
          </span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={editClass}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
            Date de fin (optionnel)
          </span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={editClass}
          />
        </label>
      </div>

      {availableCategories && availableCategories.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
            Catégories
          </span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {availableCategories.map((c) => (
              <label
                key={c.code}
                className="flex items-center gap-2 text-xs text-ink cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={cats.has(c.code)}
                  onChange={() => toggleCat(c.code)}
                  className="accent-primary"
                />
                <span className="font-medium">{c.code}</span>
                <span className="text-gray normal-case">— {c.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={save}
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
        <span className="text-[11px] text-gray normal-case ml-1">
          Horaires fixes&nbsp;: 9h00 – 17h00.
        </span>
      </div>
    </div>
  );
}

function SeatsEditor({
  id,
  value,
  onSave,
  disabled,
}: {
  id: string;
  value: number | null;
  onSave: (id: string, seats: number | null) => void;
  disabled: boolean;
}) {
  const [draft, setDraft] = useState<string>(value != null ? String(value) : "");

  useEffect(() => {
    setDraft(value != null ? String(value) : "");
  }, [value]);

  function commit() {
    const trimmed = draft.trim();
    const next = trimmed === "" ? null : Math.max(0, Math.floor(Number(trimmed)));
    const same =
      (next == null && value == null) || (next != null && next === value);
    if (!same && (next == null || Number.isFinite(next))) {
      onSave(id, next);
    }
  }

  return (
    <label className="flex items-center gap-1.5 text-xs text-gray">
      <input
        type="number"
        min={0}
        value={draft}
        placeholder="—"
        disabled={disabled}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            (e.currentTarget as HTMLInputElement).blur();
          }
        }}
        className="w-16 border border-rule bg-light px-2 py-1 text-ink outline-none focus:border-ink"
        aria-label="Nombre de places"
      />
      <span>places</span>
    </label>
  );
}
