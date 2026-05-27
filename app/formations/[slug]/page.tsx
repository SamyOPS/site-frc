import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FactCard } from "@/components/FactCard";
import { HeroNav } from "@/components/HeroNav";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { formations, processSteps } from "@/lib/data";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return formations.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const formation = formations.find((f) => f.slug === slug);
  if (!formation) return {};
  return {
    title: formation.code
      ? `Formation CACES® ${formation.code} — ${formation.title}`
      : `Formation ${formation.title}`,
    description: formation.description,
  };
}

const categoryLabel = {
  caces: "CACES®",
  sante: "Santé & sécurité",
  prevention: "Prévention des risques",
} as const;

export default async function FormationPage({ params }: { params: Params }) {
  const { slug } = await params;
  const formation = formations.find((f) => f.slug === slug);
  if (!formation) notFound();

  return (
    <>
      <div className="bg-primary">
        <HeroNav />
      </div>

      <section className="container-x pt-12 md:pt-16 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-gray hover:text-primary transition-colors mb-6"
        >
          <span aria-hidden="true">←</span> Retour à l&apos;accueil
        </Link>

        <p className="text-xs uppercase tracking-[0.24em] text-primary font-medium">
          {formation.code
            ? `CACES® ${formation.code}`
            : categoryLabel[formation.category]}
        </p>
        <h1 className="mt-3 headline text-ink text-[clamp(2rem,4.5vw,3.4rem)]">
          {formation.title}
        </h1>
        {formation.subtitle && (
          <p className="mt-3 text-base md:text-lg text-gray normal-case">
            {formation.subtitle}
          </p>
        )}
      </section>

      <section className="container-x py-12 md:py-16">
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-14">
          <Reveal>
            <p className="text-base md:text-lg text-ink leading-relaxed normal-case">
              {formation.description}
            </p>

            {formation.details && formation.details.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center gap-3 mb-6">
                  <span className="block w-10 h-px bg-primary" />
                  <span className="eyebrow">Programme</span>
                </div>
                <h2 className="headline text-2xl md:text-3xl text-ink mb-6">
                  Ce que vous apprendrez
                </h2>
                <ul className="space-y-3 border-t border-rule">
                  {formation.details.map((d) => (
                    <li
                      key={d}
                      className="flex items-start gap-4 py-4 border-b border-rule"
                    >
                      <span
                        className="block w-5 h-px bg-primary shrink-0 mt-3"
                        aria-hidden="true"
                      />
                      <span className="text-sm md:text-base text-ink leading-relaxed">
                        {d}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="btn hover:bg-primary-dark hover:border-primary-dark"
              >
                Demander un devis
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/"
                className="btn-outline text-ink hover:bg-ink hover:text-white"
              >
                Retour à l&apos;accueil
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:sticky lg:top-28">
            {formation.image && (
              <div className="relative aspect-[4/3] bg-white border border-rule mb-6 overflow-hidden">
                <Image
                  src={formation.image}
                  alt={`Illustration ${formation.title}`}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className={
                    formation.category === "caces"
                      ? "object-contain p-6"
                      : "object-cover"
                  }
                  priority
                />
              </div>
            )}

            <dl className="bg-light border border-rule divide-y divide-rule">
              {formation.duration && (
                <div className="flex justify-between items-center px-5 py-4">
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-gray">
                    Durée
                  </dt>
                  <dd className="text-sm font-medium text-ink text-right">
                    {formation.duration}
                  </dd>
                </div>
              )}
              {formation.validity && (
                <div className="flex justify-between items-center px-5 py-4">
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-gray">
                    Validité
                  </dt>
                  <dd className="text-sm font-medium text-ink text-right">
                    {formation.validity}
                  </dd>
                </div>
              )}
              {formation.funding && (
                <div className="flex justify-between items-center px-5 py-4 gap-4">
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-gray shrink-0">
                    Financement
                  </dt>
                  <dd className="text-sm font-medium text-ink text-right">
                    {formation.funding}
                  </dd>
                </div>
              )}
              {formation.priceFrom && (
                <div className="flex justify-between items-end bg-primary text-white px-5 py-5">
                  <dt className="text-[11px] uppercase tracking-[0.2em]">
                    À partir de
                  </dt>
                  <dd className="headline text-3xl">
                    {formation.priceFrom} €
                  </dd>
                </div>
              )}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="bg-light py-20 md:py-28 border-t border-rule">
        <div className="container-x">
          <Reveal>
            <SectionHeader
              align="center"
              eyebrow="Processus"
              title="4 étapes, de l'évaluation à la certification"
              description="De la définition du besoin à la remise du certificat, nous prenons en charge l'ensemble du parcours."
            />
          </Reveal>
          <Reveal delay={100}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step) => (
                <FactCard key={step.number} step={step} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {(formation.presentation ||
        formation.categoriesDetail ||
        formation.careers ||
        formation.certificationInfo) && (
        <section className="container-x py-20 md:py-28 max-w-4xl border-t border-rule">
          <SectionHeader
            eyebrow="En savoir plus"
            title="Informations complémentaires"
          />

          {formation.presentation && (
            <p className="text-base md:text-lg text-ink leading-relaxed normal-case max-w-3xl">
              {formation.presentation}
            </p>
          )}

          <div className="mt-12 space-y-12">
            {formation.categoriesDetail &&
              formation.categoriesDetail.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="block w-8 h-px bg-primary" />
                    <span className="eyebrow">
                      {formation.code ? "Catégories" : "Niveaux"}
                    </span>
                  </div>
                  <ul className="border-t border-rule">
                    {formation.categoriesDetail.map((c) => (
                      <li
                        key={c.code}
                        className="flex gap-4 py-3 border-b border-rule"
                      >
                        <span className="font-mono text-xs font-semibold text-primary shrink-0 min-w-[44px]">
                          {c.code}
                        </span>
                        <span className="text-sm text-ink leading-snug">
                          {c.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {formation.careers && formation.careers.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="block w-8 h-px bg-primary" />
                  <span className="eyebrow">Métiers &amp; débouchés</span>
                </div>
                <ul className="border-t border-rule">
                  {formation.careers.map((job) => (
                    <li
                      key={job}
                      className="flex items-center gap-4 py-3 border-b border-rule"
                    >
                      <span
                        className="block w-4 h-px bg-primary shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-ink">{job}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {(formation.certificationInfo || formation.validity) && (
            <div className="mt-12 bg-light border border-rule p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="block w-8 h-px bg-primary" />
                <span className="eyebrow">Le certificat &amp; sa validité</span>
              </div>
              {formation.certificationInfo && (
                <p className="text-sm md:text-base text-ink leading-relaxed normal-case">
                  {formation.certificationInfo}
                </p>
              )}
              {formation.validity && (
                <p className="mt-4 text-sm text-gray">
                  <span className="uppercase tracking-[0.18em] text-[11px] text-gray">
                    Durée de validité&nbsp;:
                  </span>{" "}
                  <span className="text-ink font-medium">
                    {formation.validity}
                  </span>
                </p>
              )}
            </div>
          )}
        </section>
      )}
    </>
  );
}
