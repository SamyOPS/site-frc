import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Calendrier de formations — FRC Technique",
  description:
    "Le calendrier des sessions de formation FRC Technique sera bientôt disponible. Contactez-nous pour connaître les prochaines dates.",
};

export default function CalendrierPage() {
  return (
    <>
      <PageHero
        eyebrow="Sessions"
        title="Calendrier de formations"
        description="Retrouvez prochainement ici l'ensemble de nos sessions programmées, par formation et par date."
      />

      <section className="container-x py-12 md:py-20">
        <div className="relative overflow-hidden border border-rule bg-light p-10 md:p-16 text-center">
          {/* Ruban diagonal */}
          <div
            aria-hidden="true"
            className="absolute top-7 -right-16 w-56 rotate-45 bg-primary text-white text-center text-[11px] uppercase tracking-[0.2em] font-medium py-1.5 shadow-md"
          >
            Bientôt disponible
          </div>

          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" aria-hidden="true" />

          <div className="relative max-w-xl mx-auto">
            <span className="inline-grid place-items-center w-16 h-16 bg-ink text-primary mx-auto mb-6">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="18" rx="0" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>

            <h2 className="headline text-2xl md:text-4xl text-ink">
              Notre calendrier arrive bientôt
            </h2>
            <p className="mt-4 text-sm md:text-base text-gray leading-relaxed normal-case">
              Nous finalisons la mise en ligne de nos sessions programmées. En
              attendant, contactez-nous pour connaître les prochaines dates
              disponibles et organiser votre formation — en inter ou en
              intra-entreprise, partout en France.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="btn hover:bg-primary-dark hover:border-primary-dark"
              >
                Demander les prochaines dates
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/"
                className="btn-outline text-ink hover:bg-ink hover:text-white"
              >
                Voir nos formations
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
