import { ChevronDown } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import JsonLd from "@/components/seo/JsonLd";
import { faqJsonLd } from "@/lib/site";

type Props = {
  items: { q: string; a: string }[];
  eyebrow?: string;
  title?: string;
  className?: string;
};

/**
 * Sıkça sorulan sorular. `<details>` JavaScript'siz açılır; cevaplar HTML'de her zaman bulunur.
 * Görünür içerikle aynı veriden FAQPage şeması üretilir.
 */
export default function Faq({ items, eyebrow = "SSS", title = "Sıkça sorulan sorular", className = "bg-paper" }: Props) {
  return (
    <section className={`py-16 sm:py-20 ${className}`}>
      <JsonLd data={faqJsonLd(items)} />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8">
        <Reveal>
          <span className="text-sm font-semibold uppercase tracking-[0.08em] text-lime-deep">{eyebrow}</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h2>
        </Reveal>
        <Reveal stagger className="divide-y divide-line border-y border-line">
          {items.map((item) => (
            <details key={item.q} className="faq-item group">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5 text-left text-lg font-semibold text-ink [&::-webkit-details-marker]:hidden">
                <h3>{item.q}</h3>
                <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-quiet transition group-open:rotate-180" />
              </summary>
              <p className="-mt-1 pb-5 pr-9 leading-7 text-body">{item.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
