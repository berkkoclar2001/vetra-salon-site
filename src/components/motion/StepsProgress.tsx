"use client";

import { useEffect, useRef } from "react";

/**
 * Numaralı adımları scroll'a bağlı dolan bir çizgiyle birleştirir.
 * Çocuklar `.step` ve içinde `.step-badge` taşır; çizginin ulaştığı adıma `data-active` konur.
 */
export default function StepsProgress({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const line = lineRef.current;
    if (!el || !line) return;
    const steps = Array.from(el.querySelectorAll<HTMLElement>(".step"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    const update = () => {
      frame = 0;
      const box = el.getBoundingClientRect();
      // Çizgi ilk rozetin merkezinden son rozetin merkezine uzanır.
      const centers = steps.map((step) => {
        const badge = step.querySelector<HTMLElement>(".step-badge")!.getBoundingClientRect();
        return { x: badge.left + badge.width / 2 - box.left, y: badge.top + badge.height / 2 - box.top };
      });
      if (centers.length < 2) return;
      const top = centers[0].y;
      const height = centers[centers.length - 1].y - top;
      line.style.left = `${centers[0].x - 1}px`;
      line.style.top = `${top}px`;
      line.style.height = `${height}px`;

      if (reduced) {
        steps.forEach((step) => step.setAttribute("data-active", ""));
        return;
      }
      // Çizginin başı ekranın %65'ini geçince dolmaya başlar; dolum noktası o hizayı takip eder.
      const progress = Math.min(Math.max((window.innerHeight * 0.65 - box.top - top) / height, 0), 1);
      el.style.setProperty("--p", progress.toFixed(3));
      steps.forEach((step, i) => step.toggleAttribute("data-active", progress >= (centers[i].y - top) / height - 0.001));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <span ref={lineRef} aria-hidden className="pointer-events-none absolute z-10 w-0.5 bg-ink-line">
        <span className="steps-fill absolute inset-0 bg-lime" />
      </span>
      {children}
    </div>
  );
}
