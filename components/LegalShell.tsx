import { HeroNav } from "@/components/HeroNav";

type Props = {
  title: string;
  updated: string;
  children: React.ReactNode;
};

export function LegalShell({ title, updated, children }: Props) {
  return (
    <>
      <div className="bg-ink">
        <HeroNav />
      </div>
      <section className="container-x py-20 md:py-28 max-w-3xl">
        <p className="eyebrow">
          <span className="block w-10 h-px bg-primary" />
          Informations légales
        </p>
        <h1 className="mt-4 headline text-4xl md:text-5xl text-ink">
          {title}
        </h1>
        <p className="mt-3 text-xs uppercase tracking-[0.22em] text-gray font-mono">
          Dernière mise à jour&nbsp;: {updated}
        </p>
        <div className="mt-12 space-y-6 text-sm md:text-base text-dark/80 leading-relaxed normal-case [&_h2]:headline [&_h2]:text-2xl [&_h2]:text-ink [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-rule [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_a]:text-primary [&_a]:underline">
          {children}
        </div>
      </section>
    </>
  );
}
