"use client";

import { useActionState, useState } from "react";
import { submitReview, type ReviewFormState } from "@/app/actions/reviews";

const initial: ReviewFormState = { status: "idle", message: "" };

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function ReviewForm() {
  const [state, action, pending] = useActionState(submitReview, initial);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  // À chaque soumission réussie, on remonte le formulaire (vide les champs)
  // et on réinitialise la note — sans effet, via le pattern « ajuster pendant le rendu ».
  const [prevState, setPrevState] = useState(state);
  const [resetKey, setResetKey] = useState(0);
  if (state !== prevState) {
    setPrevState(state);
    if (state.status === "success") {
      setRating(0);
      setHover(0);
      setResetKey((k) => k + 1);
    }
  }

  const inputBase =
    "bg-white border-rule text-ink placeholder:text-gray focus:border-ink";
  const labelBase =
    "text-[10px] font-medium uppercase tracking-[0.22em] text-ink";

  return (
    <form
      key={resetKey}
      action={action}
      className="flex flex-col gap-5"
      aria-describedby="review-form-status"
    >
      <input type="hidden" name="rating" value={rating} />

      <div className="flex flex-col gap-2">
        <span className={labelBase}>Votre note *</span>
        <div
          className="flex items-center gap-1 text-primary"
          role="radiogroup"
          aria-label="Note de 1 à 5 étoiles"
          onMouseLeave={() => setHover(0)}
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} étoile${value > 1 ? "s" : ""}`}
              onClick={() => setRating(value)}
              onMouseEnter={() => setHover(value)}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <Star filled={value <= (hover || rating)} />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="rf-name" className={labelBase}>
          Nom complet *
        </label>
        <input
          id="rf-name"
          name="name"
          type="text"
          required
          maxLength={80}
          autoComplete="name"
          placeholder="Jean Dupont"
          className={`border px-4 py-3.5 text-sm outline-none transition-colors ${inputBase}`}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="rf-quote" className={labelBase}>
          Votre avis *
        </label>
        <textarea
          id="rf-quote"
          name="quote"
          required
          rows={5}
          minLength={10}
          maxLength={1500}
          placeholder="Partagez votre expérience avec FRC Technique : accueil, formateurs, déroulé de la formation…"
          className={`border px-4 py-3.5 text-sm outline-none transition-colors resize-none ${inputBase}`}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn self-start hover:bg-primary-dark hover:border-primary-dark disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? "Envoi en cours…" : "Publier mon avis"}
        <span aria-hidden="true">→</span>
      </button>

      <p
        id="review-form-status"
        role="status"
        aria-live="polite"
        className={`text-xs uppercase tracking-wider ${
          state.status === "success"
            ? "text-emerald-500"
            : state.status === "error"
            ? "text-red-500"
            : "text-gray"
        }`}
      >
        {state.message ||
          "Champs * obligatoires · Votre avis sera publié après validation"}
      </p>
    </form>
  );
}
