"use client";

import { useState } from "react";
import { FormationListCard } from "@/components/FormationListCard";
import type { Formation } from "@/lib/data";

type Tab = "sante" | "prevention";

export function AutresFormations({ items }: { items: Formation[] }) {
  const [tab, setTab] = useState<Tab>("sante");
  const filtered = items.filter((f) => f.category === tab);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filtrer les autres formations"
        className="inline-flex border border-rule mb-10"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "sante"}
          onClick={() => setTab("sante")}
          className={`px-5 md:px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] font-medium transition-colors ${
            tab === "sante"
              ? "bg-ink text-white"
              : "bg-white text-ink hover:text-primary"
          }`}
        >
          Santé &amp; sécurité
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "prevention"}
          onClick={() => setTab("prevention")}
          className={`px-5 md:px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] font-medium transition-colors border-l border-rule ${
            tab === "prevention"
              ? "bg-ink text-white"
              : "bg-white text-ink hover:text-primary"
          }`}
        >
          Prévention des risques
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <FormationListCard key={item.slug} item={item} />
        ))}
      </div>
    </div>
  );
}