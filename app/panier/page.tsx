import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PanierClient } from "./PanierClient";

export const metadata: Metadata = {
  title: "Mon panier — Demande de devis",
  description:
    "Récapitulatif des formations FRC Technique sélectionnées pour votre demande de devis.",
};

export default function PanierPage() {
  return (
    <>
      <PageHero
        eyebrow="Demande de devis"
        title="Mon panier"
        description="Récapitulez les formations sélectionnées, indiquez vos coordonnées et envoyez votre demande de devis à FRC Technique."
      />

      <section className="container-x py-12 md:py-20">
        <PanierClient />
      </section>
    </>
  );
}
