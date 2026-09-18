"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AtelierHeader } from "./atelier-header";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* -- Shared reveal hook --------------------------------------------------- */
export function useAtelierReveal() {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 50,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-hairline]").forEach((el) => {
        gsap.from(el, {
          scaleX: 0,
          transformOrigin: "center",
          duration: 1.4,
          ease: "power3.inOut",
          scrollTrigger: { trigger: el, start: "top 92%" },
        });
      });
    }, scope);
    return () => ctx.revert();
  }, []);

  return scopeRef;
}

/* -- Shared page scaffold ------------------------------------------------- */
export function PageShell({
  eyebrow,
  titleLines,
  children,
  scopeRef,
  siteName,
  siteTitle,
}: {
  eyebrow: string;
  titleLines: [string, string?];
  children: React.ReactNode;
  scopeRef: React.RefObject<HTMLDivElement | null>;
  siteName?: string;
  siteTitle?: string;
}) {
  return (
    <div
      ref={scopeRef}
      className="min-h-screen bg-[#0a0a0a] font-sans text-[#e8e0d0] selection:bg-[#d4af37]/20"
    >
      <AtelierHeader siteName={siteName} siteTitle={siteTitle} />

      {/* Page hero */}
      <header className="relative overflow-hidden pt-44 pb-20 text-center">
        {/* Faint gold aura */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(212,175,55,0.07), transparent 65%)",
          }}
          aria-hidden="true"
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p
            data-reveal
            className="text-[9px] font-light uppercase tracking-[0.6em] text-[#d4af37]/50"
          >
            {eyebrow}
          </p>
          <h1
            data-reveal
            className="mt-6 font-serif text-4xl font-light italic leading-[1.15] tracking-tight text-[#e8e0d0]/90 sm:text-5xl md:text-6xl"
          >
            {titleLines[0]}
            {titleLines[1] && (
              <>
                <br />
                <span className="text-[#d4af37]">{titleLines[1]}</span>
              </>
            )}
          </h1>
          <div
            data-hairline
            className="mx-auto mt-10 h-px w-24 bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent"
          />
        </div>
      </header>

      {children}

      <footer className="border-t border-[#d4af37]/8 py-12 text-center">
        <p className="text-[8px] font-light uppercase tracking-[0.5em] text-[#e8e0d0]/20">
          {siteName || "Atelier Psykhe"} - {siteTitle || "psikanalitik psikoterapi"}
        </p>
      </footer>
    </div>
  );
}
