import { supabasePublic } from "@/lib/supabase/public";
import type { Testimonial } from "@/lib/data";

export type PublicSession = {
  id: string;
  formation_slug: string;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  seats_total: number | null;
  status: string;
  categories: string[] | null;
};

/** Prix éditables (slug → prix en euros). Fallback : map vide. */
export async function getPriceMap(): Promise<Record<string, number>> {
  try {
    const { data, error } = await supabasePublic
      .from("formation_prices")
      .select("slug, price_from");
    if (error || !data) return {};
    return Object.fromEntries(data.map((r) => [r.slug, r.price_from]));
  } catch {
    return {};
  }
}

/** Sessions à venir (non annulées), triées par date. */
export async function getUpcomingSessions(): Promise<PublicSession[]> {
  try {
    const todayMidnight = new Date().toISOString().slice(0, 10) + "T00:00:00";
    const { data, error } = await supabasePublic
      .from("sessions")
      .select(
        "id, formation_slug, starts_at, ends_at, location, seats_total, status, categories"
      )
      .gte("starts_at", todayMidnight)
      .neq("status", "cancelled")
      .order("starts_at", { ascending: true });
    if (error || !data) return [];
    return data as PublicSession[];
  } catch {
    return [];
  }
}

/**
 * Promotions actives à afficher dans le bandeau du hero, filtrées sur leur
 * fenêtre de validité (dates optionnelles). Les plus récentes d'abord.
 */
export async function getActivePromotions(): Promise<string[]> {
  try {
    const { data, error } = await supabasePublic
      .from("promotions")
      .select("label, starts_on, ends_on")
      .eq("active", true)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    const today = new Date().toISOString().slice(0, 10);
    return data
      .filter(
        (p) =>
          (!p.starts_on || p.starts_on <= today) &&
          (!p.ends_on || p.ends_on >= today)
      )
      .map((p) => p.label as string)
      .filter(Boolean);
  } catch {
    return [];
  }
}

export type PromoFlyer = {
  id: string;
  label: string;
  url: string;
  mime: string | null;
};

/**
 * Flyers de promotion à afficher au public (documents de catégorie
 * « promotion », dans le dossier `promotions/`). Génère une URL signée par
 * flyer. Nécessite les policies d'accès anon (voir db/promotion_flyers.sql).
 */
export async function getPromotionFlyers(): Promise<PromoFlyer[]> {
  try {
    const { data, error } = await supabasePublic
      .from("documents")
      .select("id, label, file_path, mime_type")
      .eq("category", "promotion")
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return [];

    const flyers: PromoFlyer[] = [];
    for (const d of data) {
      const { data: signed } = await supabasePublic.storage
        .from("documents")
        .createSignedUrl(d.file_path as string, 3600);
      if (signed?.signedUrl) {
        flyers.push({
          id: d.id as string,
          label: d.label as string,
          url: signed.signedUrl,
          mime: (d.mime_type as string | null) ?? null,
        });
      }
    }
    return flyers;
  } catch {
    return [];
  }
}

/** Avis clients approuvés (les plus récents d'abord). */
export async function getApprovedReviews(): Promise<Testimonial[]> {
  try {
    const { data, error } = await supabasePublic
      .from("reviews")
      .select("name, quote, rating")
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data as Testimonial[];
  } catch {
    return [];
  }
}
