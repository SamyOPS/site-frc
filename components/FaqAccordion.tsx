"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/data";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className="space-y-3">
      {items.map((item, i) => {
        const isOpen = i === open;
        return (
          <li
            key={item.question}
            className={`bg-white border transition-colors duration-200 ${
              isOpen ? "border-ink" : "border-rule"
            }`}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 text-left p-5 md:p-6 group"
            >
              <span
                className={`headline text-base md:text-lg transition-colors ${
                  isOpen ? "text-primary" : "text-ink group-hover:text-primary"
                }`}
              >
                {item.question}
              </span>
              <span
                aria-hidden="true"
                className={`grid place-items-center w-8 h-8 shrink-0 border transition-all duration-200 ${
                  isOpen
                    ? "bg-primary text-white border-primary rotate-180"
                    : "border-rule text-ink group-hover:border-primary"
                }`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>
            <div
              id={`faq-panel-${i}`}
              role="region"
              hidden={!isOpen}
              className="px-5 md:px-6 pb-6 -mt-1 text-sm text-gray leading-relaxed normal-case"
            >
              {item.answer}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
