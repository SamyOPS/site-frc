import Image from "next/image";
import Link from "next/link";
import type { Formation } from "@/lib/data";

const categoryLabel: Record<string, string> = {
  sante: "Santé & sécurité",
  prevention: "Prévention des risques",
  caces: "CACES®",
};

export function FormationListCard({ item }: { item: Formation }) {
  return (
    <Link
      href={`/formations/${item.slug}`}
      className="group relative block bg-white border border-rule transition-all duration-300 hover:-translate-y-1 hover:border-ink hover:shadow-[8px_8px_0_0_var(--color-primary)]"
    >
      <span className="absolute top-0 left-0 h-1 w-12 bg-primary transition-all duration-500 group-hover:w-full z-10" />

      {item.image && (
        <div className="relative h-44 overflow-hidden border-b border-rule bg-light">
          <Image
            src={item.image}
            alt={`Illustration ${item.title}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-6">
        <p className="text-[10px] uppercase tracking-[0.22em] text-primary font-medium">
          {categoryLabel[item.category] ?? item.category}
        </p>
        <h3 className="mt-3 headline text-lg text-ink leading-tight">
          {item.title}
        </h3>
        {item.subtitle && (
          <p className="mt-1.5 text-[11px] uppercase tracking-[0.18em] text-gray">
            {item.subtitle}
          </p>
        )}
        <p className="mt-4 text-sm text-gray leading-relaxed normal-case line-clamp-3">
          {item.description}
        </p>

        <div className="mt-6 pt-4 border-t border-rule flex items-center justify-between gap-3">
          <span className="text-[10px] uppercase tracking-[0.18em] text-gray">
            {item.duration ?? "Sur devis"}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] font-medium text-ink group-hover:text-primary transition-colors">
            En savoir plus <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
