"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-ink text-white flex items-center justify-center px-5 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden="true" />
      <span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(22,163,74,0.18) 0%, transparent 55%)",
        }}
      />

      <div className="relative w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Image
            src="/new logo frc.png"
            alt="FRC Technique"
            width={760}
            height={370}
            priority
            className="h-14 w-auto invert mix-blend-screen"
          />
        </div>

        <div className="border border-white/15 bg-white/5 backdrop-blur-sm p-8">
          <p className="eyebrow text-primary">
            <span className="block w-8 h-px bg-primary" />
            Espace administration
          </p>
          <h1 className="mt-3 headline text-3xl text-white">Connexion</h1>
          <p className="mt-2 text-sm text-white/60 normal-case">
            Réservé à l&apos;administration du site.
          </p>

          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/70"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border border-white/15 px-4 py-3.5 text-sm text-white outline-none transition-colors focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/70"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border border-white/15 px-4 py-3.5 text-sm text-white outline-none transition-colors focus:border-primary"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 uppercase tracking-wider">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn mt-2 hover:bg-primary-dark hover:border-primary-dark disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
