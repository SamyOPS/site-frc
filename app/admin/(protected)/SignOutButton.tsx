"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={loading}
      className="text-[11px] uppercase tracking-[0.18em] border border-white/30 px-3 py-1.5 text-white hover:bg-white hover:text-ink transition-colors disabled:opacity-60"
    >
      {loading ? "…" : "Déconnexion"}
    </button>
  );
}
