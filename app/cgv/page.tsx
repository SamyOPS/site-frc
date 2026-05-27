import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalShell";
import { company } from "@/lib/data";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description:
    "CGV de FRC Technique — inscriptions, financements, modalités d'annulation et de paiement.",
};

export default function CGVPage() {
  return (
    <LegalShell title="Conditions générales de vente" updated="26 mai 2026">
      <h2>Objet</h2>
      <p>
        Les présentes conditions générales s&apos;appliquent à toutes les
        prestations de formation professionnelle dispensées par {company.name}
        auprès de ses clients (particuliers ou entreprises).
      </p>

      <h2>Inscription et convention</h2>
      <p>
        Toute inscription donne lieu à l&apos;établissement d&apos;une
        convention de formation professionnelle continue (article L.6353-1 du
        Code du travail) ou d&apos;un contrat de formation pour les
        particuliers.
      </p>

      <h2>Financement</h2>
      <ul>
        <li>CPF (Compte Personnel de Formation) via Mon Compte Formation</li>
        <li>OPCO de l&apos;entreprise pour les salariés</li>
        <li>France Travail (AIF, CSP) pour les demandeurs d&apos;emploi</li>
        <li>Financement personnel ou entreprise</li>
      </ul>

      <h2>Tarifs et conditions de paiement</h2>
      <p>
        Les tarifs sont indiqués hors taxes sur le devis. Le paiement
        s&apos;effectue à 30 jours date de facture, sauf accord particulier ou
        prise en charge directe par un organisme financeur.
      </p>

      <h2>Annulation et report</h2>
      <p>
        Toute annulation par le client doit être notifiée par écrit. En cas
        d&apos;annulation moins de 10 jours ouvrés avant le début de la
        session&nbsp;:
      </p>
      <ul>
        <li>50% du coût pédagogique sera facturé entre 10 et 5 jours ouvrés</li>
        <li>100% du coût pédagogique sera facturé à moins de 5 jours ouvrés</li>
      </ul>
      <p>
        {company.name} se réserve le droit de reporter une session pour
        insuffisance d&apos;inscrits ou cas de force majeure.
      </p>

      <h2>Réclamations</h2>
      <p>
        Toute réclamation peut être adressée à{" "}
        <a href={`mailto:${company.email}`}>{company.email}</a>. Une réponse
        sera apportée dans un délai maximal de 15 jours ouvrés.
      </p>

      <h2>Droit applicable</h2>
      <p>
        Les présentes CGV sont régies par le droit français. À défaut
        d&apos;accord amiable, tout litige sera porté devant les tribunaux
        compétents du ressort du siège social de {company.name}.
      </p>
    </LegalShell>
  );
}
