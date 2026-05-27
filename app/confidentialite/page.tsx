import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalShell";
import { company } from "@/lib/data";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de protection des données personnelles de FRC Technique conformément au RGPD.",
};

export default function ConfidentialitePage() {
  return (
    <LegalShell title="Politique de confidentialité" updated="26 mai 2026">
      <h2>Responsable du traitement</h2>
      <p>
        {company.name} ({company.legalForm}) est responsable du traitement des
        données collectées via son site et ses formulaires.
      </p>

      <h2>Données collectées</h2>
      <ul>
        <li>Nom, prénom, email, téléphone</li>
        <li>Coordonnées professionnelles (entreprise, fonction)</li>
        <li>Informations relatives à votre projet de formation</li>
      </ul>

      <h2>Finalités</h2>
      <p>
        Les données sont collectées pour répondre à vos demandes
        d&apos;information, établir un devis, organiser une session de
        formation et assurer le suivi administratif.
      </p>

      <h2>Durée de conservation</h2>
      <p>
        Les données sont conservées pendant la durée de la relation
        commerciale, puis archivées dans le respect des obligations légales
        applicables (notamment fiscales et de formation professionnelle).
      </p>

      <h2>Vos droits</h2>
      <p>
        Conformément au RGPD et à la loi Informatique et Libertés, vous
        disposez d&apos;un droit d&apos;accès, de rectification,
        d&apos;effacement, de limitation, de portabilité et d&apos;opposition.
        Pour exercer ces droits, contactez-nous à{" "}
        <a href={`mailto:${company.email}`}>{company.email}</a>.
      </p>

      <h2>Cookies</h2>
      <p>
        Le site utilise uniquement des cookies techniques nécessaires à son
        bon fonctionnement. Aucun cookie publicitaire ou de mesure
        d&apos;audience tiers n&apos;est déposé sans votre consentement
        préalable.
      </p>

      <h2>Réclamation</h2>
      <p>
        Si vous estimez, après nous avoir contactés, que vos droits ne sont
        pas respectés, vous pouvez adresser une réclamation à la CNIL
        (www.cnil.fr).
      </p>
    </LegalShell>
  );
}
