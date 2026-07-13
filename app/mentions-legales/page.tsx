import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalShell";
import { company } from "@/lib/data";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site www.frc-technique.com — éditeur, hébergement, propriété intellectuelle.",
};

export default function MentionsLegalesPage() {
  return (
    <LegalShell title="Mentions légales" updated="26 mai 2026">
      <h2>Éditeur</h2>
      <p>
        {company.name} — {company.legalForm}.<br />
        Siège social&nbsp;: {company.address}.<br />
        SIREN&nbsp;: {company.siren} · Code NAF&nbsp;: {company.naf}.<br />
        Créée le {company.created}.<br />
        Directeur de la publication&nbsp;: {company.director}.<br />
        Contact&nbsp;: <a href={`mailto:${company.email}`}>{company.email}</a>
      </p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par OVH SAS — 2 rue Kellermann, 59100 Roubaix,
        France.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus présents sur ce site (textes, images,
        logos, vidéos) est protégé par le droit d&apos;auteur et reste la
        propriété exclusive de {company.name} ou de ses partenaires. Toute
        reproduction sans autorisation préalable est interdite.
      </p>

      <h2>Certification Qualiopi</h2>
      <p>
        {company.name} est certifié Qualiopi au titre de la catégorie
        d&apos;action « Actions de formation ». Cette certification a été
        délivrée en application des dispositions du décret n° 2019-565 du 6
        juin 2019 relatif au référentiel national qualité.
      </p>
      <p>
        Le certificat est consultable à tout moment&nbsp;:{" "}
        <a href="/certificat-qualiopi.pdf" target="_blank" rel="noopener noreferrer">
          télécharger le certificat Qualiopi (PDF)
        </a>
        .
      </p>

      <h2>Crédits</h2>
      <p>Conception et développement&nbsp;: équipe FRC Technique. Photographies&nbsp;: Unsplash.</p>
    </LegalShell>
  );
}
