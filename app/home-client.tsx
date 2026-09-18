"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LazySculptureScene } from "@/components/three/lazy-sculpture-scene";
import { AtelierHeader } from "@/components/atelier-header";
import type { SiteContent } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* -- Sculpting phases ----------------------------------------------------- */
const sculptingPhases = [
  {
    num: "I",
    title: "İlk Çatlak",
    subtitle: "ilk seans",
    description:
      "Mermer blok ilk kez kırılır. Terapist ve danışan arasındaki güvene dayalı ilk temas. Yüzeyin altındaki form henüz belirsizdir, ama cesaret edilmiştir.",
    isEntrance: true,
  },
  {
    num: "II",
    title: "Kaba Yontu",
    subtitle: "derin çalışma",
    description:
      "Fazlalıklar uzaklaşır. Bilinçdışı kalıplar, savunma mekanizmaları ve tekrarlayan örüntüler ortaya çıkar. Heykeltıraşın eli kararlıdır.",
  },
  {
    num: "III",
    title: "Cila",
    subtitle: "entegrasyon",
    description:
      "İçgörüler yaşama entegre edilir. Danışan kendi formunu keşfeder ve onu sahiplenir. Mermer artık ışık tutar.",
    isFinal: true,
  },
] as const;

const metrics = [
  { val: "12+", label: "Yıl Klinik Deneyim" },
  { val: "4500+", label: "Tamamlanmış Seans" },
  { val: "8+", label: "Akademik Yayın" },
  { val: "%100", label: "Etik Taahhüt" },
];

