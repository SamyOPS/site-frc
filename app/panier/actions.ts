"use server";

import type { CartItem } from "@/lib/cart";
import { company } from "@/lib/data";
import { looksLikeBot } from "@/lib/antispam";
import { escapeHtml, sendMail } from "@/lib/mailer";

export type QuoteContact = {
  name: string;
  email: string;
  phone: string;
  message: string;
  /** Anti-spam : champ piège (doit rester vide) + horodatage d'ouverture. */
  company?: string;
  ts?: number;
};

export type QuoteResult = { ok: boolean; error?: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function renderItemsText(items: CartItem[]): string {
  return items
    .map((i, idx) => {
      const parts: string[] = [`${idx + 1}. ${i.title}`];
      if (i.sessionLabel) parts.push(`   Session : ${i.sessionLabel}`);
      if (i.categories.length > 0)
        parts.push(`   Catégorie(s) : ${i.categories.join(", ")}`);
      parts.push(`   Participants : ${i.quantity}`);
      if (i.priceFrom != null)
        parts.push(`   Tarif unitaire : dès ${i.priceFrom} €`);
      return parts.join("\n");
    })
    .join("\n\n");
}

function renderItemsHtml(items: CartItem[]): string {
  const rows = items
    .map((i) => {
      const cats =
        i.categories.length > 0
          ? `<div style="font-size:11px;color:#16a34a;text-transform:uppercase;letter-spacing:0.16em;margin-top:4px">Cat. ${escapeHtml(
              i.categories.join(" · ")
            )}</div>`
          : "";
      const session = i.sessionLabel
        ? `<div style="font-size:13px;color:#374151;margin-top:4px">Session : <strong>${escapeHtml(
            i.sessionLabel
          )}</strong></div>`
        : "";
      const price =
        i.priceFrom != null
          ? `<td style="padding:12px;border-top:1px solid #e5e7eb;text-align:right;font-weight:600;color:#050608;white-space:nowrap">${
              i.priceFrom * i.quantity
            } €</td>`
          : `<td style="padding:12px;border-top:1px solid #e5e7eb;text-align:right;color:#8d9297;white-space:nowrap">Sur devis</td>`;
      return `
        <tr>
          <td style="padding:12px;border-top:1px solid #e5e7eb">
            <div style="font-weight:500;color:#050608">${escapeHtml(i.title)}</div>
            ${session}
            ${cats}
          </td>
          <td style="padding:12px;border-top:1px solid #e5e7eb;text-align:center;color:#374151;white-space:nowrap">× ${i.quantity}</td>
          ${price}
        </tr>`;
    })
    .join("");

  return `
    <table style="width:100%;border-collapse:collapse;font-family:-apple-system,Segoe UI,Roboto,sans-serif">
      <thead>
        <tr>
          <th style="padding:8px 12px;text-align:left;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#8d9297">Formation</th>
          <th style="padding:8px 12px;text-align:center;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#8d9297">Participants</th>
          <th style="padding:8px 12px;text-align:right;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#8d9297">Tarif</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

/** Reçoit une demande de devis depuis le panier et l'envoie par email. */
export async function submitQuoteRequest(
  items: CartItem[],
  contact: QuoteContact
): Promise<QuoteResult> {
  if (!items.length) return { ok: false, error: "Panier vide." };

  const name = contact.name?.trim();
  const email = contact.email?.trim();
  const phone = contact.phone?.trim();
  const message = contact.message?.trim() ?? "";

  // Anti-spam : rejet silencieux des bots (faux succès, aucun email envoyé).
  if (
    looksLikeBot({
      honeypot: contact.company,
      ts: contact.ts,
      identity: [name ?? ""],
      content: [message],
    })
  ) {
    return { ok: true };
  }

  if (!name || !email || !phone) {
    return { ok: false, error: "Nom, email et téléphone sont requis." };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { ok: false, error: "Email invalide." };
  }

  const subtotal = items.reduce(
    (s, i) => s + (i.priceFrom ?? 0) * i.quantity,
    0
  );

  const subject = `Demande de devis — ${name}`;

  const text = `Nouvelle demande de devis depuis le site FRC Technique.

Contact
-------
Nom      : ${name}
Email    : ${email}
Téléphone: ${phone}

Formations demandées
--------------------
${renderItemsText(items)}

${subtotal > 0 ? `Sous-total estimé : ${subtotal} €` : "Sous-total : sur devis"}

${message ? `Message du demandeur\n--------------------\n${message}` : ""}
`;

  const html = `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f4f5f7;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#050608">
<table style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;width:100%;border-collapse:collapse">
  <tr><td style="padding:24px 28px 0">
    <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#16a34a;font-weight:500">FRC Technique · Demande de devis</div>
    <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:#050608">Nouvelle demande</h1>
  </td></tr>
  <tr><td style="padding:20px 28px">
    <div style="background:#f4f5f7;border:1px solid #e5e7eb;padding:16px 18px">
      <div style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8d9297">Contact</div>
      <div style="margin-top:8px;font-size:14px"><strong>${escapeHtml(name)}</strong></div>
      <div style="margin-top:4px;font-size:13px">
        <a href="mailto:${escapeHtml(email)}" style="color:#16a34a;text-decoration:none">${escapeHtml(email)}</a>
        &nbsp;·&nbsp;
        <a href="tel:${escapeHtml(phone)}" style="color:#050608;text-decoration:none">${escapeHtml(phone)}</a>
      </div>
    </div>
  </td></tr>
  <tr><td style="padding:0 28px 16px">
    <div style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8d9297;margin-bottom:8px">Formations demandées</div>
    ${renderItemsHtml(items)}
    <div style="margin-top:16px;padding:14px 16px;background:#050608;color:#ffffff;display:flex;justify-content:space-between">
      <span style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase">Sous-total estimé</span>
      <span style="font-size:20px;font-weight:700;float:right">${subtotal > 0 ? `${subtotal} €` : "Sur devis"}</span>
    </div>
  </td></tr>
  ${
    message
      ? `<tr><td style="padding:0 28px 24px">
    <div style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8d9297;margin-bottom:8px">Message</div>
    <div style="background:#f4f5f7;border:1px solid #e5e7eb;padding:14px 16px;font-size:13px;line-height:1.5;white-space:pre-wrap">${escapeHtml(
      message
    )}</div>
  </td></tr>`
      : ""
  }
  <tr><td style="padding:16px 28px 24px;border-top:1px solid #e5e7eb;font-size:11px;color:#8d9297">
    Envoyé depuis www.frc-technique.com · ${new Date().toLocaleString("fr-FR")}
  </td></tr>
</table>
</body></html>`;

  // Destinataire de la notification (configurable) ; repli sur l'email société.
  const notifyTo = process.env.NOTIFY_EMAIL || company.email;

  const notif = await sendMail({
    to: notifyTo,
    replyTo: email,
    subject,
    text,
    html,
  });

  if (!notif.ok) {
    return { ok: false, error: notif.error ?? "Envoi du message impossible." };
  }

  // Email de confirmation au demandeur (best-effort : n'échoue pas la demande).
  const confirmText = `Bonjour ${name},

Merci pour votre demande de devis. Nous l'avons bien reçue et un membre de l'équipe FRC Technique vous recontactera sous 48h ouvrées avec une proposition adaptée.

Récapitulatif de votre demande
------------------------------
${renderItemsText(items)}

${subtotal > 0 ? `Sous-total estimé : ${subtotal} €` : "Sous-total : sur devis"}

À bientôt,
L'équipe FRC Technique
${company.email}
`;

  const confirmHtml = `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f4f5f7;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#050608">
<table style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;width:100%;border-collapse:collapse">
  <tr><td style="padding:24px 28px 0">
    <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#16a34a;font-weight:500">FRC Technique</div>
    <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:#050608">Votre demande de devis a bien été reçue</h1>
  </td></tr>
  <tr><td style="padding:16px 28px">
    <p style="font-size:14px;line-height:1.6;margin:0">Bonjour ${escapeHtml(name)},</p>
    <p style="font-size:14px;line-height:1.6;margin:12px 0 0">Merci pour votre demande. Nous l'avons bien reçue et vous recontacterons sous <strong>48h ouvrées</strong> avec une proposition adaptée.</p>
  </td></tr>
  <tr><td style="padding:0 28px 16px">
    <div style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8d9297;margin-bottom:8px">Récapitulatif</div>
    ${renderItemsHtml(items)}
    <div style="margin-top:16px;padding:14px 16px;background:#050608;color:#ffffff">
      <span style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase">Sous-total estimé</span>
      <span style="font-size:20px;font-weight:700;float:right">${subtotal > 0 ? `${subtotal} €` : "Sur devis"}</span>
    </div>
  </td></tr>
  <tr><td style="padding:16px 28px 24px;border-top:1px solid #e5e7eb;font-size:12px;color:#374151">
    À bientôt,<br/><strong>L'équipe FRC Technique</strong><br/>
    <a href="mailto:${escapeHtml(company.email)}" style="color:#16a34a;text-decoration:none">${escapeHtml(
      company.email
    )}</a>
  </td></tr>
</table>
</body></html>`;

  await sendMail({
    to: email,
    replyTo: company.email,
    subject: "Votre demande de devis — FRC Technique",
    text: confirmText,
    html: confirmHtml,
  });

  return { ok: true };
}
