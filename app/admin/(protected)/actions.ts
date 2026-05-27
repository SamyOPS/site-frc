"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { ok: boolean; error?: string };

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, ok: false as const };
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  return { supabase, ok: profile?.role === "admin" };
}

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/calendrier");
  revalidatePath("/formations", "layout");
}

/** Met à jour (ou crée) le prix d'une formation. */
export async function savePrice(
  slug: string,
  priceFrom: number
): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { ok: false, error: "Non autorisé." };

  if (!Number.isFinite(priceFrom) || priceFrom < 0) {
    return { ok: false, error: "Prix invalide." };
  }

  const { error } = await supabase
    .from("formation_prices")
    .upsert({ slug, price_from: Math.round(priceFrom) }, { onConflict: "slug" });

  if (error) return { ok: false, error: error.message };

  revalidatePublic();
  return { ok: true };
}

/** Crée une session de planning. */
export async function createSession(formData: FormData): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { ok: false, error: "Non autorisé." };

  const formationSlug = String(formData.get("formation_slug") ?? "");
  const startsOn = String(formData.get("starts_on") ?? "");
  const endsOn = String(formData.get("ends_on") ?? "");
  const location = String(formData.get("location") ?? "").trim();
  const seatsTotalRaw = String(formData.get("seats_total") ?? "");
  const status = String(formData.get("status") ?? "open");

  if (!formationSlug || !startsOn) {
    return { ok: false, error: "Formation et date de début requises." };
  }

  const { error } = await supabase.from("sessions").insert({
    formation_slug: formationSlug,
    starts_on: startsOn,
    ends_on: endsOn || null,
    location: location || null,
    seats_total: seatsTotalRaw ? Number(seatsTotalRaw) : null,
    status,
  });

  if (error) return { ok: false, error: error.message };

  revalidatePublic();
  return { ok: true };
}

/** Change le statut d'une session. */
export async function updateSessionStatus(
  id: string,
  status: string
): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { ok: false, error: "Non autorisé." };

  const { error } = await supabase
    .from("sessions")
    .update({ status })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePublic();
  return { ok: true };
}

/** Supprime une session. */
export async function deleteSession(id: string): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { ok: false, error: "Non autorisé." };

  const { error } = await supabase.from("sessions").delete().eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePublic();
  return { ok: true };
}
