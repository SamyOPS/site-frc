import { createClient } from "@/lib/supabase/server";
import { formations } from "@/lib/data";
import { PriceEditor } from "./PriceEditor";
import { SessionsManager } from "./SessionsManager";
import { DocumentsManager } from "./DocumentsManager";
import { ReviewsManager } from "./ReviewsManager";
import { ReviewQrPanel } from "./ReviewQrPanel";
import { PromotionsManager } from "./PromotionsManager";
import { AdminShell, type AdminSection } from "./AdminShell";

export const metadata = { title: "Administration — FRC Technique" };

export type PriceRow = { slug: string; price_from: number };
export type SessionRow = {
  id: string;
  formation_slug: string;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  seats_total: number | null;
  status: string;
  categories: string[] | null;
  series_id: string | null;
};
export type DocumentRow = {
  id: string;
  label: string;
  file_path: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  formation_slug: string | null;
  category: string;
};
export type ReviewRow = {
  id: string;
  name: string;
  quote: string;
  rating: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};
export type PromotionRow = {
  id: string;
  label: string;
  active: boolean;
  starts_on: string | null;
  ends_on: string | null;
  created_at: string;
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { data: prices },
    { data: sessions },
    { data: documents },
    { data: reviews },
    { data: promotions },
  ] = await Promise.all([
    supabase.from("formation_prices").select("slug, price_from"),
    supabase
      .from("sessions")
      .select(
        "id, formation_slug, starts_at, ends_at, location, seats_total, status, categories, series_id"
      )
      .order("starts_at", { ascending: true }),
    supabase
      .from("documents")
      .select(
        "id, label, file_path, file_name, mime_type, size_bytes, formation_slug, category"
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("reviews")
      .select("id, name, quote, rating, status, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("promotions")
      .select("id, label, active, starts_on, ends_on, created_at")
      .order("created_at", { ascending: false }),
  ]);

  // Avis en attente d'abord, puis le reste par date décroissante.
  const reviewList = ((reviews ?? []) as ReviewRow[])
    .slice()
    .sort((a, b) =>
      a.status === b.status ? 0 : a.status === "pending" ? -1 : b.status === "pending" ? 1 : 0
    );

  const formationList = formations.map((f) => ({
    slug: f.slug,
    title: f.code ? `CACES® ${f.code} — ${f.title}` : f.title,
    fallbackPrice: f.priceFrom ?? null,
    categories: f.categoriesDetail ?? null,
  }));

  const pendingReviews = reviewList.filter((r) => r.status === "pending").length;
  const activePromos = (promotions ?? []).filter(
    (p) => (p as PromotionRow).active
  ).length;

  const sections: AdminSection[] = [
    {
      id: "promotions",
      label: "Promotions",
      badge: activePromos || undefined,
      content: (
        <PromotionsManager promotions={(promotions ?? []) as PromotionRow[]} />
      ),
    },
    {
      id: "tarifs",
      label: "Tarifs",
      content: (
        <PriceEditor
          formations={formationList}
          prices={(prices ?? []) as PriceRow[]}
        />
      ),
    },
    {
      id: "planning",
      label: "Planning",
      content: (
        <SessionsManager
          formations={formationList.map(({ slug, title, categories }) => ({
            slug,
            title,
            categories,
          }))}
          sessions={(sessions ?? []) as SessionRow[]}
        />
      ),
    },
    {
      id: "documents",
      label: "Documents",
      content: (
        <DocumentsManager
          formations={formationList.map(({ slug, title }) => ({ slug, title }))}
          documents={(documents ?? []) as DocumentRow[]}
        />
      ),
    },
    {
      id: "avis",
      label: "Avis",
      badge: pendingReviews || undefined,
      content: (
        <div className="space-y-10">
          <ReviewQrPanel url="https://www.frc-technique.com/avis" />
          <ReviewsManager reviews={reviewList} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 md:space-y-10">
      <div>
        <p className="eyebrow">Tableau de bord</p>
        <h1 className="mt-2 headline text-3xl md:text-4xl text-ink">
          Gestion du site
        </h1>
        <p className="mt-2 text-sm text-gray normal-case">
          Choisissez une catégorie dans le menu. Les changements sont publiés
          automatiquement sur le site.
        </p>
      </div>

      <AdminShell sections={sections} />
    </div>
  );
}
