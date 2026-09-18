"use client";

import { PageShell, useAtelierReveal } from "@/components/page-shell";
import type { SiteContent } from "@/lib/content";

const timeline = [
  { year: "2012", title: "Psikoloji Lisansı", detail: "Klinik psikolojiye ilk adım, insan zihnine duyulan merakın resmiyet kazanması." },
  { year: "2015", title: "Klinik Psikoloji Yüksek Lisansı", detail: "Psikanalitik kuram üzerine tez çalışması ve ilk süpervizyonlu vakalar." },
  { year: "2018", title: "Psikanalitik Psikoterapi Formasyonu", detail: "Dört yıllık kuramsal eğitim, kişisel analiz ve yoğun süpervizyon süreci." },
  { year: "2021", title: "Özel Pratik: Atölyenin Kuruluşu", detail: "Kendi kliniğinde bireysel ve çift terapisi çalışmalarının başlaması." },
  { year: "2024", title: "Süpervizör & Eğitmen", detail: "Genç klinisyenlere süpervizyon; meslek içi eğitim ve seminerler." },
];

export function AboutClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useAtelierReveal();

  return (
    <PageShell
      scopeRef={scopeRef}
      eyebrow="biyografi"
      titleLines={["Heykeltıraşın", "hikayesi."]}
      siteName={c.site.name}
      siteTitle={c.site.title}
    >
      {/* Manifesto -- drop cap */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-reveal className="mx-auto max-w-2xl">
            <p className="font-serif text-lg font-light italic leading-[2.1] text-[#e8e0d0]/55 first-letter:float-left first-letter:mr-4 first-letter:mt-1 first-letter:font-serif first-letter:text-7xl first-letter:not-italic first-letter:leading-[0.8] first-letter:text-[#d4af37]">
              {c.about.intro}
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative mx-auto max-w-3xl">
            {/* Vertical gold spine */}
            <div
              className="absolute left-[27px] top-0 bottom-0 w-px bg-gradient-to-b from-[#d4af37]/40 via-[#d4af37]/15 to-transparent md:left-1/2"
              aria-hidden="true"
            />
            <div className="space-y-14">
              {(c.about.credentials.length > 0 ? c.about.credentials : timeline).map((t, i) => (
                <div
                  key={t.year || i}
                  data-reveal
                  className={`relative flex gap-8 md:w-1/2 ${
                    i % 2 === 0
                      ? "md:pr-14 md:text-right"
                      : "md:ml-auto md:flex-row-reverse md:pl-14 md:text-left"
                  }`}
                >
                  {/* Node */}
                  <div
                    className={`relative z-10 mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#d4af37]/25 bg-[#0a0a0a] ${
                      i % 2 === 0 ? "md:order-2 md:-mr-7" : "md:-ml-7"
                    }`}
                  >
                    <span className="font-serif text-xs italic text-[#d4af37]/80">
                      {t.year || String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  {/* Placard */}
                  <div className="border border-[#d4af37]/10 bg-[#111009]/60 p-6 backdrop-blur-[2px] transition-colors duration-500 hover:border-[#d4af37]/30">
                    <h3 className="font-serif text-lg font-light italic text-[#e8e0d0]/80">
                      {t.title}
                    </h3>
                    <p className="mt-2 text-xs font-light leading-[1.9] text-[#e8e0d0]/35">
                      {t.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Signature */}
      <section className="pb-28 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-reveal className="space-y-4">
            <div className="mx-auto h-px w-10 bg-[#d4af37]/25" />
            <p className="text-[9px] font-light uppercase tracking-[0.45em] text-[#d4af37]/40">
              {c.site.name}
            </p>
            <p className="text-[7.5px] font-light uppercase tracking-[0.4em] text-[#e8e0d0]/20">
              {c.site.title}
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
