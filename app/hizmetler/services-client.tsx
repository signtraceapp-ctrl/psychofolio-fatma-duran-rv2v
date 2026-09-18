"use client";

import { useState } from "react";
import { PageShell, useAtelierReveal } from "@/components/page-shell";
import type { SiteContent } from "@/lib/content";

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

export function ServicesClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useAtelierReveal();
  const [open, setOpen] = useState<number>(0);

  return (
    <PageShell
      scopeRef={scopeRef}
      eyebrow="sergi salonları"
      titleLines={["Dört salon,", "dört ayrı sessizlik."]}
      siteName={c.site.name}
      siteTitle={c.site.title}
    >
      <section className="pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {c.services.map((s, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  data-reveal
                  className={`group cursor-pointer border-b border-[#d4af37]/10 transition-colors duration-700 first:border-t ${
                    isOpen ? "bg-[#111009]/70" : "hover:bg-[#111009]/40"
                  }`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setOpen(isOpen ? -1 : i);
                    }
                  }}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-8 px-6 py-10 md:px-12">
                    {/* Roman numeral */}
                    <span
                      className={`w-16 shrink-0 font-serif text-5xl font-light italic transition-colors duration-700 ${
                        isOpen ? "text-[#d4af37]/80" : "text-[#d4af37]/20 group-hover:text-[#d4af37]/45"
                      }`}
                    >
                      {ROMAN[i] || String(i + 1)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3
                        className={`font-serif text-xl font-light italic transition-colors duration-700 sm:text-2xl ${
                          isOpen ? "text-[#e8e0d0]/95" : "text-[#e8e0d0]/65"
                        }`}
                      >
                        {s.title}
                      </h3>
                      <p className="mt-1.5 text-[8px] font-light uppercase tracking-[0.4em] text-[#d4af37]/35">
                        {s.method}
                      </p>
                    </div>
                    <span className="hidden shrink-0 text-[9px] font-light uppercase tracking-[0.3em] text-[#e8e0d0]/25 sm:block">
                      {s.duration}
                    </span>
                    {/* Plus / minus */}
                    <span
                      className={`relative h-5 w-5 shrink-0 transition-transform duration-700 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                      aria-hidden="true"
                    >
                      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#d4af37]/60" />
                      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#d4af37]/60" />
                    </span>
                  </div>
                  {/* Expanding gallery floor */}
                  <div
                    className="grid transition-[grid-template-rows] duration-700 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-10 md:px-12 md:pl-36">
                        <div className="mb-6 h-px w-16 bg-[#d4af37]/20" />
                        <p className="max-w-xl text-sm font-light leading-[2.1] text-[#e8e0d0]/40">
                          {s.desc}
                        </p>
                        <p className="mt-4 text-[9px] font-light uppercase tracking-[0.3em] text-[#e8e0d0]/25 sm:hidden">
                          {s.duration}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <p
              data-reveal
              className="mt-14 text-center text-[9px] font-light uppercase tracking-[0.4em] text-[#e8e0d0]/20"
            >
              tüm salonlar randevu ile gezilir
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
