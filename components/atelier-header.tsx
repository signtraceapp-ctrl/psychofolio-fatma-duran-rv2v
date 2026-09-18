"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const leftLinks = [
  { label: "Hakkında", path: "/hakkimda" },
  { label: "Hizmetler", path: "/hizmetler" },
  { label: "Yaklaşım", path: "/yaklasim" },
] as const;

const rightLinks = [
  { label: "SSS", path: "/sss" },
  { label: "İletişim", path: "/iletisim" },
] as const;

const allLinks = [
  { label: "Ana Sayfa", path: "/" },
  ...leftLinks,
  ...rightLinks,
] as const;

function NavLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative py-2 text-[9px] font-light uppercase tracking-[0.35em] transition-colors duration-500 ${
        isActive
          ? "text-[#d4af37]"
          : "text-[#e8e0d0]/45 hover:text-[#e8e0d0]/90"
      }`}
    >
      {label}
      <span
        className={`absolute -bottom-0.5 left-1/2 h-px -translate-x-1/2 bg-[#d4af37]/70 transition-[width] duration-300 ${
          isActive ? "w-full" : "w-0 group-hover:w-full"
        }`}
        aria-hidden="true"
      />
    </Link>
  );
}

interface AtelierHeaderProps {
  siteName?: string;
  siteTitle?: string;
}

export function AtelierHeader({ siteName = "Atelier Psykhe", siteTitle = "psikanalitik psikoterapi" }: AtelierHeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > lastY.current && y > 160 && !menuOpen);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[transform,opacity] duration-300 ease-out ${
          hidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 border-b transition-[border-color,background-color,backdrop-filter] duration-300 ${
            scrolled
              ? "border-[#d4af37]/15 bg-[#0a0a0a]/80 backdrop-blur-md"
              : "border-transparent bg-gradient-to-b from-[#0a0a0a]/70 to-transparent"
          }`}
          aria-hidden="true"
        />

        <div className="relative mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6 lg:px-12">
          {/* Left links */}
          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Site menüsü sol"
          >
            {leftLinks.map((l) => (
              <NavLink
                key={l.path}
                href={l.path}
                label={l.label}
                isActive={isActive(l.path)}
              />
            ))}
          </nav>
          {/* Mobile: hamburger */}
          <button
            className="flex h-9 w-9 flex-col items-start justify-center gap-1.5 lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={menuOpen}
          >
            <span
              className={`h-px bg-[#d4af37]/80 transition-[width,transform] duration-300 ${
                menuOpen ? "w-6 translate-y-[3.5px] rotate-45" : "w-6"
              }`}
            />
            <span
              className={`h-px bg-[#d4af37]/80 transition-[width,transform] duration-300 ${
                menuOpen ? "w-6 -translate-y-[3px] -rotate-45" : "w-4"
              }`}
            />
          </button>

          {/* Center -- wordmark */}
          <Link
            href="/"
            className="group flex flex-col items-center px-6 text-center"
          >
            <span className="font-serif text-lg italic font-light tracking-[0.22em] text-[#e8e0d0]/90 transition-colors duration-500 group-hover:text-[#d4af37] sm:text-xl">
              {siteName}
            </span>
            <span className="mt-0.5 text-[6.5px] font-light uppercase tracking-[0.6em] text-[#d4af37]/40">
              {siteTitle}
            </span>
          </Link>

          {/* Right links + CTA */}
          <div className="hidden items-center justify-end gap-8 lg:flex">
            <nav
              className="flex items-center gap-8"
              aria-label="Site menüsü sağ"
            >
              {rightLinks.map((l) => (
                <NavLink
                  key={l.path}
                  href={l.path}
                  label={l.label}
                  isActive={isActive(l.path)}
                />
              ))}
            </nav>
            <Link
              href="/iletisim"
              className="border border-[#d4af37]/40 px-6 py-2.5 text-[8px] font-light uppercase tracking-[0.4em] text-[#d4af37]/90 transition-[border-color,background-color,color] duration-300 hover:border-[#d4af37] hover:bg-[#d4af37] hover:text-[#0a0a0a]"
            >
              Randevu Al
            </Link>
          </div>
          {/* Mobile spacer keeps wordmark centered */}
          <span className="lg:hidden" aria-hidden="true" />
        </div>

        {/* Gold hairline flourish */}
        <div
          className={`mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent transition-opacity duration-700 ${
            scrolled ? "opacity-0" : "opacity-100"
          }`}
          aria-hidden="true"
        />
      </header>

      {/* -- Mobile fullscreen menu ----------------------------------------- */}
      <div
        className={`fixed inset-0 z-30 flex flex-col items-center justify-center gap-2 bg-[#0a0a0a]/97 backdrop-blur-xl transition-opacity duration-300 lg:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        {allLinks.map((l, i) => (
          <Link
            key={l.path}
            href={l.path}
            onClick={() => setMenuOpen(false)}
            className={`py-3 font-serif text-2xl italic font-light tracking-wide transition-[color,transform,opacity] duration-300 ${
              isActive(l.path) ? "text-[#d4af37]" : "text-[#e8e0d0]/70"
            } ${
              menuOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: menuOpen ? `${120 + i * 60}ms` : "0ms" }}
          >
            {l.label}
          </Link>
        ))}
        <div
          className="mt-6 h-px w-16 bg-[#d4af37]/25"
          aria-hidden="true"
        />
        <p className="mt-4 text-[8px] uppercase tracking-[0.5em] text-[#d4af37]/35">
          {siteName}
        </p>
      </div>
    </>
  );
}
