"use client";

import { useState, type ReactNode } from "react";

export type AdminSection = {
  id: string;
  label: string;
  /** Pastille (ex. nombre d'avis en attente). */
  badge?: number;
  content: ReactNode;
};

export function AdminShell({ sections }: { sections: AdminSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:gap-10 items-start">
      {/* Sidebar / barre de catégories */}
      <aside className="lg:sticky lg:top-10 self-start">
        <nav className="flex lg:flex-col overflow-x-auto border border-rule bg-white">
          {sections.map((s) => {
            const isActive = s.id === active;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s.id)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center justify-between gap-2 whitespace-nowrap px-4 py-3 text-left text-[11px] uppercase tracking-[0.16em] font-medium transition-colors border-r last:border-r-0 lg:border-r-0 lg:border-b lg:last:border-b-0 border-rule ${
                  isActive
                    ? "bg-ink text-white"
                    : "text-ink hover:bg-light"
                }`}
              >
                <span>{s.label}</span>
                {s.badge ? (
                  <span
                    className={`inline-flex items-center justify-center min-w-5 h-5 px-1 text-[10px] tracking-normal ${
                      isActive
                        ? "bg-primary text-white"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {s.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Contenu : toutes les sections sont montées, seule l'active est visible
          (préserve l'état des formulaires lors des changements d'onglet). */}
      <div className="min-w-0">
        {sections.map((s) => (
          <div key={s.id} className={s.id === active ? "" : "hidden"}>
            {s.content}
          </div>
        ))}
      </div>
    </div>
  );
}
