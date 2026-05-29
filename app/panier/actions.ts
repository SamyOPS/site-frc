"use server";

import type { CartItem } from "@/lib/cart";

export type QuoteContact = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type QuoteResult = { ok: boolean; error?: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Reçoit une demande de devis depuis le panier.
 * TODO: brancher l'envoi d'email à l'organisme.
 */
export async function submitQuoteRequest(
  items: CartItem[],
  contact: QuoteContact
): Promise<QuoteResult> {
  if (!items.length) return { ok: false, error: "Panier vide." };

  const name = contact.name?.trim();
  const email = contact.email?.trim();
  const phone = contact.phone?.trim();
  const message = contact.message?.trim() ?? "";

  if (!name || !email || !phone) {
    return { ok: false, error: "Nom, email et téléphone sont requis." };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { ok: false, error: "Email invalide." };
  }

  // TODO: envoyer un email à l'organisme (Resend / SMTP / Supabase Edge function)
  // Pour l'instant on log seulement côté serveur.
  console.log("[quote-request]", { contact: { name, email, phone, message }, items });

  return { ok: true };
}
