import { supabasePublic } from "@/lib/supabase/public";

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
