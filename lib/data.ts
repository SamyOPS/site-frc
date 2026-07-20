import type { StaticImageData } from "next/image";
import machineR489 from "@/public/machine/CASESR489-CEYMC3bi.png";
import machineR486 from "@/public/machine/cacesr486.png";
import machineR482 from "@/public/machine/cacesr482.png";
import imgSst from "@/public/autre_formation/sst.png";
import imgTravailHauteur from "@/public/autre_formation/travail-en-hauteur.png";
import imgHarnais from "@/public/autre_formation/port-du-harnais.png";
import imgSecuriteIncendie from "@/public/autre_formation/securite-incendie.png";
import imgHabilitations from "@/public/autre_formation/habilitations-electriques.png";
import imgAipr from "@/public/autre_formation/aipr.png";
import imgEchafaudageRoulant from "@/public/autre_formation/echafaudage-roulant.png";
import imgEchafaudageFixe from "@/public/autre_formation/echafaudage-fixe.png";
import imgAmiante from "@/public/autre_formation/amiante-ss4.png";
import imgPlomb from "@/public/autre_formation/plomb.png";
import imgSecufer from "@/public/autre_formation/secufer.png";
import processEvaluation from "@/public/processus/evaluation.png";
import processInscription from "@/public/processus/inscirption.png";
import processFormation from "@/public/processus/formation.png";
import processCertification from "@/public/processus/certification.png";

export type FormationCategory = "caces" | "sante" | "prevention";

export type CategoryDetail = { code: string; label: string };

export type Formation = {
  slug: string;
  category: FormationCategory;
  code?: string;
  title: string;
  subtitle?: string;
  description: string;
  duration?: string;
  validity?: string;
  funding?: string;
  priceFrom?: number;
  image?: StaticImageData;
  details?: string[];
  /** Texte d'explication approfondie de la formation */
  presentation?: string;
  /** Détail des catégories / niveaux couverts */
  categoriesDetail?: CategoryDetail[];
  /** Métiers et débouchés que la formation ouvre */
  careers?: string[];
  /** Informations sur le certificat délivré et sa validité */
  certificationInfo?: string;
};

