"use client";

import { useActionState } from "react";
import { submitContact, type ContactFormState } from "@/app/actions/contact";

const initial: ContactFormState = { status: "idle", message: "" };

type Props = {
  variant?: "light" | "dark";
};

export function ContactForm({ variant = "dark" }: Props) {
  const [state, action, pending] = useActionState(submitContact, initial);
  const isDark = variant === "dark";

  const inputBase = isDark
    ? "bg-white/5 border-white/15 text-white placeholder:text-white/45 focus:bg-white/10 focus:border-primary"
    : "bg-white border-rule text-ink placeholder:text-gray focus:border-ink";

  const labelBase = isDark ? "text-white/70" : "text-ink";

  return (
    <form
      action={action}
      className="flex flex-col gap-5"
      aria-describedby="contact-form-status"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="cf-name"
            className={`text-[10px] font-medium uppercase tracking-[0.22em] ${labelBase}`}
          >
            Nom complet *
          </label>
          <input
            id="cf-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Jean Dupont"
            className={`border px-4 py-3.5 text-sm outline-none transition-colors ${inputBase}`}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="cf-email"
            className={`text-[10px] font-medium uppercase tracking-[0.22em] ${labelBase}`}
          >
            Email *
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="jean@entreprise.fr"
            className={`border px-4 py-3.5 text-sm outline-none transition-colors ${inputBase}`}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="cf-phone"
            className={`text-[10px] font-medium uppercase tracking-[0.22em] ${labelBase}`}
          >
            Téléphone
          </label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="06 12 34 56 78"
            className={`border px-4 py-3.5 text-sm outline-none transition-colors ${inputBase}`}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="cf-subject"
            className={`text-[10px] font-medium uppercase tracking-[0.22em] ${labelBase}`}
          >
            Sujet
          </label>
          <select
            id="cf-subject"
            name="subject"
            defaultValue="CACES R489"
            className={`border px-4 py-3.5 text-sm outline-none transition-colors ${inputBase}`}
          >
            <option>CACES R489</option>
            <option>CACES R482</option>
            <option>CACES R486</option>
            <option>Autre CACES®</option>
            <option>SST / Prévention</option>
            <option>Habilitations électriques</option>
            <option>Devis intra-entreprise</option>
            <option>Autre demande</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="cf-message"
          className={`text-[10px] font-medium uppercase tracking-[0.22em] ${labelBase}`}
        >
          Votre message *
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={5}
          placeholder="Décrivez votre besoin, le nombre de stagiaires, le financement envisagé..."
          className={`border px-4 py-3.5 text-sm outline-none transition-colors resize-none ${inputBase}`}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn self-start hover:bg-primary-dark hover:border-primary-dark disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? "Envoi en cours…" : "Envoyer ma demande"}
        <span aria-hidden="true">→</span>
      </button>

      <p
        id="contact-form-status"
        role="status"
        aria-live="polite"
        className={`text-xs uppercase tracking-wider ${
          state.status === "success"
            ? "text-emerald-400"
            : state.status === "error"
            ? "text-red-400"
            : isDark
            ? "text-white/50"
            : "text-gray"
        }`}
      >
        {state.message ||
          "Champs * obligatoires · Réponse sous 24h ouvrées"}
      </p>
    </form>
  );
}
