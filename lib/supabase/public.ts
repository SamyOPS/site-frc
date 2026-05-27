import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase "anonyme" sans cookies, pour les lectures publiques
 * (prix, sessions). N'opte pas la route en rendu dynamique → compatible ISR.
 * La RLS s'applique en tant qu'anon.
 */
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);
