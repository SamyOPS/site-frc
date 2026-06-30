"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { CartButton } from "@/components/CartButton";
import { formations, type Formation } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";

import img1 from "@/public/frc/2023-12-13.webp";
import img2 from "@/public/frc/2024-07-18.webp";
import img3 from "@/public/frc/unnamed.webp";
import img4 from "@/public/frc/2022-10-22.webp";
import img5 from "@/public/frc/2024-01-20.webp";
import img6 from "@/public/frc/3w6a0433_52035903199_o.webp";
import img7 from "@/public/frc/2024-07-18 (1).webp";
import img8 from "@/public/frc/2023-12-13 (1).webp";
import img9 from "@/public/frc/unnamed (1).webp";
import img10 from "@/public/frc/unnamed (2).webp";

type DropdownItem = {
  primary: string;
  description?: string;
  secondary?: string;
  price?: string;
  image: StaticImageData;
  imageFit?: "cover" | "contain";
  href?: string;
  category?: Formation["category"];
};

type NavLinkItem = {
  label: string;
  labelMobile?: string;
  href?: string;
  dropdownItems?: DropdownItem[];
  compact?: boolean;
};

const fallbackImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];

function formationToDropdownItem(
  f: Formation,
  idx: number,
  priceMap: Record<string, number>
): DropdownItem {
  const isCaces = f.category === "caces";
  const price = priceMap[f.slug] ?? f.priceFrom;
  return {
    primary: isCaces ? `CACES® ${f.code}` : f.title,
    description: isCaces ? f.description : undefined,
    secondary: !isCaces ? f.subtitle : undefined,
    price: price != null ? `Dès ${price} €` : undefined,
    image: f.image ?? fallbackImages[idx % fallbackImages.length],
    imageFit: isCaces ? "contain" : "cover",
    href: `/formations/${f.slug}`,
    category: f.category,
  };
}

const aboutItems: DropdownItem[] = [
  {
    primary: "Qui sommes-nous ?",
    secondary: "FRC Technique · Montataire (60)",
    image: img6,
    href: "/qui-sommes-nous",
  },
  {
    primary: "Calendrier de formations",
    secondary: "Prochaines sessions",
    image: img5,
    href: "/calendrier",
  },
];

function buildLinks(priceMap: Record<string, number>): NavLinkItem[] {
  const cacesItems = formations
    .filter((f) => f.category === "caces")
    .map((f, i) => formationToDropdownItem(f, i, priceMap));
  const autresItems = formations
    .filter((f) => f.category !== "caces")
    .map((f, i) => formationToDropdownItem(f, i, priceMap));
  return [
    {
      label: "Formations CACES",
      labelMobile: "CACES",
      dropdownItems: cacesItems,
    },
    {
      label: "Formations santé, sécurité & prévention",
      labelMobile: "Santé & prévention",
      dropdownItems: autresItems,
    },
    { label: "À propos", dropdownItems: aboutItems, compact: true },
    { label: "Contact", href: "/contact" },
  ];
}

const linkClass =
  "relative inline-flex items-center gap-1.5 py-1 text-[10px] sm:text-[11px] lg:text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] font-medium transition-colors whitespace-nowrap";

