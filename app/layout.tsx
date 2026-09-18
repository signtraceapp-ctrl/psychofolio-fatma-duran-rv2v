import type { Metadata } from "next";
import { Inter, Cormorant } from "next/font/google";
import "./globals.css";
import { getContent } from "@/lib/content";
import { generateJsonLd } from "@/lib/seo";

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
  const c = getContent();
  const seo = c.seo;
  const siteUrl = seo?.siteUrl || "";
  return {
    title: { default: `${c.site.name} - ${c.site.title}`, template: `%s | ${c.site.name}` },
    description: seo?.description || c.home.description,
    robots: { index: true, follow: true },
    ...(siteUrl && {
      metadataBase: new URL(siteUrl),
      alternates: { canonical: siteUrl },
      openGraph: {
        type: "website",
        title: `${c.site.name} - ${c.site.title}`,
        description: seo?.description || c.home.description,
        url: siteUrl,
        siteName: c.site.name,
      },
    }),
    other: {
      "geo.region": "TR",
      ...(seo?.location && { "geo.placename": seo.location }),
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-screen bg-[#0a0a0a] text-[#e8e0d0] antialiased selection:bg-[#d4af37]/20">
        {generateJsonLd().map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        {children}
      </body>
    </html>
  );
}