export const formations: Formation[] = [
  // CACES
  {
    slug: "caces-r489",
    category: "caces",
    code: "R489",
    title: "Chariots élévateurs",
    subtitle: "Catégories 1A · 1B · 2B · 3 · 5 · 6",
    description:
      "Conduite en sécurité des chariots automoteurs à conducteur porté.",
    duration: "2 à 4 jours",
    validity: "5 ans",
    funding: "CPF · OPCO · France Travail",
    priceFrom: 459,
    image: machineR489,
    details: [
      "Module théorique : réglementation, technologie des chariots, vérifications préalables",
      "Module pratique : prise en main, manœuvres, gerbage, transport de charge",
      "Tests CACES selon le référentiel CNAM (théorique + pratique par catégorie)",
      "Remise du certificat valable 5 ans après réussite",
    ],
    presentation:
      "Le CACES® R489 atteste de la capacité à conduire en sécurité les chariots élévateurs à conducteur porté. Délivré selon la recommandation R489 de la CNAM, il permet à l'employeur de remettre une autorisation de conduite, obligatoire au titre du Code du travail pour tout opérateur amené à manipuler ces engins.",
    categoriesDetail: [
      { code: "1A", label: "Transpalettes et préparateurs de commandes au sol (levée ≤ 1,20 m)" },
      { code: "1B", label: "Préparateurs de commandes au sol (levée > 1,20 m)" },
      { code: "2B", label: "Chariots tracteurs et à plateau porteur (capacité < 25 t)" },
      { code: "3", label: "Chariots élévateurs frontaux en porte-à-faux (capacité ≤ 6 t)" },
      { code: "5", label: "Chariots élévateurs à mât rétractable" },
      { code: "6", label: "Chariots élévateurs à poste de conduite élevable" },
    ],
    careers: [
      "Cariste",
      "Préparateur de commandes",
      "Magasinier",
      "Agent logistique / manutentionnaire",
      "Opérateur d'entrepôt",
    ],
    certificationInfo:
      "Après réussite aux tests théoriques et pratiques, le CACES® R489 est délivré pour chaque catégorie validée. Sa durée de validité est de 5 ans : un recyclage est nécessaire avant l'échéance pour le conserver.",
  },
  {
    slug: "caces-r486",
    category: "caces",
    code: "R486",
    title: "Nacelles (PEMP)",
    subtitle: "Catégories A · B",
    description:
      "Conduite en sécurité des plateformes élévatrices mobiles de personnel.",
    duration: "2 à 4 jours",
    validity: "5 ans",
    funding: "CPF · OPCO · France Travail",
    priceFrom: 629,
    image: machineR486,
    details: [
      "Réglementation et responsabilités du conducteur",
      "Technologie et caractéristiques des PEMP catégories A et B",
      "Manœuvres en situation : élévation, déplacement, procédures de secours",
      "Évaluation CACES R486 (théorique + pratique)",
    ],
    presentation:
      "Le CACES® R486 valide la conduite en sécurité des plateformes élévatrices mobiles de personnel (PEMP), couramment appelées nacelles. Conforme à la recommandation R486 de la CNAM, il est indispensable pour réaliser des travaux en hauteur depuis ce type d'équipement.",
    categoriesDetail: [
      { code: "A", label: "PEMP à élévation verticale (type ciseaux), déplacement en position repliée" },
      { code: "B", label: "PEMP à élévation multidirectionnelle (bras articulé ou télescopique)" },
    ],
    careers: [
      "Technicien de maintenance",
      "Électricien",
      "Peintre / façadier",
      "Élagueur",
      "Monteur-installateur",
    ],
    certificationInfo:
      "Le CACES® R486 est délivré par catégorie (A et/ou B) après évaluation. Il est valable 5 ans et doit être renouvelé par un recyclage avant son échéance.",
  },
  {
    slug: "caces-r482",
    category: "caces",
    code: "R482",
    title: "Engins de chantier",
    subtitle: "Catégories A · B1 · C1 · F",
    description:
      "Conduite en sécurité des engins de chantier — mini-pelle, chargeuse, compacteur, chariot tout-terrain.",
    duration: "3 à 6 jours",
    validity: "10 ans",
    funding: "CPF · OPCO · France Travail",
    priceFrom: 759,
    image: machineR482,
    details: [
      "Théorie : sécurité, technologie des engins, vérifications préalables",
      "Pratique : conduite sur site, terrassement, manutention",
      "Connaissance des règles d'exploitation et de circulation",
      "Évaluation CACES selon la recommandation R482 (validité 10 ans)",
    ],
    presentation:
      "Le CACES® R482 atteste de la conduite en sécurité des engins de chantier utilisés dans les travaux publics et le BTP. Encadré par la recommandation R482 de la CNAM, il couvre les engins de terrassement, de chargement et de manutention tout-terrain.",
    categoriesDetail: [
      { code: "A", label: "Engins compacts (< 6 t)" },
      { code: "B1", label: "Engins d'extraction à déplacement séquentiel (pelles hydrauliques…)" },
      { code: "C1", label: "Engins de chargement à déplacement alternatif (chargeuses, chargeuses-pelleteuses)" },
      { code: "F", label: "Chariots de manutention tout-terrain (télescopiques)" },
    ],
    careers: [
      "Conducteur d'engins de chantier",
      "Conducteur de travaux publics",
      "Terrassier",
      "Ouvrier du BTP",
      "Opérateur de carrière",
    ],
    certificationInfo:
      "Le CACES® R482 est délivré par catégorie après réussite aux épreuves. Particularité notable : sa validité est de 10 ans, contre 5 ans pour la plupart des autres CACES®.",
  },

  // Santé & sécurité
  {
    slug: "sst",
    category: "sante",
    title: "Sauveteur Secouriste du Travail (SST)",
    description:
      "Formation aux gestes qui sauvent en milieu professionnel — prévention et secours en entreprise.",
    duration: "14 heures (2 jours)",
    validity: "24 mois — maintien des acquis annuel",
    funding: "CPF · OPCO",
    image: imgSst,
    details: [
      "Prévention des risques professionnels",
      "Conduite à tenir face à un accident du travail",
      "Gestes de secours : protection, alerte, examen, secours",
      "Évaluation continue + certificat SST INRS",
    ],
    presentation:
      "La formation Sauveteur Secouriste du Travail (SST) prépare les salariés à intervenir efficacement face à une situation d'accident, mais aussi à participer à la prévention des risques dans leur entreprise. Le programme est défini par le référentiel de l'INRS et du réseau Assurance Maladie Risques Professionnels.",
    careers: [
      "Référent secourisme en entreprise",
      "Agent de production / logistique formé SST",
      "Membre du CSE / référent prévention",
      "Tout salarié en environnement à risques",
    ],
    certificationInfo:
      "Le certificat SST est délivré par l'INRS après évaluation. Il est valable 24 mois ; un recyclage « MAC SST » (Maintien et Actualisation des Compétences) est nécessaire avant l'échéance pour le conserver.",
  },
  {
    slug: "travail-en-hauteur",
    category: "sante",
    title: "Travail en hauteur",
    description:
      "Prévention des risques liés au travail en hauteur et utilisation des équipements de protection.",
    funding: "OPCO · France Travail",
    image: imgTravailHauteur,
    details: [
      "Réglementation et obligations employeur / salarié",
      "Identification des risques de chute",
      "Mise en œuvre des protections collectives et individuelles",
    ],
    presentation:
      "Les chutes de hauteur sont l'une des premières causes d'accidents graves au travail. Cette formation sensibilise aux risques et apprend à travailler en hauteur en sécurité, dans le respect de la réglementation et avec les équipements de protection adaptés.",
    careers: [
      "Couvreur / charpentier",
      "Technicien de maintenance",
      "Monteur d'échafaudage",
      "Agent d'entretien de bâtiments",
    ],
    certificationInfo:
      "Une attestation de formation est délivrée à l'issue de la session. Un recyclage périodique est recommandé pour maintenir le niveau de compétence et de sécurité.",
  },
  {
    slug: "port-du-harnais",
    category: "sante",
    title: "Port du harnais antichute",
    description:
      "Utilisation, vérification et entretien du harnais antichute en milieu professionnel.",
    funding: "OPCO · France Travail",
    image: imgHarnais,
    details: [
      "Types de harnais et systèmes d'arrêt de chute",
      "Vérifications préalables avant utilisation",
      "Mise en place et ajustement",
      "Procédures de secours et plan d'évacuation",
    ],
    presentation:
      "Le harnais antichute est un équipement de protection individuelle (EPI) dont l'usage requiert une formation spécifique. Cette session apprend à choisir, vérifier, porter et entretenir un harnais, ainsi qu'à réagir en cas de chute.",
    careers: [
      "Technicien intervenant en hauteur",
      "Monteur / installateur",
      "Élagueur",
      "Agent de maintenance industrielle",
    ],
    certificationInfo:
      "Une attestation de formation au port du harnais est délivrée. Un recyclage régulier est conseillé, en particulier en cas d'évolution du matériel ou des conditions d'intervention.",
  },
  {
    slug: "securite-incendie",
    category: "sante",
    title: "Sécurité incendie",
    subtitle: "Manipulation des extincteurs",
    description:
      "Manipulation des extincteurs et conduite à tenir en cas de départ de feu.",
    funding: "OPCO · France Travail",
    image: imgSecuriteIncendie,
    details: [
      "Théorie : naissance et propagation du feu, classes de feu",
      "Connaissance des extincteurs et de leur utilisation",
      "Mise en pratique sur feu réel (bac à feu)",
    ],
    presentation:
      "Tout établissement doit former son personnel à la conduite à tenir en cas d'incendie. Cette formation apprend à reconnaître un départ de feu, à donner l'alerte et à utiliser un extincteur adapté, avec une mise en pratique sur feu réel.",
    careers: [
      "Équipier de première intervention (EPI)",
      "Guide-file / serre-file",
      "Agent d'accueil et de sécurité",
      "Tout salarié d'un établissement recevant du public",
    ],
    certificationInfo:
      "Une attestation de formation est délivrée. Un recyclage annuel est recommandé pour maintenir les réflexes et tenir compte de l'évolution des locaux et des équipements.",
  },

  // Prévention des risques
  {
    slug: "habilitations-electriques",
    category: "prevention",
    title: "Habilitations électriques",
    subtitle: "Tous niveaux",
    description:
      "Habilitations B0, B1V, B2V, BR, BC, H0... pour tous types d'intervention en environnement électrique.",
    funding: "OPCO · France Travail",
    image: imgHabilitations,
    details: [
      "Théorie : effets du courant, distances de sécurité, EPI",
      "Procédures de consignation et de mise hors tension",
      "Pratique adaptée au niveau d'habilitation visé",
      "Avis d'habilitation délivré à l'employeur après évaluation",
    ],
    presentation:
      "L'habilitation électrique est obligatoire (norme NF C 18-510) pour tout salarié réalisant des opérations sur ou à proximité d'installations électriques. Le niveau d'habilitation est adapté à la nature des travaux (non électriciens, électriciens, consignation, etc.).",
    categoriesDetail: [
      { code: "B0 / H0 / H0V", label: "Personnel non électricien travaillant à proximité (BT et HT)" },
      { code: "B1 / B1V", label: "Exécutant électricien en basse tension" },
      { code: "B2 / B2V", label: "Chargé de travaux en basse tension" },
      { code: "BR", label: "Chargé d'intervention générale BT (dépannage, mesurage)" },
      { code: "BC", label: "Chargé de consignation en basse tension" },
    ],
    careers: [
      "Électricien du bâtiment / industriel",
      "Technicien de maintenance",
      "Plombier-chauffagiste intervenant près d'installations",
      "Agent de maintenance polyvalent",
    ],
    certificationInfo:
      "À l'issue de la formation, un titre d'habilitation est proposé à l'employeur, qui le délivre formellement. Un recyclage est recommandé tous les 3 ans.",
  },
  {
    slug: "aipr",
    category: "prevention",
    title: "A.I.P.R.",
    subtitle: "Tous niveaux — Concepteur · Encadrant · Opérateur",
    description:
      "Autorisation d'Intervention à Proximité des Réseaux — formation et examen QCM officiel.",
    funding: "OPCO · France Travail",
    image: imgAipr,
    details: [
      "Réglementation DT-DICT, marquage piquetage",
      "Identification des réseaux et risques associés",
      "Conduite à tenir en cas d'anomalie ou d'incident",
      "Examen QCM officiel via la plateforme MTES",
    ],
    presentation:
      "L'AIPR (Autorisation d'Intervention à Proximité des Réseaux) est exigée pour tous les travaux réalisés à proximité de réseaux enterrés ou aériens. Elle vise à prévenir les endommagements de réseaux et les accidents associés (réforme « anti-endommagement »).",
    categoriesDetail: [
      { code: "Concepteur", label: "Personnel en charge de la préparation et du suivi des projets de travaux" },
      { code: "Encadrant", label: "Responsable de chantier encadrant les travaux" },
      { code: "Opérateur", label: "Personnel conduisant des engins ou réalisant des travaux" },
    ],
    careers: [
      "Conducteur d'engins de chantier",
      "Chef de chantier / conducteur de travaux",
      "Projeteur / technicien bureau d'études",
      "Ouvrier TP / VRD",
    ],
    certificationInfo:
      "L'AIPR est délivrée par l'employeur sur la base de la réussite à un examen QCM officiel (plateforme du ministère). Sa durée de validité est de 5 ans.",
  },
  {
    slug: "echafaudage-roulant",
    category: "prevention",
    title: "Échafaudage roulant",
    description:
      "Montage, démontage et utilisation en sécurité des échafaudages roulants (R457).",
    funding: "OPCO · France Travail",
    image: imgEchafaudageRoulant,
    details: [
      "Réglementation et responsabilités",
      "Montage / démontage sécurisé",
      "Vérification avant utilisation et déplacement",
    ],
    presentation:
      "Cette formation, basée sur la recommandation R457, apprend à monter, utiliser et démonter en sécurité un échafaudage roulant. Elle s'adresse aux personnels amenés à travailler sur ce type de structure mobile.",
    careers: [
      "Peintre en bâtiment",
      "Plaquiste / plâtrier",
      "Électricien / plombier en chantier",
      "Agent de maintenance",
    ],
    certificationInfo:
      "Une attestation de formation (montage / utilisation / démontage) est délivrée après évaluation. Un recyclage est recommandé tous les 5 ans.",
  },
  {
    slug: "echafaudage-fixe",
    category: "prevention",
    title: "Échafaudage fixe",
    description:
      "Montage, démontage et utilisation en sécurité des échafaudages fixes (R408).",
    funding: "OPCO · France Travail",
    image: imgEchafaudageFixe,
    details: [
      "Réglementation et responsabilités",
      "Montage / démontage sécurisé selon notice constructeur",
      "Réception et vérifications périodiques",
    ],
    presentation:
      "La recommandation R408 encadre le montage, l'utilisation et le démontage des échafaudages de pied (fixes). Cette formation forme les monteurs et utilisateurs aux bonnes pratiques et aux vérifications réglementaires.",
    careers: [
      "Monteur d'échafaudages",
      "Maçon / façadier",
      "Couvreur",
      "Technicien du BTP",
    ],
    certificationInfo:
      "Une attestation de formation est délivrée par compétence (montage, utilisation, réception). Un recyclage est recommandé tous les 5 ans.",
  },
  {
    slug: "amiante-ss4",
    category: "prevention",
    title: "Amiante sous-section 4",
    subtitle: "Tous niveaux — Opérateur · Encadrant",
    description:
      "Formation aux interventions sur matériaux susceptibles d'émettre des fibres d'amiante (sous-section 4).",
    funding: "OPCO · France Travail",
    image: imgAmiante,
    details: [
      "Réglementation amiante (Code du travail)",
      "Identification des matériaux et risques",
      "Mise en œuvre des protections collectives et individuelles",
      "Procédures de décontamination",
    ],
    presentation:
      "La formation amiante sous-section 4 (SS4) est obligatoire pour les travailleurs réalisant des interventions sur des matériaux susceptibles de libérer des fibres d'amiante (maintenance, entretien). Elle est encadrée par le Code du travail (arrêté du 23 février 2012).",
    categoriesDetail: [
      { code: "Opérateur", label: "Personnel exécutant les interventions sur matériaux amiantés" },
      { code: "Encadrant technique", label: "Responsable de la préparation et du suivi technique" },
      { code: "Encadrant de chantier", label: "Responsable de la conduite des travaux sur site" },
    ],
    careers: [
      "Plombier-chauffagiste",
      "Électricien du bâtiment",
      "Agent de maintenance",
      "Couvreur / étancheur",
    ],
    certificationInfo:
      "Une attestation de compétence est délivrée à l'issue de la formation préalable. Un recyclage est obligatoire tous les 3 ans pour continuer à intervenir.",
  },
  {
    slug: "plomb",
    category: "prevention",
    title: "Plomb — Risques sanitaires",
    description:
      "Prévention des risques sanitaires liés à l'exposition au plomb dans le BTP.",
    funding: "OPCO · France Travail",
    image: imgPlomb,
    details: [
      "Effets du plomb sur la santé",
      "Identification des matériaux contenant du plomb",
      "Mesures de prévention et de protection",
    ],
    presentation:
      "Le plomb, présent notamment dans les peintures et canalisations anciennes, présente un risque sanitaire avéré (saturnisme). Cette formation sensibilise aux risques d'exposition et aux mesures de prévention lors d'interventions sur le bâti ancien.",
    careers: [
      "Peintre en rénovation",
      "Plombier",
      "Maçon / ravaleur",
      "Agent de réhabilitation du bâti ancien",
    ],
    certificationInfo:
      "Une attestation de formation est délivrée. Une actualisation des connaissances est recommandée en fonction de l'évolution de la réglementation.",
  },
  {
    slug: "secufer",
    category: "prevention",
    title: "Secufer — Sécurité ferroviaire",
    description:
      "Sécurité du personnel intervenant sur le réseau ferroviaire (SNCF Réseau).",
    funding: "OPCO · France Travail",
    image: imgSecufer,
    details: [
      "Réglementation ferroviaire et règles de sécurité",
      "Identification des risques liés aux circulations",
      "Procédures d'évacuation et de protection",
    ],
    presentation:
      "La formation Secufer prépare les intervenants à travailler en sécurité dans l'environnement ferroviaire, où les risques liés aux circulations de trains et aux installations sont spécifiques. Elle est exigée pour les chantiers à proximité ou sur les voies.",
    careers: [
      "Ouvrier de chantier ferroviaire",
      "Technicien de maintenance des voies",
      "Conducteur d'engins sur emprise ferroviaire",
      "Agent de sécurité du personnel (ASP)",
    ],
    certificationInfo:
      "Une attestation de formation à la sécurité ferroviaire est délivrée. Sa validité dépend des exigences du donneur d'ordre (SNCF Réseau) et nécessite un recyclage périodique.",
  },
];

