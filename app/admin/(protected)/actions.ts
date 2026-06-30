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

  if (endDate && endDate < startDate) {
    return { ok: false, error: "La date de fin doit être après la date de début." };
  }

  // Horaires fixes : chaque jour de session se déroule de 09h00 à 17h00.
  // Le dernier jour (date de fin, ou date de début si session d'un jour) finit à 17h.
  const normStartsAt = `${startDate}T09:00:00`;
  const normEndsAt = `${endDate || startDate}T17:00:00`;

  let recurrenceCount = recurrenceCountRaw ? Number(recurrenceCountRaw) : 0;
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

  const durationMs = normEndsAt
    ? Math.max(0, tsToUtcMs(normEndsAt) - tsToUtcMs(normStartsAt))
    : 0;
  const sharedRow = {
    // Le lieu est toujours Montataire : on ne le saisit plus (null en base,
    // l'affichage retombe sur « Montataire (60) »).
    location: null,
    seats_total: seatsTotalRaw ? Number(seatsTotalRaw) : null,
    status,
  };

  const occurrences: string[] = [normStartsAt];
  if (recurrence !== "none") {
    const limit = recurrenceCount || MAX_OCCURRENCES;
    let cur = normStartsAt;
    while (occurrences.length < limit) {
      cur = nextOccurrence(cur, recurrence);
      if (recurrenceUntil && cur.slice(0, 10) > recurrenceUntil) break;
      occurrences.push(cur);
    }
  }

  const rows = formationSlugs.flatMap((slug) => {
    const cats = categoriesBySlug.get(slug) ?? null;
    return occurrences.map((startTs) => ({
      ...sharedRow,
      formation_slug: slug,
      categories: cats,
      starts_at: startTs,
      ends_at: normEndsAt ? tsFromUtcMs(tsToUtcMs(startTs) + durationMs) : null,
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
