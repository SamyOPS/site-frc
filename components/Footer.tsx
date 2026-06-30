import Image from "next/image";
import Link from "next/link";
import { company, formations } from "@/lib/data";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-white/65 mt-24 border-t border-white/10">
      <div className="container-x py-20 grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.8fr_1.1fr]">
        <div>
          <Link href="/" className="inline-flex items-center" aria-label="Accueil FRC Technique">
            <Image
              src="/new logo frc.png"
              alt="FRC Technique — Centre de formation"
              width={760}
              height={370}
              className="h-28 md:h-32 w-auto invert mix-blend-screen"
            />
          </Link>
          <p className="mt-6 text-sm leading-relaxed text-white/55 max-w-sm normal-case">
            Organisme de formation certifié Qualiopi pour les actions de
            formation, spécialisé dans les formations CACES® et la prévention
            des risques. Basés à Montataire (60), nous intervenons partout en
            France.
          </p>
          <p className="mt-5 text-[10px] uppercase tracking-[0.28em] text-primary font-medium">
            Qualiopi · CPF · OPCO · France Travail
          </p>
          <a
            href="/certificat-qualiopi.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-xs text-white/70 hover:text-primary transition-colors normal-case"
          >
            <span aria-hidden="true">↓</span> Consulter notre certificat
            Qualiopi (PDF)
          </a>
          <a
            href="/certificat-caces.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 text-xs text-white/70 hover:text-primary transition-colors normal-case"
          >
            <span aria-hidden="true">↓</span> Consulter notre certificat
            CACES® (PDF)
          </a>
        </div>

        <div>
          <h4 className="text-[11px] uppercase tracking-[0.26em] text-white font-medium mb-5">
            Navigation
          </h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/" className="hover:text-primary transition-colors">Accueil</Link></li>
            <li><Link href="/qui-sommes-nous" className="hover:text-primary transition-colors">Qui sommes-nous&nbsp;?</Link></li>
            <li><Link href="/calendrier" className="hover:text-primary transition-colors">Calendrier</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] uppercase tracking-[0.26em] text-white font-medium mb-5">
            Formations
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
            {formations.map((f) => (
              <li key={f.slug}>
                <Link
                  href={`/formations/${f.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {f.code ? `CACES® ${f.code}` : f.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] uppercase tracking-[0.26em] text-white font-medium mb-5">
            Contact
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href={`mailto:${company.email}`}
                className="hover:text-primary transition-colors break-all"
              >
                {company.email}
              </a>
            </li>
            <li>{company.address}</li>
            <li>{company.hours}</li>
          </ul>
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs uppercase tracking-wider">
            <li><Link href="/mentions-legales" className="hover:text-primary transition-colors">Mentions légales</Link></li>
            <li><Link href="/cgv" className="hover:text-primary transition-colors">CGV</Link></li>
            <li><Link href="/confidentialite" className="hover:text-primary transition-colors">Confidentialité</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x py-6 text-[11px] uppercase tracking-[0.2em] text-white/45">
          <p>© {year} {company.name} — Tous droits réservés</p>
        </div>
      </div>
    </footer>
  );
}