// Backwards-compat: derived exports
export type CacesFormation = Formation & { code: string; image: StaticImageData };
export const cacesFormations: CacesFormation[] = formations.filter(
  (f): f is CacesFormation => f.category === "caces" && !!f.code && !!f.image
);

export const santeSecuriteFormations = formations
  .filter((f) => f.category === "sante")
  .map((f) => (f.subtitle ? `${f.title} — ${f.subtitle}` : f.title));

export const preventionRisquesFormations = formations
  .filter((f) => f.category === "prevention")
  .map((f) => (f.subtitle ? `${f.title} — ${f.subtitle}` : f.title));

export type Stat = { value: string; label: string };
export const stats: Stat[] = [
  { value: "99,2%", label: "Taux de réussite" },
  { value: "510", label: "Tests réalisés" },
  { value: "506", label: "CACES délivrés" },
  { value: "14", label: "Formations" },
];

// Détail des résultats par catégorie de CACES (données réelles FRC Technique).
export type CacesStat = {
  code: string;
  successRate: string;
  failRate: string;
  delivered: number;
};
export const cacesStats: CacesStat[] = [
  { code: "R489", successRate: "99,04 %", failRate: "0,96 %", delivered: 412 },
  { code: "R486", successRate: "100 %", failRate: "0 %", delivered: 36 },
  { code: "R482", successRate: "100 %", failRate: "0 %", delivered: 58 },
];

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
  image: StaticImageData;
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Évaluation",
    description:
      "Analyse de vos besoins, audit des compétences et choix de la formation adaptée.",
    image: processEvaluation,
  },
  {
    number: "02",
    title: "Inscription",
    description:
      "Devis personnalisé, montage du dossier de financement (CPF, OPCO, France Travail).",
    image: processInscription,
  },
  {
    number: "03",
    title: "Formation",
    description:
      "Théorie et pratique encadrées par nos formateurs qualifiés et expérimentés.",
    image: processFormation,
  },
  {
    number: "04",
    title: "Certification",
    description:
      "Passage des épreuves CACES®, remise du certificat et suivi post-formation.",
    image: processCertification,
  },
];

