import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "./SignOutButton";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/admin/login");

  return (
    <div className="min-h-screen bg-light flex flex-col">
      <header className="bg-ink text-white">
        <div className="w-full px-5 md:px-8 flex items-center justify-between h-16">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/new logo frc.png"
              alt="FRC Technique"
              width={760}
              height={370}
              className="h-8 w-auto invert mix-blend-screen"
            />
            <span className="text-[11px] uppercase tracking-[0.22em] text-white/60 hidden sm:inline">
              Administration
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-[11px] uppercase tracking-[0.18em] text-white/70 hover:text-white transition-colors"
            >
              Voir le site ↗
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full px-5 md:px-8 py-10 md:py-14">{children}</main>
    </div>
  );
}