function Chevron({ rotated }: { rotated: boolean }) {
  return (
    <svg
      className={`w-3 h-3 shrink-0 transition-transform duration-200 ${
        rotated ? "rotate-180" : ""
      }`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function useCategoryTabs(items: DropdownItem[]) {
  const [tab, setTab] = useState<"sante" | "prevention">("sante");
  const hasSante = items.some((i) => i.category === "sante");
  const hasPrevention = items.some((i) => i.category === "prevention");
  const hasTabs = hasSante && hasPrevention;
  const shown = hasTabs ? items.filter((i) => i.category === tab) : items;
  return { hasTabs, tab, setTab, shown };
}

function CategoryTabs({
  tab,
  setTab,
}: {
  tab: "sante" | "prevention";
  setTab: (t: "sante" | "prevention") => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Filtrer les autres formations"
      className="inline-flex border border-rule mb-8"
    >
      <button
        type="button"
        role="tab"
        aria-selected={tab === "sante"}
        onClick={() => setTab("sante")}
        className={`px-4 md:px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-medium transition-colors ${
          tab === "sante"
            ? "bg-ink text-white"
            : "bg-white text-ink hover:text-primary"
        }`}
      >
        Santé &amp; sécurité
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={tab === "prevention"}
        onClick={() => setTab("prevention")}
        className={`px-4 md:px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-medium transition-colors border-l border-rule ${
          tab === "prevention"
            ? "bg-ink text-white"
            : "bg-white text-ink hover:text-primary"
        }`}
      >
        Prévention des risques
      </button>
    </div>
  );
}

function ItemCardContent({ item }: { item: DropdownItem }) {
  const isContain = item.imageFit === "contain";
  return (
    <>
      <div
        className={`relative aspect-[4/3] overflow-hidden mb-4 border border-rule ${
          isContain ? "bg-white p-3" : "bg-light"
        }`}
      >
        <Image
          src={item.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 22vw, 33vw"
          className={`${
            isContain ? "object-contain" : "object-cover"
          } transition-transform duration-500 group-hover/item:scale-105`}
        />
      </div>
      <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink leading-tight">
        {item.primary}
      </div>
      {item.description && (
        <div className="mt-1.5 text-[12px] text-ink/85 leading-snug normal-case">
          {item.description}
        </div>
      )}
      {item.price && (
        <div className="mt-2 text-[13px] font-semibold text-primary">
          {item.price}
        </div>
      )}
      {item.secondary && (
        <div className="mt-1.5 text-[10px] tracking-[0.14em] uppercase text-gray">
          {item.secondary}
        </div>
      )}
    </>
  );
}

function ItemCard({
  item,
  onNavigate,
}: {
  item: DropdownItem;
  onNavigate: () => void;
}) {
  const baseClass = "group/item flex flex-col";
  if (item.href) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className={`${baseClass} hover:opacity-95 transition-opacity`}
      >
        <ItemCardContent item={item} />
      </Link>
    );
  }
  return (
    <div className={baseClass}>
      <ItemCardContent item={item} />
    </div>
  );
}

function MobileItemRow({
  item,
  onNavigate,
}: {
  item: DropdownItem;
  onNavigate: () => void;
}) {
  const content = (
    <>
      <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink leading-tight">
        {item.primary}
      </div>
      {item.description && (
        <div className="mt-1 text-[12px] text-ink/80 leading-snug normal-case">
          {item.description}
        </div>
      )}
      {item.price && (
        <div className="mt-1.5 text-[12px] font-semibold text-primary">
          {item.price}
        </div>
      )}
      {item.secondary && (
        <div className="mt-1 text-[10px] tracking-[0.14em] uppercase text-gray">
          {item.secondary}
        </div>
      )}
    </>
  );
  return (
    <li className="border-b border-rule last:border-b-0">
      {item.href ? (
        <Link
          href={item.href}
          onClick={onNavigate}
          className="block py-3 hover:bg-light transition-colors -mx-2 px-2"
        >
          {content}
        </Link>
      ) : (
        <div className="py-3">{content}</div>
      )}
    </li>
  );
}

function CompactItemRow({
  item,
  onNavigate,
}: {
  item: DropdownItem;
  onNavigate: () => void;
}) {
  const content = (
    <>
      <div className="text-sm font-medium uppercase tracking-[0.14em] text-ink leading-tight">
        {item.primary}
      </div>
      {item.secondary && (
        <div className="mt-1 text-[11px] tracking-[0.14em] uppercase text-gray">
          {item.secondary}
        </div>
      )}
    </>
  );
  return (
    <li className="border-b border-rule last:border-b-0">
      {item.href ? (
        <Link
          href={item.href}
          onClick={onNavigate}
          className="block px-5 py-4 hover:bg-light transition-colors group/item"
        >
          <div className="flex items-center justify-between gap-4">
            <div>{content}</div>
            <span
              aria-hidden="true"
              className="text-ink/40 group-hover/item:text-primary transition-colors"
            >
              →
            </span>
          </div>
        </Link>
      ) : (
        <div className="px-5 py-4">{content}</div>
      )}
    </li>
  );
}

function CompactPanel({
  items,
  open,
  onMouseEnter,
  onMouseLeave,
  onNavigate,
}: {
  items: DropdownItem[];
  open: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onNavigate: () => void;
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`hidden md:block absolute z-40 top-full mt-3 right-0 w-72 bg-white text-ink shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)] border border-rule transition-all duration-200 ${
        open
          ? "opacity-100 visible translate-y-0"
          : "opacity-0 invisible -translate-y-2 pointer-events-none"
      }`}
    >
      <ul>
        {items.map((item, i) => (
          <CompactItemRow
            key={`${i}-${item.primary}`}
            item={item}
            onNavigate={onNavigate}
          />
        ))}
      </ul>
    </div>
  );
}

function MegaPanel({
  link,
  open,
  onMouseEnter,
  onMouseLeave,
  onNavigate,
}: {
  link: NavLinkItem | undefined;
  open: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onNavigate: () => void;
}) {
  const items = link?.dropdownItems ?? [];
  const { hasTabs, tab, setTab, shown } = useCategoryTabs(items);
  const widthClass =
    items.length <= 2
      ? "max-w-[680px]"
      : items.length <= 4
      ? "max-w-[920px]"
      : "max-w-[1200px]";

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`hidden md:block fixed z-40 top-20 left-1/2 -translate-x-1/2 w-[95%] ${widthClass} bg-white text-ink shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)] border border-rule transition-all duration-200 ${
        open
          ? "opacity-100 visible translate-y-0"
          : "opacity-0 invisible -translate-y-2 pointer-events-none"
      }`}
    >
      {items.length > 0 ? (
        <div className="p-8 lg:p-10">
          {hasTabs && <CategoryTabs tab={tab} setTab={setTab} />}
          <div className="grid gap-x-6 gap-y-8 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
            {shown.map((item, i) => (
              <ItemCard
                key={`${i}-${item.primary}`}
                item={item}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="p-10 text-xs uppercase tracking-[0.22em] text-gray font-mono text-center">
          [ items à compléter ]
        </div>
      )}
    </div>
  );
}

function MobileAccordion({
  link,
  onNavigate,
}: {
  link: NavLinkItem | undefined;
  onNavigate: () => void;
}) {
  const items = link?.dropdownItems ?? [];
  const { hasTabs, tab, setTab, shown } = useCategoryTabs(items);
  if (items.length === 0) return null;

  return (
    <div className="md:hidden w-full bg-white text-ink border border-rule shadow-lg mt-2 max-h-[60vh] overflow-y-auto">
      {hasTabs && (
        <div className="px-5 pt-4">
          <CategoryTabs tab={tab} setTab={setTab} />
        </div>
      )}
      <ul className="px-5">
        {shown.map((item, i) => (
          <MobileItemRow
            key={`${i}-${item.primary}`}
            item={item}
            onNavigate={onNavigate}
          />
        ))}
      </ul>
    </div>
  );
}

function NavList({ variant }: { variant: "dark" | "light" }) {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [shownMenu, setShownMenu] = useState<string | null>(null);
  const [priceMap, setPriceMap] = useState<Record<string, number>>({});
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeColor = variant === "light" ? "text-ink" : "text-white";
  const inactiveColor =
    variant === "light"
      ? "text-ink/60 hover:text-ink"
      : "text-white/75 hover:text-white";
  const underlineColor = variant === "light" ? "bg-ink" : "bg-white";

  useEffect(() => {
    let active = true;
    createClient()
      .from("formation_prices")
      .select("slug, price_from")
      .then(({ data }) => {
        if (active && data) {
          setPriceMap(
            Object.fromEntries(data.map((r) => [r.slug, r.price_from]))
          );
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const links = useMemo(() => buildLinks(priceMap), [priceMap]);

  const openMenu = (key: string) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setActiveMenu(key);
    setShownMenu(key);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveMenu(null), 180);
  };

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const toggleClick = (key: string) => {
    if (activeMenu === key) {
      setActiveMenu(null);
    } else {
      openMenu(key);
    }
  };

  const closeAll = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(null);
  };

  const shownLink = links.find((l) => l.label === shownMenu);

  return (
    <>
      <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-5 md:gap-x-6 lg:gap-x-8">
        {links.map((link) => {
          if (link.dropdownItems) {
            const isActive = activeMenu === link.label;
            return (
              <li
                key={link.label}
                className={link.compact ? "relative" : undefined}
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={isActive}
                  onMouseEnter={() => openMenu(link.label)}
                  onMouseLeave={scheduleClose}
                  onFocus={() => openMenu(link.label)}
                  onBlur={scheduleClose}
                  onClick={() => toggleClick(link.label)}
                  className={`${linkClass} ${
                    isActive ? activeColor : inactiveColor
                  }`}
                >
                  <span className="sm:hidden">
                    {link.labelMobile ?? link.label}
                  </span>
                  <span className="hidden sm:inline">{link.label}</span>
                  <Chevron rotated={isActive} />
                </button>
                {link.compact && (
                  <CompactPanel
                    items={link.dropdownItems}
                    open={isActive}
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                    onNavigate={closeAll}
                  />
                )}
              </li>
            );
          }

          const active = link.href
            ? pathname === link.href || pathname.startsWith(`${link.href}/`)
            : false;
          return (
            <li key={link.label}>
              <Link
                href={link.href!}
                className={`${linkClass} ${
                  active ? activeColor : inactiveColor
                }`}
              >
                <span>{link.label}</span>
                {active && (
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-1 left-0 right-0 h-px ${underlineColor}`}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <MobileAccordion link={activeMenu ? shownLink : undefined} onNavigate={closeAll} />

      <MegaPanel
        link={shownLink && !shownLink.compact ? shownLink : undefined}
        open={!!activeMenu && !shownLink?.compact}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        onNavigate={closeAll}
      />
    </>
  );
}

export function HeroNav({
  variant = "dark",
}: {
  variant?: "dark" | "light";
}) {
  const logoClass =
    variant === "light" ? "mix-blend-multiply" : "invert mix-blend-screen";

  return (
    <div className={`w-full ${variant === "light" ? "text-ink" : "text-white"}`}>
      <div className="container-x flex flex-col items-center gap-3 py-4 md:flex-row md:justify-between md:items-center md:gap-6 md:py-0 md:h-28">
        <Link
          href="/"
          className="flex items-center shrink-0"
          aria-label="Accueil FRC Technique"
        >
          <Image
            src="/new logo frc.png"
            alt="FRC Technique — Centre de formation"
            width={760}
            height={370}
            priority
            className={`h-16 sm:h-20 md:h-20 lg:h-24 w-auto ${logoClass}`}
          />
        </Link>

        <nav
          aria-label="Navigation principale"
          className="w-full md:w-auto flex flex-col items-center md:flex-row md:items-stretch md:gap-3"
        >
          <NavList variant={variant} />
          <CartButton variant={variant} />
        </nav>
      </div>
    </div>
  );
}
