"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Masque le chrome public (footer, back-to-top) sur les routes /admin.
 * Reçoit les composants serveur en `children` et les cache si besoin.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
