import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { formations } from "@/lib/data";
import { getUpcomingSessions } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Calendrier de formations — FRC Technique",
  description:
    "Consultez les prochaines sessions de formation FRC Technique : CACES®, habilitations, prévention des risques.",
};

export const revalidate = 300;

const titleBySlug = new Map(
  formations.map((f) => [f.slug, f.code ? `CACES® ${f.code} — ${f.title}` : f.title])
);

const statusBadge: Record<string, { label: string; className: string }> = {
  open: { label: "Places disponibles", className: "bg-primary text-white" },
  full: { label: "Complet", className: "bg-gray/20 text-gray" },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function CalendrierPage() {
  const sessions = await getUpcomingSessions();

  return (
    <>
      <PageHero
        eyebrow="Sessions"
        title="Calendrier de formations"
        description="Retrouvez nos prochaines sessions programmées. Une date vous intéresse ? Contactez-nous pour réserver votre place."
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
          <div className="max-w-4xl mx-auto">
            <ul className="border border-rule divide-y divide-rule">
              {sessions.map((s) => {
                const badge = statusBadge[s.status] ?? statusBadge.open;
                return (
                  <li
                    key={s.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 p-5 md:p-6 bg-white"
                  >
                    <div className="sm:w-56 shrink-0">
                      <p className="headline text-lg text-ink leading-tight">
                        {formatDate(s.starts_on)}
                      </p>
                      {s.ends_on && (
                        <p className="text-xs text-gray mt-0.5">
                          au {formatDate(s.ends_on)}
                        </p>
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="text-sm md:text-base font-medium text-ink">
                        {titleBySlug.get(s.formation_slug) ?? s.formation_slug}
                      </p>
                      <p className="text-xs text-gray mt-0.5">
                        {s.location ?? "Montataire (60)"}
                        {s.seats_total != null
                          ? ` · ${s.seats_total} places`
                          : ""}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`text-[10px] uppercase tracking-[0.18em] font-medium px-3 py-1.5 ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                      <Link
                        href="/contact"
                        className="text-[11px] uppercase tracking-[0.18em] font-medium text-ink hover:text-primary transition-colors whitespace-nowrap"
                      >
                        S&apos;inscrire →
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-10 text-center">
              <Link
                href="/contact"
                className="btn hover:bg-primary-dark hover:border-primary-dark"
              >
                Une autre date ? Nous contacter
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
