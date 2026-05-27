import Image from "next/image";
import Link from "next/link";
import { HeroSlider } from "@/components/HeroSlider";
import { SectionHeader } from "@/components/SectionHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { AutresFormations } from "@/components/AutresFormations";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Decor } from "@/components/Decor";
import { Reveal } from "@/components/Reveal";
import { getPriceMap } from "@/lib/queries";
import { ContactForm } from "@/components/ContactForm";
import {
  cacesFormations,
  company,
  faq,
  formations,
  stats,
  testimonials,
} from "@/lib/data";
import aboutImage from "@/public/frc/3w6a0433_52035903199_o.webp";

const autresFormations = formations.filter((f) => f.category !== "caces");

const aboutChecks = [
  "Certifié Qualiopi pour les actions de formation",
  "Financements CPF · OPCO · France Travail",
  "Sessions inter et intra-entreprise",
  "Formateurs expérimentés issus du terrain",
];

export const metadata = {
  title: "FRC Technique — Formations CACES® & prévention à Montataire (60)",
  description:
    "Organisme de formation certifié Qualiopi, FRC Technique propose 14 formations CACES® (R489, R486, R482) et de prévention des risques, finançables via CPF, OPCO et France Travail.",
};

// Régénération périodique + revalidation à la demande après édition admin
export const revalidate = 300;

const formationBenefits = [
  "Devis personnalisé sous 24h",
  "Montage du dossier de financement",
  "Sessions en France entière",
  "Plus de 98% de taux de réussite",
];

