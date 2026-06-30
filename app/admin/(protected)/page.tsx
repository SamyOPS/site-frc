import { createClient } from "@/lib/supabase/server";
import { formations } from "@/lib/data";
import { PriceEditor } from "./PriceEditor";
import { SessionsManager } from "./SessionsManager";
import { DocumentsManager } from "./DocumentsManager";
import { ReviewsManager } from "./ReviewsManager";
import { ReviewQrPanel } from "./ReviewQrPanel";

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

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { data: prices },
    { data: sessions },
    { data: documents },
    { data: reviews },
  ] = await Promise.all([
    supabase.from("formation_prices").select("slug, price_from"),
    supabase
      .from("sessions")
      .select(
        "id, formation_slug, starts_at, ends_at, location, seats_total, status, categories"
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

  return (
    <div className="space-y-14">
      <div>
        <p className="eyebrow">Tableau de bord</p>
        <h1 className="mt-2 headline text-3xl md:text-4xl text-ink">
          Gestion du site
        </h1>
        <p className="mt-2 text-sm text-gray normal-case">
          Modifiez les prix des formations et le planning des sessions. Les
          changements sont publiés automatiquement sur le site.
        </p>
      </div>

      <PriceEditor
        formations={formationList}
        prices={(prices ?? []) as PriceRow[]}
      />

      <SessionsManager
        formations={formationList.map(({ slug, title, categories }) => ({
          slug,
          title,
          categories,
        }))}
        sessions={(sessions ?? []) as SessionRow[]}
      />

      <DocumentsManager
        formations={formationList.map(({ slug, title }) => ({ slug, title }))}
        documents={(documents ?? []) as DocumentRow[]}
      />

      <ReviewQrPanel url="https://frc-technique.fr/avis" />

      <ReviewsManager reviews={reviewList} />
    </div>
  );
}
