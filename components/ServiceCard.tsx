import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { CacesFormation } from "@/lib/data";
import { Placeholder } from "@/components/Placeholder";
import machineR489 from "@/public/machine/CASESR489-CEYMC3bi.png";
import machineR486 from "@/public/machine/cacesr486.png";
import machineR482 from "@/public/machine/cacesr482.png";

const imagesByCode: Record<string, StaticImageData> = {
  R489: machineR489,
  R486: machineR486,
  R482: machineR482,
};

export function ServiceCard({ item }: { item: CacesFormation }) {
  const image = imagesByCode[item.code];
  return (
    <article className="group relative overflow-hidden bg-white border border-rule transition-all duration-300 hover:-translate-y-1 hover:border-ink hover:shadow-[8px_8px_0_0_var(--color-primary)]">
      <span className="absolute top-0 left-0 h-1 w-12 bg-primary transition-all duration-500 group-hover:w-full z-10" />

      <div className="relative h-56 overflow-hidden bg-white border-b border-rule">
        {image ? (
          <Image
            src={image}
            alt={`Illustration formation CACES® ${item.code} — ${item.title}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Placeholder fill label={`CACES® ${item.code}`} />
        )}
        <span className="absolute top-3 right-3 tag bg-white border border-rule text-ink z-10">
          {item.code}
        </span>
      </div>

      <div className="relative p-6">
        <h3 className="headline text-xl text-ink">
          {item.title}
        </h3>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-primary font-medium">
          CACES® {item.code} · {item.subtitle}
        </p>
        <p className="mt-4 text-sm text-gray leading-relaxed normal-case">
          {item.description}
        </p>
        <dl className="mt-5 space-y-1.5 text-xs">
          <div className="flex justify-between border-b border-rule pb-1.5">
            <dt className="uppercase tracking-wider text-gray">Durée</dt>
            <dd className="text-ink font-medium">{item.duration}</dd>
          </div>
          <div className="flex justify-between border-b border-rule pb-1.5">
            <dt className="uppercase tracking-wider text-gray">Validité</dt>
            <dd className="text-ink font-medium">{item.validity}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="uppercase tracking-wider text-gray">Financement</dt>
            <dd className="text-ink font-medium text-right max-w-[60%]">
              {item.funding}
            </dd>
          </div>
        </dl>
        <div className="mt-6 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-gray">
              À partir de
            </p>
            <p className="headline text-3xl text-primary">{item.priceFrom}€</p>
          </div>
          <Link
            href={`/formations/${item.slug}`}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] font-medium text-ink hover:text-primary transition-colors"
          >
            En savoir plus <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
