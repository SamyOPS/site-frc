import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { ContactForm } from "@/components/ContactForm";
import { FaqAccordion } from "@/components/FaqAccordion";
import { company, faq } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact FRC Technique — Devis & inscription",
  description:
    "Une question, un devis, une inscription ? Contactez FRC Technique à Montataire (60). Réponse sous 24h ouvrées.",
};

type ContactCard = {
  title: string;
  value: ReactNode;
  note?: string;
  href?: string;
  icon: ReactNode;
};

const contactCards: ContactCard[] = [
  {
    title: "Email",
    value: company.email,
    href: `mailto:${company.email}`,
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <polyline points="3 7 12 13 21 7" />
      </>
    ),
  },
  {
    title: "Adresse",
    value: company.address,
    icon: (
      <>
        <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12z" />
        <circle cx="12" cy="9" r="2.5" />
      </>
    ),
  },
  {
    title: "Horaires",
    value: company.hours,
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 15 14" />
      </>
    ),
  },
  {
    title: "Certification",
    value: (
      <>
        <span className="block">Qualiopi</span>
        <span className="block mt-1 text-[11px] font-normal tracking-normal normal-case leading-snug text-gray">
          pour les actions de formation
        </span>
        <span className="block mt-3">CACES®</span>
        <span className="block mt-1 text-[11px] font-normal tracking-normal normal-case leading-snug text-gray">
          R489, R486 et R482 · éligible CPF, OPCO, France Travail
        </span>
      </>
    ),
    icon: (
      <>
        <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4z" />
        <polyline points="9 12 11 14 15 10" />
      </>
    ),
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Échangeons sur votre projet de formation"
        description="Notre équipe vous accompagne sur le choix des formations, le montage du dossier de financement et la planification des sessions."
      />

      <section className="container-x py-24 md:py-28">
        <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4 border border-rule">
          {contactCards.map((card, i) => {
            const content = (
              <>
                <div className="flex items-center justify-between">
                  <span className="inline-grid place-items-center w-11 h-11 bg-ink text-primary">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {card.icon}
                    </svg>
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-gray">
                    0{i + 1}
                  </span>
                </div>
                <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.24em] text-gray">
                  {card.title}
                </p>
                <p
                  className={`mt-2 headline text-lg text-ink break-words whitespace-pre-line ${
                    card.title === "Email" ? "lowercase" : ""
                  }`}
                >
                  {card.value}
                </p>
                {card.note && (
                  <p className="mt-1.5 text-[11px] text-gray normal-case leading-snug">
                    {card.note}
                  </p>
                )}
              </>
            );
            const borderClass = `${
              i > 0 ? "border-t sm:border-t-0" : ""
            } ${
              i % 2 === 1 ? "sm:border-l border-rule" : ""
            } lg:border-l lg:first:border-l-0 border-rule`;
            return card.href ? (
              <a
                key={card.title}
                href={card.href}
                className={`bg-white p-7 hover:bg-light transition-colors ${borderClass}`}
              >
                {content}
              </a>
            ) : (
              <div
                key={card.title}
                className={`bg-white p-7 ${borderClass}`}
              >
                {content}
              </div>
            );
          })}
        </div>
      </section>

      <section className="container-x pb-24 md:pb-28">
        <div className="grid lg:grid-cols-[1fr_1.6fr] overflow-hidden border border-rule">
          <div className="bg-ink text-white p-10 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-40" aria-hidden="true" />
            <div className="relative">
              <SectionHeader
                eyebrow="Parlons formation"
                title="Une réponse en 24h ouvrées"
                description="Décrivez votre besoin, nous revenons vers vous avec une proposition adaptée et le dispositif de financement le plus pertinent."
                light
              />
              <ul className="space-y-0 text-white/85 text-sm border-t border-white/15">
                <li className="flex items-center gap-3 py-3 border-b border-white/15">
                  <span className="font-mono text-xs text-primary">01</span>
                  Devis personnalisé sous 24h
                </li>
                <li className="flex items-center gap-3 py-3 border-b border-white/15">
                  <span className="font-mono text-xs text-primary">02</span>
                  Montage du dossier CPF / OPCO
                </li>
                <li className="flex items-center gap-3 py-3 border-b border-white/15">
                  <span className="font-mono text-xs text-primary">03</span>
                  Sessions inter et intra-entreprise
                </li>
                <li className="flex items-center gap-3 py-3">
                  <span className="font-mono text-xs text-primary">04</span>
                  Tout le territoire français
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-white p-10 md:p-12">
            <ContactForm variant="light" />
          </div>
        </div>
      </section>

      <section className="bg-light py-20 md:py-24">
        <div className="container-x max-w-3xl mx-auto">
          <SectionHeader
            align="center"
            eyebrow="Vos questions"
            title="Foire aux questions"
          />
          <FaqAccordion items={faq} />
        </div>
      </section>
    </>
  );
}