export type Testimonial = {
  name: string;
  quote: string;
  /** Note de 1 à 5 étoiles (absente pour les témoignages historiques). */
  rating?: number;
};

export const testimonials: Testimonial[] = [
  {
    name: "Anonyme",
    quote:
      "Centre de formation au top ! L'accueil est chaleureux, les salles sont bien équipées et les formations sont de grande qualité. Les formateurs maîtrisent parfaitement leur domaine et savent transmettre leurs connaissances avec patience et bienveillance. Grâce à eux, j'ai pu gagner en compétences et en confiance. Merci pour cette belle expérience !",
  },
  {
    name: "Remzi Karaer",
    quote:
      "Centre de formation très enrichissant ! Le contenu est clair, les exercices pratiques et théoriques sont pertinents et les formateurs sont vraiment impliqués dans la réussite des participants. L'organisation est impeccable et l'ambiance très agréable. Je recommande fortement ce centre pour toute personne souhaitant évoluer professionnellement et obtenir son CACES. Merci à toute l'équipe de FRC Technique.",
  },
  {
    name: "Naïm Daoudi",
    quote:
      "J'ai passé mon CACES R489 catégories 1, 3 et 5 sans aucune expérience de conduite, avec Hakim comme formateur. Excellent formateur, très pédagogue et qui sait s'adapter au niveau de chacun. Ambiance conviviale qui rend l'apprentissage encore plus agréable. Je recommande vivement ce centre de formation à tous ceux qui souhaitent passer leur CACES dans les meilleures conditions.",
  },
  {
    name: "Anonyme",
    quote:
      "J'ai passé une formation CACES dans ce centre et je recommande fortement. Tout est très bien expliqué, ils respectent l'expérience de tout le monde et sont là pour nous aider à évoluer. Rien à dire !",
  },
  {
    name: "Mel Clery",
    quote:
      "J'ai passé mon CACES 1A-1B : bonne ambiance, manipulations, gerbage, parcours, théorie... Formateur à l'écoute qui met facilement à l'aise. Merci pour le professionnalisme !",
  },
];

