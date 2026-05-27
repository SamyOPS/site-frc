import Image from "next/image";
import Link from "next/link";
import { HeroNav } from "@/components/HeroNav";
import { AnimatedMarquee } from "@/components/AnimatedMarquee";
import qualiopiLogo from "@/public/logo_qualiopi.png";
import cpfLogo from "@/public/logo cpf.png";
import franceTravailLogo from "@/public/France-travail-2023.svg.png";

export function HeroSlider() {
  return (
    <section className="relative overflow-hidden bg-primary text-white min-h-[560px] md:min-h-[70vh] flex flex-col">
      <span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 35%, rgba(0,0,0,0.22) 100%)",
        }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 92% 8%, rgba(220,252,231,0.22) 0%, transparent 45%)",
        }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 8% 95%, rgba(0,0,0,0.28) 0%, transparent 55%)",
        }}
      />
      <div
        className="absolute inset-0 grid-bg opacity-25 pointer-events-none"
        aria-hidden="true"
      />

      <div
        aria-hidden="true"
        className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full border border-white/15 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/4 -left-24 w-72 h-72 rounded-full bg-white/8 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 left-1/3 w-[480px] h-[480px] rounded-full border border-white/10 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-1/4 right-1/3 w-40 h-40 rounded-full border border-white/20 pointer-events-none"
      />

      <div className="relative flex flex-col flex-1">
        <HeroNav />

        <div className="container-x flex-1 grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12 items-center py-8 lg:py-10">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              {[
                {
                  src: qualiopiLogo,
                  alt: "Certifié Qualiopi pour les actions de formation — Processus certifié République Française",
                },
                { src: cpfLogo, alt: "Éligible Mon Compte Formation (CPF)" },
                { src: franceTravailLogo, alt: "Éligible France Travail" },
              ].map((logo) => (
                <div
                  key={logo.alt}
                  className="bg-white flex items-center justify-center p-2 h-12 w-24 sm:h-14 sm:w-28 md:h-16 md:w-32 lg:h-20 lg:w-40"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    className="max-h-full max-w-full w-auto h-auto object-contain"
                    priority
                  />
                </div>
              ))}
            </div>
            <h1 className="headline text-white text-[clamp(2.2rem,5vw,4rem)]">
              Formations CACES® &amp; prévention des risques
            </h1>
            <p className="mt-6 text-white/85 text-base md:text-lg leading-relaxed max-w-xl">
              CACES® R489, R486, R482, habilitations électriques, AIPR,
              amiante SS4, SST... Plus de 14 formations certifiantes
              finançables CPF, OPCO et France Travail.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2.5 bg-ink text-white border border-ink px-7 py-4 text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-white hover:text-ink hover:border-white transition-colors"
              >
                Obtenir un devis
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <AnimatedMarquee />
          </div>
        </div>
      </div>
    </section>
  );
}