export default async function Home() {
  const priceMap = await getPriceMap();
  const cacesWithPrices = cacesFormations.map((f) => ({
    ...f,
    priceFrom: priceMap[f.slug] ?? f.priceFrom,
  }));

  return (
    <>
      <HeroSlider />

      {/* Chiffres clés */}
      <section className="bg-ink text-white">
        <div className="container-x py-10 md:py-12 grid grid-cols-2 md:grid-cols-4 gap-y-8">
          {stats.map((stat, i) => (
            <Reveal
              key={stat.label}
              delay={i * 80}
              className={`px-4 md:px-6 ${
                i > 0 ? "md:border-l md:border-white/10" : ""
              }`}
            >
              <p className="headline text-3xl md:text-5xl text-primary">
                {stat.value}
              </p>
              <p className="mt-2 text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/65">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* À propos */}
      <section className="container-x py-24 md:py-32">
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
            <div className="absolute bottom-6 left-6 bg-ink text-white px-5 py-4 max-w-[220px]">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
                Depuis {company.created.split(" ").pop()}
              </p>
              <p className="headline text-2xl mt-1 leading-none">Certifié Qualiopi</p>
              <p className="text-[10px] text-white/70 normal-case mt-1.5">
                pour les actions de formation
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <SectionHeader
              eyebrow="À propos"
              title="Votre centre de formation à Montataire"
              description="FRC Technique est un organisme de formation certifié Qualiopi pour les actions de formation, spécialisé dans les CACES® et la prévention des risques professionnels. Nous formons conducteurs, opérateurs et équipes QHSE partout en France, avec une pédagogie ancrée dans la pratique."
            />
            <ul className="space-y-0 border-t border-rule">
              {aboutChecks.map((c) => (
                <li
                  key={c}
                  className="flex items-center gap-4 py-4 border-b border-rule text-ink"
                >
                  <span
                    className="block w-6 h-px bg-primary shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm md:text-base">{c}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
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
                className="btn-outline text-ink hover:bg-ink hover:text-white"
              >
                Certificat Qualiopi
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Formations CACES grid */}
      <section className="relative overflow-hidden bg-light py-24 md:py-32 border-y border-rule">
        <Decor>
          <span className="absolute -top-20 -right-20 w-72 h-72 rounded-full border-2 border-primary/15" />
          <span className="absolute -bottom-12 -left-12 w-40 h-40 bg-primary/10 rotate-12" />
          <span className="absolute top-1/3 left-[8%] w-3 h-3 bg-primary/40" />
        </Decor>
        <div className="container-x relative">
          <Reveal className="mb-14">
            <SectionHeader
              eyebrow="Formations"
              title="Nos certifications CACES®"
              description="R489, R486 et R482 : toutes nos formations sont conformes aux recommandations CNAM et préparent à la certification CACES®."
            />
          </Reveal>
          <Reveal delay={100}>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cacesWithPrices.map((item) => (
                <ServiceCard key={item.code} item={item} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Autres formations */}
      <section className="container-x py-24 md:py-32">
        <Reveal className="mb-14">
          <SectionHeader
            eyebrow="Autres formations"
            title="Santé, sécurité & prévention"
            description="11 formations complémentaires : SST, habilitations électriques, AIPR, échafaudages, amiante SS4, travail en hauteur..."
          />
        </Reveal>
        <Reveal delay={100}>
          <AutresFormations items={autresFormations} />
        </Reveal>
      </section>

      {/* Financement + form */}
      <section className="relative isolate overflow-hidden text-white bg-ink">
        <div className="absolute inset-0 grid-bg opacity-40 -z-10" aria-hidden="true" />
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(circle at 80% 100%, rgba(22,163,74,0.15) 0%, transparent 50%)",
          }}
        />
        <Decor>
          <span className="absolute -top-20 -left-20 w-80 h-80 rounded-full border border-white/10" />
          <span className="absolute bottom-12 right-[6%] w-24 h-24 border border-primary/30 rotate-12" />
        </Decor>
        <div className="container-x relative py-24 md:py-32 grid gap-14 lg:grid-cols-[1fr_1.4fr] items-start">
          <Reveal>
            <SectionHeader
              eyebrow="Financement"
              title="CPF · OPCO · France Travail"
              description="Vous êtes salarié, demandeur d'emploi ou employeur ? Nous identifions le bon dispositif et montons le dossier avec vous."
              light
            />
            <ul className="space-y-0 border-t border-white/15">
              {formationBenefits.map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-4 text-white/90 py-4 border-b border-white/15"
                >
                  <span className="block w-6 h-px bg-primary shrink-0" aria-hidden="true" />
                  <span className="text-sm md:text-base">{b}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120} className="border border-white/15 bg-white/5 backdrop-blur-sm p-6 md:p-10">
            <p className="eyebrow text-primary">
              <span className="block w-8 h-px bg-primary" />
              Devis express
            </p>
            <h3 className="mt-3 headline text-3xl text-white">
              Demande d&apos;inscription
            </h3>
            <p className="mt-2 text-sm text-white/65 mb-8 normal-case">
              Échangeons sur votre projet : nos conseillers reviennent vers vous sous 24h ouvrées.
            </p>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      {/* Témoignages */}
      <section className="relative overflow-hidden bg-white py-24 md:py-32">
        <Decor>
          <span className="absolute -top-16 left-[10%] w-48 h-48 rounded-full border-2 border-primary/20" />
          <span className="absolute bottom-10 right-[8%] w-28 h-28 bg-primary/15 -rotate-6" />
          <span className="absolute top-1/4 right-[18%] w-3 h-3 rounded-full bg-primary/50" />
          <span className="absolute bottom-1/3 left-[6%] w-24 h-24 rounded-full border-2 border-primary/15" />
        </Decor>
        <div className="container-x relative">
          <Reveal>
            <SectionHeader
              align="center"
              eyebrow="Témoignages"
              title="Ils ont choisi FRC Technique"
            />
          </Reveal>
          <Reveal delay={100}>
            <TestimonialsCarousel items={testimonials} />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative overflow-hidden bg-light py-24 md:py-32 border-t border-rule">
        <Decor>
          <span className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full border-2 border-primary/12" />
          <span className="absolute top-16 right-[12%] w-16 h-16 bg-primary/10 rotate-12" />
        </Decor>
        <div className="container-x relative grid lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-20 items-start">
          <Reveal className="lg:sticky lg:top-28">
            <SectionHeader
              eyebrow="FAQ"
              title="Questions fréquentes"
              description="Tout ce qu'il faut savoir sur nos formations, le financement et le déroulé des sessions."
            />
            <div className="border border-rule bg-white p-6 md:p-7">
              <p className="headline text-lg text-ink">Une autre question ?</p>
              <p className="mt-2 text-sm text-gray normal-case">
                Notre équipe vous répond sous 24h ouvrées.
              </p>
              <Link
                href="/contact"
                className="btn mt-5 hover:bg-primary-dark hover:border-primary-dark"
              >
                Nous contacter
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <FaqAccordion items={faq} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
