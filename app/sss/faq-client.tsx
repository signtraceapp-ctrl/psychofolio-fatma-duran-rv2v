"use client";

import { useState } from "react";
import { PageShell, useAtelierReveal } from "@/components/page-shell";
import type { SiteContent } from "@/lib/content";

export function FaqClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useAtelierReveal();
  const [open, setOpen] = useState<number>(-1);

  return (
    <PageShell
      scopeRef={scopeRef}
      eyebrow="soru defteri"
      titleLines={["Sorması", "en zor sorular."]}
      siteName={c.site.name}
      siteTitle={c.site.title}
    >
      <section className="pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            {c.faq.map((f, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  data-reveal
                  className="border-b border-[#d4af37]/10 first:border-t"
                >
                  <button
                    className="flex w-full items-center gap-6 py-8 text-left"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="w-8 shrink-0 font-serif text-sm italic text-[#d4af37]/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`flex-1 font-serif text-lg font-light italic transition-colors duration-500 sm:text-xl ${
                        isOpen ? "text-[#d4af37]" : "text-[#e8e0d0]/70"
                      }`}
                    >
                      {f.q}
                    </span>
                    <span
                      className={`relative h-4 w-4 shrink-0 transition-transform duration-500 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                      aria-hidden="true"
                    >
                      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#d4af37]/50" />
                      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#d4af37]/50" />
                    </span>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-500 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-8 pl-14 pr-10 text-sm font-light leading-[2.1] text-[#e8e0d0]/40">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            <p
              data-reveal
              className="mt-14 text-center text-xs font-light italic text-[#e8e0d0]/30"
            >
              Sorunuz burada yoksa{" "}
              <a href="/iletisim" className="text-[#d4af37]/70 hover:text-[#d4af37]">iletişim sayfasından</a>{" "}
              çekinmeden yazın.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
