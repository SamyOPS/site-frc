import Image from "next/image";
import Link from "next/link";
import { HeroNav } from "@/components/HeroNav";
import { AnimatedMarquee } from "@/components/AnimatedMarquee";
import { PromoBanner } from "@/components/PromoBanner";
import { getActivePromotions } from "@/lib/queries";
import qualiopiLogo from "@/public/logo_qualiopi.png";
import cpfLogo from "@/public/logo cpf.png";
import franceTravailLogo from "@/public/France-travail-2023.svg.png";

export async function HeroSlider() {
  const promotions = await getActivePromotions();

  return (
    <section
      className="relative overflow-hidden text-ink min-h-[560px] md:min-h-[70vh] flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, #ffffff 0%, #dcfce7 50%, #bbf7d0 100%)",
      }}
    >
      <PromoBanner promotions={promotions} />

      <span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 88% 18%, rgba(22,163,74,0.16) 0%, transparent 55%)",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full border-2 border-primary/15 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/4 -left-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-1/4 right-1/3 w-40 h-40 rounded-full border-2 border-primary/15 pointer-events-none"
      />

      <div className="relative flex flex-col flex-1">
        <HeroNav variant="light" />

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
                  className="bg-white border border-rule flex items-center justify-center p-2 h-12 w-24 sm:h-14 sm:w-28 md:h-16 md:w-32 lg:h-20 lg:w-40"
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
            <h1 className="headline text-ink text-[clamp(2.2rem,5vw,4rem)]">
              Formations CACES® &amp; prévention des risques
            </h1>
            <p className="mt-6 text-gray text-base md:text-lg leading-relaxed max-w-xl">
              CACES® R489, R486, R482, habilitations électriques, AIPR,
              amiante SS4, SST... Plus de 14 formations certifiantes
              finançables CPF, OPCO et France Travail.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="btn hover:bg-primary-dark hover:border-primary-dark"
              >
                Obtenir un devis
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/calendrier"
                className="btn-outline text-ink hover:bg-ink hover:text-white"
              >
                Voir le calendrier
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
