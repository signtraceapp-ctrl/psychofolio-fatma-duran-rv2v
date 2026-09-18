"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const SculptureScene = dynamic(
  () => import("./sculpture-scene").then((mod) => mod.SculptureScene),
  { ssr: false },
);

interface LazySculptureSceneProps {
  progressRef?: React.RefObject<number>;
}

export function LazySculptureScene({ progressRef }: LazySculptureSceneProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  if (reducedMotion) {
    return (
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-[#d4af37]/5 to-transparent"
        aria-hidden="true"
      />
    );
  }

  return <SculptureScene progressRef={progressRef} />;
}
