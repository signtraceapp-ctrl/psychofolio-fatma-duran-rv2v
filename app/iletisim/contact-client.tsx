"use client";

import { useContactForm } from "@/lib/use-contact-form";

import { useState } from "react";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { PageShell, useAtelierReveal } from "@/components/page-shell";
import type { SiteContent } from "@/lib/content";

export function ContactClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useAtelierReveal();
  const [sent, setSent] = useState(false);

  return (
    <PageShell
      scopeRef={scopeRef}
      eyebrow="iletişim"
      titleLines={["Atölyeye", "yazın."]}
      siteName={c.site.name}
      siteTitle={c.site.title}
    >
      <section className="pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-4xl gap-14 md:grid-cols-[5fr_7fr]">
            {/* -- Left: museum label -- */}
            <div data-reveal className="space-y-10">
              <p className="font-serif text-base font-light italic leading-[2] text-[#e8e0d0]/45">
                {c.contact.intro}
              </p>

              <div className="space-y-6 border-l border-[#d4af37]/15 pl-6">
                {[
                  { icon: Mail, label: "e-posta", value: c.site.email },
                  { icon: Phone, label: "telefon", value: c.site.phone },
                  { icon: MapPin, label: "adres", value: c.site.address },
                  { icon: Clock, label: "görüşme saatleri", value: c.site.hours },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <item.icon
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#d4af37]/40"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-[8px] font-light uppercase tracking-[0.4em] text-[#d4af37]/35">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm font-light text-[#e8e0d0]/65">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[10px] font-light leading-[1.9] text-[#e8e0d0]/25">
                Acil bir kriz durumundaysanız lütfen 112&apos;yi arayın ya da en
                yakın acil servise başvurun; bu form acil müdahale için uygun
                değildir.
              </p>
            </div>

            {/* -- Right: underline form -- */}
            <div data-reveal>
              {sent ? (
                <div className="flex h-full min-h-[320px] flex-col items-center justify-center border border-[#d4af37]/20 p-10 text-center">
                  <span className="font-serif text-4xl italic text-[#d4af37]/70">&#10035;</span>
                  <p className="mt-6 font-serif text-xl font-light italic text-[#e8e0d0]/80">
                    Mesajınız atölyeye ulaştı.
                  </p>
                  <p className="mt-3 text-xs font-light leading-[1.9] text-[#e8e0d0]/35">
                    En geç iki iş günü içinde size dönüş yapılacak.
                  </p>
                </div>
              ) : (
                <form
                  className="space-y-9"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const ad = (form.elements.namedItem("ad") as HTMLInputElement)?.value ?? "";
                    const eposta = (form.elements.namedItem("eposta") as HTMLInputElement)?.value ?? "";
                    const konu = (form.elements.namedItem("konu") as HTMLInputElement)?.value ?? "";
                    const mesaj = (form.elements.namedItem("mesaj") as HTMLTextAreaElement)?.value ?? "";
                    const subject = encodeURIComponent(konu || "İletişim Formu");
                    const body = encodeURIComponent(`Ad: ${ad}\nE-posta: ${eposta}\n\n${mesaj}`);
                    window.location.href = `mailto:${c.site.email}?subject=${subject}&body=${body}`;
                    setSent(true);
                  }}
                >
                  {[
                    { id: "ad", label: c.contact.formName || "Adınız Soyadınız", type: "text" },
                    { id: "eposta", label: c.contact.formEmail || "E-posta adresiniz", type: "email" },
                    { id: "konu", label: c.contact.formSubject || "Görüşme konusu (isteğe bağlı)", type: "text" },
                  ].map((f) => (
                    <div key={f.id} className="group relative">
                      <input
                        id={f.id}
                        type={f.type}
                        required={f.id !== "konu"}
                        placeholder=" "
                        className="peer w-full border-b border-[#e8e0d0]/15 bg-transparent py-3.5 text-sm font-light text-[#e8e0d0]/80 outline-none transition-colors duration-500 focus:border-[#d4af37]/70"
                      />
                      <label
                        htmlFor={f.id}
                        className="pointer-events-none absolute left-0 top-3.5 text-sm font-light text-[#e8e0d0]/30 transition-[top,font-size,letter-spacing,color] duration-300 peer-focus:-top-3 peer-focus:text-[9px] peer-focus:uppercase peer-focus:tracking-[0.3em] peer-focus:text-[#d4af37]/60 peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.3em] peer-[:not(:placeholder-shown)]:text-[#d4af37]/60"
                      >
                        {f.label}
                      </label>
                    </div>
                  ))}

                  <div className="group relative">
                    <textarea
                      id="mesaj"
                      rows={4}
                      required
                      placeholder=" "
                      className="peer w-full resize-none border-b border-[#e8e0d0]/15 bg-transparent py-3.5 text-sm font-light text-[#e8e0d0]/80 outline-none transition-colors duration-500 focus:border-[#d4af37]/70"
                    />
                    <label
                      htmlFor="mesaj"
                      className="pointer-events-none absolute left-0 top-3.5 text-sm font-light text-[#e8e0d0]/30 transition-[top,font-size,letter-spacing,color] duration-300 peer-focus:-top-3 peer-focus:text-[9px] peer-focus:uppercase peer-focus:tracking-[0.3em] peer-focus:text-[#d4af37]/60 peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.3em] peer-[:not(:placeholder-shown)]:text-[#d4af37]/60"
                    >
                      {c.contact.formMessage || "Mesajınız"}
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="border border-[#d4af37]/50 px-12 py-4 text-[9px] font-light uppercase tracking-[0.4em] text-[#d4af37] transition-[background-color,color] duration-300 hover:bg-[#d4af37] hover:text-[#0a0a0a]"
                    >
                      {c.contact.formSubmit || "Mesajı Gönder"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
