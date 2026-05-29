import type { Metadata } from "next";
import Link from "next/link";
import { CalendrierLegend, CalendrierView } from "@/components/CalendrierView";
import { PageHero } from "@/components/PageHero";
import { formations } from "@/lib/data";
import { getPriceMap, getUpcomingSessions } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Calendrier de formations — FRC Technique",
  description:
    "Emploi du temps hebdomadaire des sessions FRC Technique : CACES®, habilitations, prévention des risques.",
};

export const revalidate = 300;

export default async function CalendrierPage() {
  const [sessions, priceMap] = await Promise.all([
    getUpcomingSessions(),
    getPriceMap(),
  ]);

  const titleBySlug: Record<string, string> = Object.fromEntries(
    formations.map((f) => [
      f.slug,
      f.code ? `CACES® ${f.code} — ${f.title}` : f.title,
    ])
  );

  const priceBySlug: Record<string, number | null> = Object.fromEntries(
    formations.map((f) => [f.slug, priceMap[f.slug] ?? f.priceFrom ?? null])
  );

  return (
    <>
      <PageHero
        eyebrow="Planning"
        title="Emploi du temps des sessions"
        description="Naviguez d'une semaine à l'autre, cliquez sur une session pour l'ajouter à votre panier et obtenir un devis."
      />

      <section className="container-x py-12 md:py-20">
        {sessions.length === 0 ? (
          <div className="relative overflow-hidden border border-rule bg-light p-10 md:p-16 text-center">
            <div
              aria-hidden="true"
              className="absolute top-7 -right-16 w-56 rotate-45 bg-primary text-white text-center text-[11px] uppercase tracking-[0.2em] font-medium py-1.5 shadow-md"
            >
              Bientôt disponible
            </div>
            <div className="relative max-w-xl mx-auto">
              <h2 className="headline text-2xl md:text-4xl text-ink">
                Aucune session programmée pour le moment
              </h2>
              <p className="mt-4 text-sm md:text-base text-gray leading-relaxed normal-case">
                De nouvelles dates seront publiées prochainement. En attendant,
                contactez-nous pour organiser votre formation — en inter ou en
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
              </div>
            </div>
          </div>
        ) : (
          <>
            <CalendrierView
              sessions={sessions}
              titleBySlug={titleBySlug}
              priceBySlug={priceBySlug}
            />
            <CalendrierLegend />

            <div className="mt-10 text-center">
              <Link
                href="/contact"
                className="btn hover:bg-primary-dark hover:border-primary-dark"
              >
                Une autre date ? Nous contacter
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </>
        )}
      </section>
    </>
  );
}