export type FaqItem = { question: string; answer: string };

export const faq: FaqItem[] = [
  {
    question: "Comment financer ma formation CACES® ?",
    answer:
      "Plusieurs dispositifs sont mobilisables : CPF (Compte Personnel de Formation), OPCO pour les salariés, France Travail pour les demandeurs d'emploi, ou un financement personnel. Nous vous accompagnons sur le montage du dossier.",
  },
  {
    question: "Combien de temps dure une formation CACES® ?",
    answer:
      "La durée varie selon la catégorie : de 2 jours pour un R486 catégorie A à 6 jours pour une formation initiale R482 complète. Le programme s'adapte à votre expérience préalable.",
  },
  {
    question: "Quelle est la durée de validité du certificat ?",
    answer:
      "5 ans pour la R489 (chariots) et la R486 (nacelles), 10 ans pour la R482 (engins de chantier). Un recyclage est obligatoire avant expiration.",
  },
  {
    question: "Êtes-vous certifié Qualiopi ?",
    answer:
      "Oui, FRC Technique est certifié Qualiopi pour ses actions de formation. Cette certification garantit la qualité de nos process et l'éligibilité aux financements publics et mutualisés.",
  },
  {
    question: "Organisez-vous des sessions intra-entreprise ?",
    answer:
      "Oui, nous intervenons directement dans vos locaux ou sur vos sites, partout en France. Le programme et le calendrier sont co-construits avec votre référent formation.",
  },
  {
    question: "Comment se déroule l'inscription ?",
    answer:
      "Contactez-nous via le formulaire ou par téléphone. Nous étudions vos besoins, vous envoyons un devis personnalisé et accompagnons le dossier de financement jusqu'à la session.",
  },
];

export const company = {
  name: "FRC Technique",
  email: "formation@frc-technique.com",
  address: "4 av. de la Libération, 60160 Montataire",
  hours: "Lun-Ven 8h30-12h / 13h30-17h",
  siren: "880 704 754",
  legalForm: "SAS au capital de 50 000 €",
  created: "6 janvier 2020",
  naf: "85.59A",
  director: "Mickaël TROUSSELLE",
} as const;

export const engagements = [
  {
    title: "Qualité Qualiopi",
    description:
      "Process audités, indicateurs suivis, formateurs habilités. La qualité au cœur de chaque session.",
  },
  {
    title: "Pédagogie pratique",
    description:
      "70% du temps en pratique sur le terrain, sur du matériel professionnel récent.",
  },
  {
    title: "Accompagnement complet",
    description:
      "Du devis à la certification, nous gérons les dossiers de financement et le suivi administratif.",
  },
  {
    title: "Proximité",
    description:
      "Une équipe à taille humaine, joignable, qui s'adapte à vos contraintes opérationnelles.",
  },
];
