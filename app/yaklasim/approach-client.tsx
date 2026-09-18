"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PageShell, useAtelierReveal } from "@/components/page-shell";
import type { SiteContent } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ApproachClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useAtelierReveal();
  const threadRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const thread = threadRef.current;
    const rail = railRef.current;
    if (!thread || !rail) return;
    const tween = gsap.fromTo(
      thread,
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: "top",
        ease: "none",
        scrollTrigger: {
          trigger: rail,
          start: "top 70%",
          end: "bottom 45%",
          scrub: 0.6,
        },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <PageShell
      scopeRef={scopeRef}
      eyebrow="yöntem"
      titleLines={["Mermer nasıl", "konuşur?"]}
      siteName={c.site.name}
      siteTitle={c.site.title}
    >
      {/* Intro line */}
      <section className="pb-24 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p
            data-reveal
            className="mx-auto max-w-xl font-serif text-base font-light italic leading-[2.1] text-[#e8e0d0]/45"
          >
            {c.approach.intro}
          </p>
        </div>
      </section>

      {/* Zigzag steps with scroll thread */}
      <section className="pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div ref={railRef} className="relative mx-auto max-w-3xl">
            {/* Track */}
            <div
              className="absolute left-1/2 top-0 bottom-0 hidden w-px -translate-x-1/2 bg-[#d4af37]/8 md:block"
              aria-hidden="true"
            />
            {/* Filling thread */}
            <div
              ref={threadRef}
              className="absolute left-1/2 top-0 bottom-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-[#d4af37]/70 to-[#d4af37]/20 md:block"
              aria-hidden="true"
            />

            <div className="space-y-24">
              {c.approach.principles.map((m, i) => (
                <div
                  key={i}
                  data-reveal
                  className={`relative md:flex ${
                    i % 2 === 0 ? "md:justify-start" : "md:justify-end"
                  }`}
                >
                  {/* Node dot */}
                  <span
                    className="absolute left-1/2 top-2 hidden h-2.5 w-2.5 -translate-x-1/2 rotate-45 border border-[#d4af37]/60 bg-[#0a0a0a] md:block"
                    aria-hidden="true"
                  />
                  <div
                    className={`md:w-[44%] ${
                      i % 2 === 0 ? "md:pr-4 md:text-right" : "md:pl-4"
                    }`}
                  >
                    <span className="font-serif text-6xl font-light italic leading-none text-[#d4af37]/15">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 font-serif text-2xl font-light italic text-[#e8e0d0]/85">
                      {m.title}
                    </h3>
                    <div
                      className={`mt-4 h-px w-12 bg-[#d4af37]/25 ${
                        i % 2 === 0 ? "md:ml-auto" : ""
                      }`}
                    />
                    <p className="mt-5 text-sm font-light leading-[2.1] text-[#e8e0d0]/40">
                      {m.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Frame + quote */}
      <section className="pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            data-reveal
            className="relative mx-auto max-w-2xl border border-[#d4af37]/15 p-12 text-center md:p-16"
          >
            <span className="absolute -top-px left-8 right-8 h-px bg-[#0a0a0a]" aria-hidden="true" />
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#0a0a0a] px-4 text-[8px] uppercase tracking-[0.5em] text-[#d4af37]/40">
              atölye ilkesi
            </span>
            <p className="font-serif text-xl font-light italic leading-[1.9] text-[#e8e0d0]/60">
              &ldquo;Yorum bir keski değil, bir el feneridir. Mermeri biz
              yontmayız, danışan kendi formunu görür.&rdquo;
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
