import Link from "next/link";
import { HeroNav } from "@/components/HeroNav";

export default function NotFound() {
  return (
    <>
      <div className="bg-ink">
        <HeroNav />
      </div>
      <section className="container-x py-24 md:py-32 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-primary">
          [ Erreur 404 ]
        </p>
        <h1 className="mt-4 headline text-6xl md:text-8xl text-ink">
          Page introuvable
        </h1>
        <p className="mt-6 text-gray max-w-md mx-auto normal-case">
          Cette page n&apos;existe pas ou a été déplacée. Retrouvez tout notre
          catalogue de formations depuis l&apos;accueil.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="btn hover:bg-primary-dark hover:border-primary-dark"
          >
            Retour à l&apos;accueil
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/contact"
            className="btn-outline text-ink hover:bg-ink hover:text-white"
          >
            Nous contacter
          </Link>
        </div>
      </section>
    </>
  );
}
