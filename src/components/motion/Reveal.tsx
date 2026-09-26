"use client";

import { useEffect, useRef, type ElementType, type HTMLAttributes, type PointerEvent } from "react";

type Props = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  /** Kendisi yerine doğrudan çocuklarını 70ms arayla getirir (kart gridleri). */
  stagger?: boolean;
  /** Çocuklardaki `.spotlight` kartlarına imleç konumunu yazar. */
  spotlight?: boolean;
  /** Varsayılan sınıf yerine özel bir giriş sınıfı (ör. `bars-reveal`). */
  variant?: string;
};

// En uzun sıralı giriş: 630ms gecikme + 600ms geçiş. Sonra data-revealed ile geçiş kuralları kalkar.
const SETTLE_MS = 1300;

/**
 * Görünür alana girince bir kez `data-inview` koyar; görünüm globals.css'teki `.reveal*` kurallarından gelir.
 * İçerik sunucuda render edilir; JS yoksa ya da hareket azaltılmışsa gizlenmez.
 */
export default function Reveal({ as: Tag = "div", stagger, spotlight, variant, className = "", onPointerMove, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.setAttribute("data-inview", "");
        timer = setTimeout(() => el.setAttribute("data-revealed", ""), SETTLE_MS);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    onPointerMove?.(event);
    const card = (event.target as HTMLElement).closest<HTMLElement>(".spotlight");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    card.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }

  const motionClass = variant ?? (stagger ? "reveal-stagger" : "reveal");

  return (
    <Tag
      ref={ref}
      className={`${motionClass} ${className}`}
      onPointerMove={spotlight ? handlePointerMove : onPointerMove}
      {...rest}
    />
  );
}
