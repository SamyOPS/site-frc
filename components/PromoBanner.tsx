/**
 * Bandeau de promotions défilant horizontalement, affiché en haut du hero.
 * Rendu uniquement s'il existe au moins une promotion active.
 */
export function PromoBanner({ promotions }: { promotions: string[] }) {
  if (!promotions || promotions.length === 0) return null;

  // On répète la liste pour qu'elle dépasse largement la largeur de l'écran,
  // puis on la duplique : l'animation translate de -50% (= exactement une copie)
  // donne une boucle continue, sans coupure ni trou, même avec une seule promo.
  const base: string[] = [];
  while (base.length < 12) base.push(...promotions);
  const loop = [...base, ...base];

  return (
    <div className="relative z-10 bg-ink text-white overflow-hidden">
      <div className="flex w-max animate-[marquee-x_120s_linear_infinite] motion-reduce:animate-none">
        {loop.map((promo, i) => (
          <span
            key={i}
            aria-hidden={i >= promotions.length ? true : undefined}
            className="flex items-center whitespace-nowrap px-8 py-3.5 text-sm md:text-base font-semibold uppercase tracking-wide"
          >
            <span aria-hidden="true" className="mr-4 text-primary">
              ★
            </span>
            {promo}
          </span>
        ))}
      </div>
    </div>
  );
}
