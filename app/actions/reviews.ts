"use server";

import { supabasePublic } from "@/lib/supabase/public";

export type ReviewFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function submitReview(
  _prev: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const quote = String(formData.get("quote") ?? "").trim();
  const rating = Number(formData.get("rating") ?? 0);

  if (!name || !quote) {
    return {
      status: "error",
      message: "Merci d'indiquer votre nom et votre avis.",
    };
  }

  if (name.length > 80) {
    return { status: "error", message: "Le nom est trop long (80 caractères max)." };
  }

  if (quote.length < 10 || quote.length > 1500) {
    return {
      status: "error",
      message: "Votre avis doit contenir entre 10 et 1500 caractères.",
    };
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { status: "error", message: "Merci de sélectionner une note de 1 à 5 étoiles." };
  }

  const { error } = await supabasePublic
    .from("reviews")
    .insert({ name, quote, rating, status: "pending" });

  if (error) {
    return {
      status: "error",
      message:
        "Impossible d'enregistrer votre avis pour le moment. Merci de réessayer plus tard.",
    };
  }

  return {
    status: "success",
    message:
      "Merci ! Votre avis a bien été envoyé. Il sera publié après validation par notre équipe.",
  };
}
