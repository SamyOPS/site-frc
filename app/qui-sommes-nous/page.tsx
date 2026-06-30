import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { OiseMap } from "@/components/OiseMap";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { company, engagements, stats } from "@/lib/data";
import aboutImage from "@/public/frc/3w6a0433_52035903199_o.webp";

export const metadata: Metadata = {
  title: "Qui sommes-nous ? — FRC Technique",
  description:
    "FRC Technique, organisme de formation certifié Qualiopi pour les actions de formation, basé à Montataire (60). Spécialiste CACES® et prévention des risques depuis 2020.",
};

export default function QuiSommesNousPage() {
  return (
    <>
      <PageHero
        eyebrow="À propos"
        title="Qui sommes-nous ?"
        description={`Organisme de formation certifié Qualiopi pour les actions de formation, FRC Technique accompagne entreprises, indépendants et demandeurs d'emploi depuis ${company.created.split(" ").pop()}.`}
      />

      <section className="container-x pb-8 md:pb-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal className="relative">
            <div className="relative aspect-[5/4] overflow-hidden">
              <Image
                src={aboutImage}
                alt="Formation FRC Technique en situation"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div
              aria-hidden="true"
              className="absolute -bottom-6 -right-6 hidden md:block w-32 h-32 border-2 border-primary -z-10"
            />
          </Reveal>

          <Reveal delay={120}>
            <SectionHeader
              eyebrow="Notre histoire"
              title="Former, c'est protéger"
              description="Spécialisés dans les CACES® et la prévention des risques professionnels, nous formons conducteurs, opérateurs et équipes QHSE partout en France."
            />
            <p className="text-gray text-sm md:text-base leading-relaxed normal-case">
              Notre approche mise sur la pratique : une large part du temps de
              formation est consacrée à des exercices concrets, sur du matériel
              professionnel récent. Nos formateurs sont issus du terrain (BTP,
              logistique, industrie) et connaissent les réalités opérationnelles
              de vos métiers. Nous animons des sessions inter-entreprises dans
              nos locaux de Montataire (60) ainsi que des sessions intra
              directement sur vos sites.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink text-white relative overflow-hidden mt-12 md:mt-16">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden="true" />
        <div className="container-x relative py-14 grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`px-4 md:px-6 py-2 ${
                i > 0 ? "border-l border-white/10" : ""
              }`}
            >
              <p className="headline text-4xl md:text-6xl text-primary">
                {stat.value}
              </p>
              <p className="text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/65 mt-3">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x py-20 md:py-28">
        <Reveal>
          <SectionHeader
            align="center"
            eyebrow="Nos engagements"
            title="Quatre principes qui guident notre travail"
          />
        </Reveal>
        <Reveal delay={100}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {engagements.map((e) => (
              <div key={e.title} className="bg-light border border-rule p-7">
                <span
                  className="block w-8 h-px bg-primary mb-4"
                  aria-hidden="true"
                />
                <h3 className="headline text-xl text-ink">{e.title}</h3>
                <p className="mt-3 text-sm text-gray leading-relaxed normal-case">
                  {e.description}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="container-x pb-20 md:pb-28">
        <Reveal>
          <SectionHeader
            eyebrow="Notre implantation"
            title="À Montataire, au cœur de l'Oise"
            description="Nos locaux et nos plateaux techniques sont basés dans le sud du département. Nous intervenons aussi en intra-entreprise partout en France."
          />
        </Reveal>

        <div className="mt-10 grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-12 items-stretch">
          <Reveal>
            <div className="border border-rule bg-white p-4 md:p-6 h-full">
              <OiseMap />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="bg-light border border-rule h-full p-7 md:p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <span className="block w-8 h-px bg-primary" />
                <span className="eyebrow">Coordonnées</span>
              </div>

              <dl className="space-y-5 text-sm">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-gray">
                    Adresse
                  </dt>
                  <dd className="mt-1.5 text-ink font-medium normal-case">
                    {company.address}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-gray">
                    Email
                  </dt>
                  <dd className="mt-1.5">
                    <a
                      href={`mailto:${company.email}`}
                      className="text-ink font-medium hover:text-primary transition-colors normal-case"
                    >
                      {company.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-gray">
                    Horaires
                  </dt>
                  <dd className="mt-1.5 text-ink font-medium normal-case">
                    {company.hours}
                  </dd>
                </div>
              </dl>

              <div className="mt-auto pt-6 border-t border-rule">
                <p className="text-xs text-gray normal-case leading-relaxed">
                  Sessions inter-entreprises dans nos locaux et formations
                  intra sur site à la demande.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-x pb-20 md:pb-28">
        <div className="bg-ink text-white p-10 md:p-16 grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-40" aria-hidden="true" />
          <div className="relative">
            <p className="eyebrow text-primary">
              <span className="block w-10 h-px bg-primary" />
              Échangeons
            </p>
            <h2 className="mt-4 headline text-3xl md:text-5xl text-white">
              Un projet de formation&nbsp;?
            </h2>
            <p className="mt-4 text-white/75 max-w-xl normal-case">
              Parlons de vos besoins : nous identifions la formation adaptée et
              le dispositif de financement le plus pertinent.
            </p>
          </div>
          <div className="relative flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
            <Link
              href="/contact"
              className="btn hover:bg-primary-dark hover:border-primary-dark"
            >
              Nous contacter
              <span aria-hidden="true">→</span>
            </Link>
            <a
              href="/certificat-qualiopi.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-white hover:bg-white hover:text-ink"
            >
              Certificat Qualiopi
            </a>
            <a
              href="/certificat-caces.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-white hover:bg-white hover:text-ink"
            >
              Certificat CACES®
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
