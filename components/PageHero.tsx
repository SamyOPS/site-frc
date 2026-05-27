import { HeroNav } from "@/components/HeroNav";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PageHero({ eyebrow, title, description }: Props) {
  return (
    <>
      <div className="bg-primary">
        <HeroNav />
      </div>

      <section className="container-x py-14 md:py-20 max-w-3xl">
        {eyebrow && (
          <div className="flex items-center gap-3">
            <span className="block w-10 h-px bg-primary" />
            <span className="eyebrow">{eyebrow}</span>
          </div>
        )}
        <h1 className="mt-4 headline text-ink text-[clamp(2.2rem,5vw,3.8rem)]">
          {title}
        </h1>
        {description && (
          <p className="mt-5 text-base md:text-lg text-gray max-w-2xl normal-case">
            {description}
          </p>
        )}
      </section>
    </>
  );
}