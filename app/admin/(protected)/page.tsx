import { createClient } from "@/lib/supabase/server";
import { formations } from "@/lib/data";
import { PriceEditor } from "./PriceEditor";
import { SessionsManager } from "./SessionsManager";
import { DocumentsManager } from "./DocumentsManager";

export const metadata = { title: "Administration — FRC Technique" };

export type PriceRow = { slug: string; price_from: number };
export type SessionRow = {
  id: string;
  formation_slug: string;
  starts_on: string;
  ends_on: string | null;
  location: string | null;
  seats_total: number | null;
  status: string;
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

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [{ data: prices }, { data: sessions }, { data: documents }] =
    await Promise.all([
      supabase.from("formation_prices").select("slug, price_from"),
      supabase
        .from("sessions")
        .select(
          "id, formation_slug, starts_on, ends_on, location, seats_total, status"
        )
        .order("starts_on", { ascending: true }),
      supabase
        .from("documents")
        .select(
          "id, label, file_path, file_name, mime_type, size_bytes, formation_slug, category"
        )
        .order("created_at", { ascending: false }),
    ]);

  const formationList = formations.map((f) => ({
    slug: f.slug,
    title: f.code ? `CACES® ${f.code} — ${f.title}` : f.title,
    fallbackPrice: f.priceFrom ?? null,
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
        formations={formationList.map(({ slug, title }) => ({ slug, title }))}
        sessions={(sessions ?? []) as SessionRow[]}
      />

      <DocumentsManager
        formations={formationList.map(({ slug, title }) => ({ slug, title }))}
        documents={(documents ?? []) as DocumentRow[]}
      />
    </div>
  );
}
