import "server-only";

/** Délai minimum plausible entre l'ouverture du formulaire et l'envoi. */
const MIN_FILL_MS = 3000;
/** Nombre de liens dans le message au-delà duquel on considère du spam. */
const MAX_LINKS = 2;

const LINK_RE = /https?:\/\/|www\.|\[url|<a\s|\bhref=/gi;

/**
 * Détection heuristique de soumissions de bots, sans service externe :
 * - honeypot rempli (champ caché que seuls les bots remplissent) ;
 * - absence d'horodatage client / envoi trop rapide (bots sans JS ou instantanés) ;
 * - liens dans les champs d'identité (nom/sujet) ou trop de liens dans le message.
 */
export function looksLikeBot(opts: {
  honeypot?: string;
  ts?: number;
  now?: number;
  /** Corps de message : autorisé jusqu'à MAX_LINKS liens. */
  content?: string[];
  /** Champs courts (nom, sujet…) : aucun lien toléré. */
  identity?: string[];
}): boolean {
  // 1) Honeypot rempli → bot.
  if (opts.honeypot && opts.honeypot.trim() !== "") return true;

  // 2) Horodatage client requis + délai minimal (les bots postent le HTML brut
  //    sans exécuter le JS, donc sans horodatage, ou soumettent instantanément).
  const now = opts.now ?? Date.now();
  if (!opts.ts || !Number.isFinite(opts.ts)) return true;
  const elapsed = now - opts.ts;
  if (elapsed < MIN_FILL_MS) return true;

  // 3) Un lien dans un champ d'identité (nom, sujet) → bot.
  for (const field of opts.identity ?? []) {
    if (field && LINK_RE.test(field)) {
      LINK_RE.lastIndex = 0;
      return true;
    }
    LINK_RE.lastIndex = 0;
  }

  // 4) Trop de liens dans le message → spam.
  const joined = (opts.content ?? []).join("\n");
  const links = joined.match(LINK_RE);
  LINK_RE.lastIndex = 0;
  if (links && links.length > MAX_LINKS) return true;

  return false;
}
