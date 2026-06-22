import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  if (!host || !user || !pass) {
    console.warn(
      "[mailer] SMTP non configuré — SMTP_HOST/SMTP_USER/SMTP_PASSWORD manquant."
    );
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  return cachedTransporter;
}

export type SendMailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

export type SendMailResult = { ok: boolean; error?: string };

export async function sendMail(input: SendMailInput): Promise<SendMailResult> {
  const transporter = getTransporter();
  if (!transporter) {
    return { ok: false, error: "Service email indisponible." };
  }

  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER!;

  try {
    await transporter.sendMail({
      from,
      to: input.to,
      replyTo: input.replyTo,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });
    return { ok: true };
  } catch (err) {
    console.error("[mailer] sendMail error:", err);
    return { ok: false, error: "Envoi du message impossible." };
  }
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
