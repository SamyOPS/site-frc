"use server";

import { company } from "@/lib/data";
import { escapeHtml, sendMail } from "@/lib/mailer";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return {
      status: "error",
      message: "Merci de renseigner votre nom, votre email et un message.",
    };
  }

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailValid) {
    return {
      status: "error",
      message: "L'adresse email semble invalide.",
    };
  }

  const subjectLine = subject
    ? `Site contact — ${subject}`
    : `Site contact — ${name}`;

  const text = `Nouveau message depuis le formulaire de contact frc-technique.fr.

Contact
-------
Nom      : ${name}
Email    : ${email}
${phone ? `Téléphone: ${phone}\n` : ""}${subject ? `Sujet    : ${subject}\n` : ""}
Message
-------
${message}
`;

  const html = `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f4f5f7;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#050608">
<table style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;width:100%;border-collapse:collapse">
  <tr><td style="padding:24px 28px 0">
    <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#16a34a;font-weight:500">FRC Technique · Contact</div>
    <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:#050608">Nouveau message</h1>
  </td></tr>
  <tr><td style="padding:20px 28px">
    <div style="background:#f4f5f7;border:1px solid #e5e7eb;padding:16px 18px">
      <div style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8d9297">Contact</div>
      <div style="margin-top:8px;font-size:14px"><strong>${escapeHtml(name)}</strong></div>
      <div style="margin-top:4px;font-size:13px">
        <a href="mailto:${escapeHtml(email)}" style="color:#16a34a;text-decoration:none">${escapeHtml(email)}</a>
        ${phone ? `&nbsp;·&nbsp;<a href="tel:${escapeHtml(phone)}" style="color:#050608;text-decoration:none">${escapeHtml(phone)}</a>` : ""}
      </div>
      ${
        subject
          ? `<div style="margin-top:8px;font-size:12px;color:#374151"><span style="color:#8d9297">Sujet :</span> ${escapeHtml(subject)}</div>`
          : ""
      }
    </div>
  </td></tr>
  <tr><td style="padding:0 28px 24px">
    <div style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8d9297;margin-bottom:8px">Message</div>
    <div style="background:#ffffff;border:1px solid #e5e7eb;padding:16px;font-size:14px;line-height:1.55;white-space:pre-wrap">${escapeHtml(
      message
    )}</div>
  </td></tr>
  <tr><td style="padding:16px 28px 24px;border-top:1px solid #e5e7eb;font-size:11px;color:#8d9297">
    Envoyé depuis frc-technique.fr · ${new Date().toLocaleString("fr-FR")}
  </td></tr>
</table>
</body></html>`;

  const result = await sendMail({
    to: company.email,
    replyTo: email,
    subject: subjectLine,
    text,
    html,
  });

  if (!result.ok) {
    return {
      status: "error",
      message:
        "Impossible d'envoyer votre message pour le moment. Merci de réessayer ou de nous écrire directement à " +
        company.email +
        ".",
    };
  }

  return {
    status: "success",
    message:
      "Merci ! Nous avons bien reçu votre demande, un membre de l'équipe vous recontactera sous 24h ouvrées.",
  };
}
