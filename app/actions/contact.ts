"use server";

import { company } from "@/lib/data";

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

  console.log("[FRC contact form]", {
    to: company.email,
    name,
    email,
    phone,
    subject,
    message,
    receivedAt: new Date().toISOString(),
  });

  return {
    status: "success",
    message:
      "Merci ! Nous avons bien reçu votre demande, un membre de l'équipe vous recontactera sous 24h ouvrées.",
  };
}
