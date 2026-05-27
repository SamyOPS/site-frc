import { supabasePublic } from "@/lib/supabase/public";

export type PublicSession = {
  id: string;
  formation_slug: string;
  starts_on: string;
  ends_on: string | null;
  location: string | null;
  seats_total: number | null;
  status: string;
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
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabasePublic
      .from("sessions")
      .select(
        "id, formation_slug, starts_on, ends_on, location, seats_total, status"
      )
      .gte("starts_on", today)
      .neq("status", "cancelled")
      .order("starts_on", { ascending: true });
    if (error || !data) return [];
    return data as PublicSession[];
  } catch {
    return [];
  }
}