/* -- Main Component ------------------------------------------------------- */
export function HomeClient({ content: c }: { content: SiteContent }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [activePhase, setActivePhase] = useState(0);

  const handleJourneyUpdate = useCallback((self: ScrollTrigger) => {
    const phase = Math.min(2, Math.floor(self.progress * 3));
    setActivePhase(phase);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const journeyTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      pin: pin,
      scrub: 1,
      onUpdate: handleJourneyUpdate,
    });

    const pageTrigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    const reveals: gsap.core.Tween[] = [];
    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
      reveals.push(
        gsap.from(el, {
          opacity: 0,
          y: 70,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 86%",
          },
        }),
      );
    });

    return () => {
      journeyTrigger.kill();
      pageTrigger.kill();
      reveals.forEach((r) => {
        r.scrollTrigger?.kill();
        r.kill();
      });
    };
  }, [handleJourneyUpdate]);

  return (
    <div className="bg-[#0a0a0a] text-[#e8e0d0] selection:bg-[#d4af37]/20 min-h-screen font-sans">
      {/* SITE HEADER */}
      <AtelierHeader siteName={c.site.name} siteTitle={c.site.title} />

      {/* FIXED 3D STAGE -- lives behind the ENTIRE page */}
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <LazySculptureScene progressRef={progressRef} />
        {/* Global vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.7)_100%)]" />
      </div>

      {/* SCROLL-PINNED 3D JOURNEY */}
      <section
        ref={sectionRef}
        className="relative z-10"
        style={{ height: "400vh" }}
        aria-label="Heykel galerisi yolculuğu"
      >
        <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
          {/* Left readability gradient */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-[#0a0a0a]/20 to-transparent"
            aria-hidden="true"
          />

          {/* Phase text overlay */}
          <div className="absolute inset-0 flex items-center z-10">
            <div className="mx-auto w-full max-w-7xl px-8 lg:px-16">
              <div className="max-w-xl">
                {/* Entrance hero -- always visible at phase 0 */}
                <div
                  className="absolute transition-[opacity,transform] duration-300 ease-out"
                  style={{
                    opacity: activePhase === 0 ? 1 : 0,
                    transform:
                      activePhase === 0 ? "translateY(0)" : "translateY(-60px)",
                    pointerEvents: activePhase === 0 ? "auto" : "none",
                  }}
                >
                  <p className="text-[8px] tracking-[0.6em] uppercase text-[#d4af37]/50 font-light mb-8">
                    {c.site.name}
                  </p>
                  <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-light tracking-tight text-[#e8e0d0]/90 leading-[1.1] italic">
                    {c.home.headline}
                    <br />
                    {c.home.headlineSuffix}{" "}
                    <span className="text-[#d4af37] not-italic font-normal">
                      {c.home.headlineAccent}
                    </span>
                  </h1>
                  <p className="mt-8 max-w-md text-sm leading-[2] text-[#e8e0d0]/40 font-light">
                    {c.home.description}
                  </p>
                  <div className="mt-10">
                    <a
                      href="/iletisim"
                      className="inline-block rounded-none px-12 py-3 text-[9px] font-light uppercase tracking-[0.4em] bg-[#d4af37]/90 text-[#0a0a0a] hover:bg-[#d4af37] border-0 transition-[background-color] duration-300"
                    >
                      {c.home.cta}
                    </a>
                  </div>
                </div>

                {/* Sculpting phases -- 1 & 2 */}
                {sculptingPhases.slice(1).map((phase, idx) => {
                  const phaseIdx = idx + 1;
                  return (
                    <div
                      key={phaseIdx}
                      className="absolute transition-[opacity,transform] duration-300 ease-out"
                      style={{
                        opacity: activePhase === phaseIdx ? 1 : 0,
                        transform:
                          activePhase === phaseIdx
                            ? "translateY(0)"
                            : activePhase > phaseIdx
                              ? "translateY(-60px)"
                              : "translateY(60px)",
                        pointerEvents:
                          activePhase === phaseIdx ? "auto" : "none",
                      }}
                    >
                      {/* Museum placard */}
                      <div className="border-l-[1px] border-[#d4af37]/20 pl-8">
                        <div className="flex items-baseline gap-5 mb-6">
                          <span className="text-4xl font-serif italic text-[#d4af37]/30 font-light">
                            {phase.num}
                          </span>
                          <div>
                            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl italic text-[#e8e0d0]/80 font-light tracking-tight">
                              {phase.title}
                            </h2>
                            <p className="text-[8px] tracking-[0.5em] uppercase text-[#d4af37]/40 mt-2">
                              {phase.subtitle}
                            </p>
                          </div>
                        </div>
                        <div className="w-12 h-px bg-[#d4af37]/15 mb-6" />
                        <p className="text-sm text-[#e8e0d0]/40 leading-[2.2] font-light max-w-md">
                          {phase.description}
                        </p>

                        {"isFinal" in phase && phase.isFinal && (
                          <div className="mt-10 flex gap-4">
                            <a
                              href="/iletisim"
                              className="inline-block rounded-none px-10 py-3 text-[9px] font-light uppercase tracking-[0.4em] bg-[#d4af37]/90 text-[#0a0a0a] hover:bg-[#d4af37] border-0 transition-[background-color] duration-300"
                            >
                              Randevu Al
                            </a>
                            <a
                              href="/hizmetler"
                              className="inline-block rounded-none px-8 py-3 text-[9px] font-light uppercase tracking-[0.3em] text-[#d4af37]/60 hover:text-[#d4af37] hover:bg-[#d4af37]/5 transition-[color,background-color] duration-300"
                            >
                              Hizmetler
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Phase indicator -- right side */}
          <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex z-10">
            {sculptingPhases.map((phase, idx) => (
              <button
                key={idx}
                className="group flex items-center gap-3 transition-opacity duration-300"
                aria-label={phase.title}
              >
                <span
                  className="text-[7px] tracking-[0.3em] uppercase transition-opacity duration-300"
                  style={{
                    opacity: activePhase === idx ? 0.5 : 0,
                    color: "#d4af37",
                  }}
                >
                  {phase.num}
                </span>
                <div
                  className="transition-[height,background-color,box-shadow] duration-300"
                  style={{
                    width: "1px",
                    height: activePhase === idx ? "40px" : "16px",
                    backgroundColor:
                      activePhase === idx ? "#d4af37" : "rgba(212,175,55,0.15)",
                    boxShadow:
                      activePhase === idx
                        ? "0 0 12px 2px rgba(212,175,55,0.2)"
                        : "none",
                  }}
                />
              </button>
            ))}
          </div>

          {/* Scroll hint */}
          <div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 transition-opacity duration-1000 z-10"
            style={{ opacity: activePhase === 0 ? 0.35 : 0 }}
          >
            <div className="flex flex-col items-center gap-3 text-[#d4af37]/40">
              <span className="text-[8px] uppercase tracking-[0.5em]">
                Aşağı kaydır
              </span>
              <div className="h-10 w-px animate-pulse bg-gradient-to-b from-[#d4af37]/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES -- Gallery Wall */}
      <section className="py-32 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-20" data-reveal>
            <div className="text-center space-y-4">
              <p className="text-[8px] tracking-[0.6em] uppercase text-[#d4af37]/40 font-light">
                terapi kataloğu
              </p>
              <h2 className="font-serif text-3xl md:text-4xl italic font-light text-[#e8e0d0]/70 tracking-tight">
                Hizmetler
              </h2>
              <div className="w-12 h-px bg-[#d4af37]/15 mx-auto mt-6" />
            </div>

            <div className="space-y-0">
              {c.services.map((s, i) => (
                <div
                  key={i}
                  className="py-12 border-b border-[#d4af37]/8 first:border-t group bg-[#0a0a0a]/35 backdrop-blur-[1px] px-6 -mx-6"
                >
                  <div className="flex justify-between items-baseline mb-5">
                    <h3 className="font-serif text-xl md:text-2xl italic text-[#e8e0d0]/70 font-light group-hover:text-[#d4af37]/70 transition-colors duration-700">
                      {s.title}
                    </h3>
                    <span className="text-[8px] tracking-[0.4em] uppercase text-[#d4af37]/25 shrink-0 ml-4">
                      {s.duration}
                    </span>
                  </div>
                  <p className="text-xs text-[#e8e0d0]/35 leading-[2] font-light max-w-lg">
                    {s.desc}
                  </p>
                  <p className="text-[7px] tracking-[0.4em] uppercase text-[#e8e0d0]/15 mt-3">
                    {s.method}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* METRICS -- Museum Label Strip */}
      <section className="py-20 border-y border-[#d4af37]/8 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 max-w-3xl mx-auto"
            data-reveal
          >
            {metrics.map((m, i) => (
              <div key={i} className="text-center space-y-3">
                <p className="text-3xl font-serif italic text-[#d4af37]/80 font-light">
                  {m.val}
                </p>
                <p className="text-[7px] tracking-[0.5em] uppercase text-[#e8e0d0]/25 font-light">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHILOSOPHY QUOTE */}
      <section className="py-32 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="mx-auto max-w-2xl text-center space-y-8"
            data-reveal
          >
            <p className="text-[8px] tracking-[0.6em] uppercase text-[#d4af37]/30 font-light">
              terapi felsefesi
            </p>
            <blockquote className="font-serif text-xl md:text-2xl italic text-[#e8e0d0]/50 font-light leading-[1.8]">
              &ldquo;{c.home.quote}&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-px bg-[#d4af37]/20" />
              <p className="text-[8px] tracking-[0.4em] uppercase text-[#d4af37]/30">
                {c.home.quoteAuthor}
              </p>
              <div className="w-8 h-px bg-[#d4af37]/20" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 border-t border-[#d4af37]/8 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center space-y-8" data-reveal>
            <p className="text-[8px] tracking-[0.6em] uppercase text-[#d4af37]/40 font-light">
              başvuru
            </p>
            <h2 className="font-serif text-3xl md:text-4xl italic font-light text-[#e8e0d0]/70 tracking-tight">
              Süreci Başlatmaya
              <br />
              Hazır mısınız?
            </h2>
            <p className="text-xs text-[#e8e0d0]/30 leading-[2] font-light max-w-sm mx-auto">
              İlk görüşme, birbirimizi tanıyacağımız ve ihtiyaçlarınızı
              birlikte değerlendirdiğimiz bir ön değerlendirme seansıdır.
            </p>
            <div className="pt-4">
              <a
                href="/iletisim"
                className="inline-block rounded-none px-14 py-4 text-[9px] font-light uppercase tracking-[0.4em] bg-[#d4af37]/90 text-[#0a0a0a] hover:bg-[#d4af37] border-0 transition-[background-color] duration-300"
              >
                Ön Görüşme Talep Et
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CREDENTIALS STRIP */}
      <section className="py-14 border-t border-[#d4af37]/8 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="flex flex-wrap justify-center gap-10 md:gap-16"
            data-reveal
          >
            {[
              "TPD ÜYELİĞİ",
              "PSİKANALİZ DERNEĞİ",
              "ISST AKREDİTASYON",
              "PSİKANALİST SERTİFİKA",
            ].map((label, i) => (
              <span
                key={i}
                className="text-[7px] tracking-[0.5em] uppercase text-[#e8e0d0]/15 font-light"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#d4af37]/8 py-12 text-center relative z-10">
        <p className="text-[8px] font-light uppercase tracking-[0.5em] text-[#e8e0d0]/20">
          {c.site.name} - {c.site.title}
        </p>
        <p className="mt-2 text-[7px] font-light uppercase tracking-[0.4em] text-[#e8e0d0]/10">
          &copy; {new Date().getFullYear()} {c.site.copyright}
        </p>
      </footer>
    </div>
  );
}
