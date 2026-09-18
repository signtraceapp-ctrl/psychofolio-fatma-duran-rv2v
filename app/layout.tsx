import type { Metadata } from "next";
import { Inter, Cormorant } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-sans",
});

const cormorant = Cormorant({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
});

export function generateMetadata(): Metadata {
  return {
    title: { default: "Atelier Psykhe - Psikanalitik Psikoterapi", template: "%s | Atelier Psykhe" },
    description: "Psikanalitik ve psikodinamik yönelimli psikoterapi pratiği.",
    robots: { index: false, follow: false },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-screen bg-[#0a0a0a] text-[#e8e0d0] antialiased selection:bg-[#d4af37]/20">
        {children}
      </body>
    </html>
  );
}
