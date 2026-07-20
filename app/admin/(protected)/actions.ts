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

/** Parse "YYYY-MM-DDTHH:mm[:ss]" en composants sans conversion TZ. */
function parseTs(s: string) {
  const [datePart, timePart = "00:00"] = s.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm] = timePart.split(":").map(Number);
  return { y, m, d, hh, mm };
}

function formatTs(y: number, m: number, d: number, hh: number, mm: number) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${y}-${p(m)}-${p(d)}T${p(hh)}:${p(mm)}:00`;
}

function tsToUtcMs(s: string): number {
  const { y, m, d, hh, mm } = parseTs(s);
  return Date.UTC(y, m - 1, d, hh, mm);
}

function tsFromUtcMs(ms: number): string {
  const dt = new Date(ms);
  return formatTs(
    dt.getUTCFullYear(),
    dt.getUTCMonth() + 1,
    dt.getUTCDate(),
    dt.getUTCHours(),
    dt.getUTCMinutes()
  );
}

function addDaysTs(s: string, days: number): string {
  return tsFromUtcMs(tsToUtcMs(s) + days * 86_400_000);
}

function addMonthsTs(s: string, months: number): string {
  const { y, m, d, hh, mm } = parseTs(s);
  const dt = new Date(Date.UTC(y, m - 1, d, hh, mm));
  dt.setUTCMonth(dt.getUTCMonth() + months);
  return formatTs(
    dt.getUTCFullYear(),
    dt.getUTCMonth() + 1,
    dt.getUTCDate(),
    dt.getUTCHours(),
    dt.getUTCMinutes()
  );
}

function nextOccurrence(start: string, frequency: string): string {
  switch (frequency) {
    case "weekly":
      return addDaysTs(start, 7);
    case "biweekly":
      return addDaysTs(start, 14);
    case "monthly":
      return addMonthsTs(start, 1);
    default:
      return start;
  }
}

const MAX_OCCURRENCES = 52;

type OccurrenceParams = {
  startDate: string;
  endDate: string;
  recurrence: string;
  recurrenceUntil: string;
  recurrenceCount: number;
};

/**
 * Valide les dates/la récurrence et calcule les créneaux d'une série.
 * Chaque créneau se déroule de 09h00 à 17h00 (la date de fin définit la durée,
 * réappliquée à chaque occurrence). Réutilisé par la création et la modification
 * de série.
 */
function resolveOccurrences(
  params: OccurrenceParams
):
  | { ok: true; times: { starts_at: string; ends_at: string }[] }
  | { ok: false; error: string } {
  const { startDate, endDate, recurrence, recurrenceUntil } = params;

  if (!startDate) {
    return { ok: false, error: "La date de début est requise." };
  }
  if (endDate && endDate < startDate) {
    return { ok: false, error: "La date de fin doit être après la date de début." };
  }

  let recurrenceCount = params.recurrenceCount;
  if (recurrence !== "none") {
    if (!recurrenceUntil && !recurrenceCount) {
      return {
        ok: false,
        error: "Indiquez une date de fin de série ou un nombre de séances.",
      };
    }
    if (recurrenceUntil && recurrenceUntil <= startDate) {
      return {
        ok: false,
        error: "La fin de série doit être après la date de début.",
      };
    }
    if (recurrenceCount) {
      if (!Number.isFinite(recurrenceCount) || recurrenceCount < 2) {
        return { ok: false, error: "Nombre de séances invalide (min. 2)." };
      }
      recurrenceCount = Math.min(MAX_OCCURRENCES, Math.floor(recurrenceCount));
    }
  }

  // Horaires fixes : 09h00 → 17h00 (le dernier jour finit à 17h).
  const normStartsAt = `${startDate}T09:00:00`;
  const normEndsAt = `${endDate || startDate}T17:00:00`;
  const durationMs = Math.max(0, tsToUtcMs(normEndsAt) - tsToUtcMs(normStartsAt));

  const starts: string[] = [normStartsAt];
  if (recurrence !== "none") {
    const limit = recurrenceCount || MAX_OCCURRENCES;
    let cur = normStartsAt;
    while (starts.length < limit) {
      cur = nextOccurrence(cur, recurrence);
      if (recurrenceUntil && cur.slice(0, 10) > recurrenceUntil) break;
      starts.push(cur);
    }
  }

  const times = starts.map((s) => ({
    starts_at: s,
    ends_at: tsFromUtcMs(tsToUtcMs(s) + durationMs),
  }));
  return { ok: true, times };
}

/** Crée une session de planning (avec récurrence optionnelle). */
export async function createSession(formData: FormData): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { ok: false, error: "Non autorisé." };

  const formationSlugs = formData
    .getAll("formation_slugs")
    .map((v) => String(v))
    .filter(Boolean);
  // Seules des dates sont saisies : toute session se déroule de 09h00 à 17h00.
  const startDate = String(formData.get("start_date") ?? "");
  const endDate = String(formData.get("end_date") ?? "");
  const seatsTotalRaw = String(formData.get("seats_total") ?? "");
  const status = String(formData.get("status") ?? "open");
  const recurrence = String(formData.get("recurrence") ?? "none");
  const recurrenceUntil = String(formData.get("recurrence_until") ?? "");
  const recurrenceCountRaw = String(formData.get("recurrence_count") ?? "");

  if (formationSlugs.length === 0 || !startDate) {
    return {
      ok: false,
      error: "Sélectionnez au moins une formation et une date de début.",
    };
  }

  const categoriesBySlug = new Map<string, string[]>();
  for (const slug of formationSlugs) {
    const cats = formData
      .getAll(`categories_${slug}`)
      .map((v) => String(v))
      .filter(Boolean);
    if (cats.length > 0) categoriesBySlug.set(slug, cats);
  }

  const resolved = resolveOccurrences({
    startDate,
    endDate,
    recurrence,
    recurrenceUntil,
    recurrenceCount: recurrenceCountRaw ? Number(recurrenceCountRaw) : 0,
  });
  if (!resolved.ok) return { ok: false, error: resolved.error };
  const { times } = resolved;
  const seatsTotal = seatsTotalRaw ? Number(seatsTotalRaw) : null;

  // Le lieu est toujours Montataire : non saisi (null en base, l'affichage
  // retombe sur « Montataire (60) »). Une récurrence produisant plusieurs
  // séances reçoit un `series_id` commun PAR FORMATION, pour pouvoir gérer
  // toute la série d'un bloc (modification / suppression groupée).
  const rows = formationSlugs.flatMap((slug) => {
    const cats = categoriesBySlug.get(slug) ?? null;
    const seriesId = times.length > 1 ? crypto.randomUUID() : null;
    return times.map((t) => ({
      location: null,
      seats_total: seatsTotal,
      status,
      formation_slug: slug,
      categories: cats,
      starts_at: t.starts_at,
      ends_at: t.ends_at,
      series_id: seriesId,
    }));
  });

  const { error } = await supabase.from("sessions").insert(rows);

  if (error) return { ok: false, error: error.message };

  revalidatePublic();
  return { ok: true };
}

/** Modifie une session planifiée : dates (toujours 09h–17h) et catégories. */
export async function updateSession(
  id: string,
  data: { startDate: string; endDate: string; categories: string[] | null }
): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { ok: false, error: "Non autorisé." };

  const { startDate, endDate } = data;
  if (!startDate) {
    return { ok: false, error: "La date de début est requise." };
  }
  if (endDate && endDate < startDate) {
    return { ok: false, error: "La date de fin doit être après la date de début." };
  }

  const starts_at = `${startDate}T09:00:00`;
  const ends_at = `${endDate || startDate}T17:00:00`;

  const { error } = await supabase
    .from("sessions")
    .update({ starts_at, ends_at, categories: data.categories })
    .eq("id", id);

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

/** Met à jour le nombre de places d'une session (null = non spécifié). */
export async function updateSessionSeats(
  id: string,
  seats: number | null
): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { ok: false, error: "Non autorisé." };

  if (seats != null && (!Number.isFinite(seats) || seats < 0)) {
    return { ok: false, error: "Nombre de places invalide." };
  }

  const { error } = await supabase
    .from("sessions")
    .update({ seats_total: seats })
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

/** Supprime toutes les séances d'une série récurrente d'un coup. */
export async function deleteSeries(seriesId: string): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { ok: false, error: "Non autorisé." };
  if (!seriesId) return { ok: false, error: "Série introuvable." };

  const { error } = await supabase
    .from("sessions")
    .delete()
    .eq("series_id", seriesId);

  if (error) return { ok: false, error: error.message };

  revalidatePublic();
  return { ok: true };
}

/**
 * Remplace entièrement une série : régénère toutes ses séances à partir des
 * nouveaux paramètres (dates, récurrence, catégories, places, statut).
 * On insère la nouvelle série (nouvel identifiant) PUIS on supprime l'ancienne,
 * afin que l'ancienne reste intacte si l'insertion échoue.
 */
export async function updateSeries(
  seriesId: string,
  data: {
    slug: string;
    categories: string[] | null;
    startDate: string;
    endDate: string;
    seatsTotal: number | null;
    status: string;
    recurrence: string;
    recurrenceUntil: string;
    recurrenceCount: number;
  }
): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { ok: false, error: "Non autorisé." };
  if (!seriesId || !data.slug) {
    return { ok: false, error: "Série introuvable." };
  }

  const resolved = resolveOccurrences({
    startDate: data.startDate,
    endDate: data.endDate,
    recurrence: data.recurrence,
    recurrenceUntil: data.recurrenceUntil,
    recurrenceCount: data.recurrenceCount,
  });
  if (!resolved.ok) return { ok: false, error: resolved.error };
  const { times } = resolved;

  const newSeriesId = times.length > 1 ? crypto.randomUUID() : null;
  const rows = times.map((t) => ({
    location: null,
    seats_total: data.seatsTotal,
    status: data.status,
    formation_slug: data.slug,
    categories: data.categories,
    starts_at: t.starts_at,
    ends_at: t.ends_at,
    series_id: newSeriesId,
  }));

  const { error: insertError } = await supabase.from("sessions").insert(rows);
  if (insertError) return { ok: false, error: insertError.message };

  const { error: deleteError } = await supabase
    .from("sessions")
    .delete()
    .eq("series_id", seriesId);
  if (deleteError) return { ok: false, error: deleteError.message };

  revalidatePublic();
  return { ok: true };
}

/** Valide ou rejette un avis client (statut pending → approved/rejected). */
export async function setReviewStatus(
  id: string,
  status: "pending" | "approved" | "rejected"
): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { ok: false, error: "Non autorisé." };

  if (!["pending", "approved", "rejected"].includes(status)) {
    return { ok: false, error: "Statut invalide." };
  }

  const { error } = await supabase
    .from("reviews")
    .update({ status })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePublic();
  return { ok: true };
}

/** Supprime définitivement un avis. */
export async function deleteReview(id: string): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { ok: false, error: "Non autorisé." };

  const { error } = await supabase.from("reviews").delete().eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePublic();
  return { ok: true };
}

/** Crée une promotion affichée dans le bandeau du hero. */
export async function createPromotion(
  formData: FormData
): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { ok: false, error: "Non autorisé." };

  const label = String(formData.get("label") ?? "").trim();
  const startsOn = String(formData.get("starts_on") ?? "");
  const endsOn = String(formData.get("ends_on") ?? "");

  if (!label) {
    return { ok: false, error: "Le texte de la promotion est requis." };
  }
  if (label.length > 200) {
    return { ok: false, error: "Texte trop long (200 caractères max)." };
  }
  if (startsOn && endsOn && endsOn < startsOn) {
    return { ok: false, error: "La date de fin doit être après la date de début." };
  }

  const { error } = await supabase.from("promotions").insert({
    label,
    active: true,
    starts_on: startsOn || null,
    ends_on: endsOn || null,
  });

  if (error) return { ok: false, error: error.message };

  revalidatePublic();
  return { ok: true };
}

/** Modifie une promotion existante (texte et fenêtre de dates). */
export async function updatePromotion(
  id: string,
  data: { label: string; startsOn: string; endsOn: string }
): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { ok: false, error: "Non autorisé." };

  const label = data.label.trim();
  if (!label) {
    return { ok: false, error: "Le texte de la promotion est requis." };
  }
  if (label.length > 200) {
    return { ok: false, error: "Texte trop long (200 caractères max)." };
  }
  if (data.startsOn && data.endsOn && data.endsOn < data.startsOn) {
    return { ok: false, error: "La date de fin doit être après la date de début." };
  }

  const { error } = await supabase
    .from("promotions")
    .update({
      label,
      starts_on: data.startsOn || null,
      ends_on: data.endsOn || null,
    })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePublic();
  return { ok: true };
}

/** Active ou désactive une promotion. */
export async function setPromotionActive(
  id: string,
  active: boolean
): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { ok: false, error: "Non autorisé." };

  const { error } = await supabase
    .from("promotions")
    .update({ active })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePublic();
  return { ok: true };
}

/** Supprime définitivement une promotion. */
export async function deletePromotion(id: string): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { ok: false, error: "Non autorisé." };

  const { error } = await supabase.from("promotions").delete().eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePublic();
  return { ok: true };
}
