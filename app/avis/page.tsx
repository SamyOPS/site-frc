import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ReviewForm } from "@/components/ReviewForm";

export const metadata: Metadata = {
  title: "Laisser un avis — FRC Technique",
  description:
    "Vous avez suivi une formation CACES® ou prévention avec FRC Technique ? Partagez votre expérience en quelques secondes.",
};

export default function AvisPage() {
  return (
    <>
      <PageHero
        eyebrow="Votre avis"
        title="Partagez votre expérience"
        description="Vous avez suivi une formation avec FRC Technique ? Votre retour nous aide à progresser et guide les futurs stagiaires. Il sera publié après validation par notre équipe."
      />

      <section className="container-x pb-24 md:pb-28">
        <div className="max-w-2xl border border-rule bg-white p-8 md:p-10">
          <ReviewForm />
        </div>
      </section>
    </>
  );
}
