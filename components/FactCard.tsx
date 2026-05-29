import Image from "next/image";
import type { ProcessStep } from "@/lib/data";

export function FactCard({ step }: { step: ProcessStep }) {
  return (
    <article className="relative aspect-[4/5] overflow-hidden group bg-ink border border-white/10">
      <Image
        src={step.image}
        alt=""
        fill
        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
        className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/30 to-ink/90"
      />
      <span
        aria-hidden="true"
        className="absolute top-4 left-4 right-4 border-t border-l border-r border-white/15 h-3"
      />
      <span
        aria-hidden="true"
        className="absolute bottom-4 left-4 right-4 border-b border-l border-r border-white/15 h-3"
      />

      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <span
          className="font-display font-extrabold text-[88px] md:text-[104px] leading-none text-transparent"
          style={{ WebkitTextStroke: "1.5px var(--color-primary)" }}
          aria-hidden="true"
        >
          {step.number}
        </span>
        <h3 className="mt-1 headline text-2xl text-white">
          {step.title}
        </h3>
        <p className="mt-2 text-sm text-white/85 leading-relaxed normal-case">
          {step.description}
        </p>
      </div>
    </article>
  );
}
