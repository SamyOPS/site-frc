import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";

const barlow = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  weight: ["700", "800"],
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://frc-technique.fr"),
  title: {
    default: "FRC Technique — Formations CACES® & Prévention | Qualiopi",
    template: "%s | FRC Technique",
  },
  description:
    "Organisme de formation certifié Qualiopi pour les actions de formation, à Montataire (60), spécialisé dans les formations CACES® et la prévention des risques. CPF, OPCO, France Travail.",
  keywords: [
    "CACES",
    "formation",
    "Qualiopi",
    "Montataire",
    "Oise",
    "prévention",
    "sécurité",
    "R489",
    "R482",
    "R486",
    "SST",
  ],
  authors: [{ name: "FRC Technique" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "FRC Technique",
    title: "FRC Technique — Formations CACES® & Prévention",
    description:
      "Organisme de formation certifié Qualiopi spécialisé dans les CACES® et la prévention des risques.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${barlow.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-dark">
        <main className="flex-1">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
