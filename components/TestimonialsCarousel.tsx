"use client";

import { useState } from "react";
import type { Testimonial } from "@/lib/data";

function initials(name: string) {
  return name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const count = items.length;
  const go = (next: number) => setIndex(((next % count) + count) % count);
  const t = items[index];

  return (
    <div className="max-w-3xl mx-auto">
      <figure className="relative bg-white border border-rule p-8 md:p-12 flex flex-col min-h-[320px]">
        <span
          aria-hidden="true"
          className="font-display font-extrabold text-6xl text-primary leading-none"
        >
          &ldquo;
        </span>
        <blockquote
          aria-live="polite"
          className="-mt-3 flex-1 text-base md:text-xl text-ink leading-relaxed normal-case"
        >
          {t.quote}
        </blockquote>
        <figcaption className="mt-8 pt-6 border-t border-rule flex items-center gap-4">
          <span
            aria-hidden="true"
            className="w-12 h-12 bg-ink text-primary headline text-lg flex items-center justify-center shrink-0"
          >
            {initials(t.name)}
          </span>
          <p className="headline text-base text-ink">{t.name}</p>
        </figcaption>
      </figure>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Avis précédent"
          onClick={() => go(index - 1)}
          className="grid place-items-center w-11 h-11 border border-rule text-ink hover:bg-ink hover:text-white hover:border-ink transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="flex gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Avis ${i + 1}`}
              aria-current={i === index}
              onClick={() => go(i)}
              className={`h-1 transition-all ${
                i === index ? "w-8 bg-primary" : "w-4 bg-rule"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Avis suivant"
          onClick={() => go(index + 1)}
          className="grid place-items-center w-11 h-11 border border-rule text-ink hover:bg-ink hover:text-white hover:border-ink transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
