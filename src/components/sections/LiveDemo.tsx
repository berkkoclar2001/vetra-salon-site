import { Check } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import LiveCalendarDemo from "@/components/home/LiveCalendarDemo";
import DetailLink from "./DetailLink";
import type { SectionProps } from "./types";

// Yalnız panelde karşılığı olan davranışlar (takvim görünümleri, kontenjan, seans hatırlatması).
const points = [
  "Günlük, haftalık ve aylık takvim görünümü",
  "Kontenjan ve katılım durumu randevuyla birlikte güncellenir",
  "Seans hatırlatması SMS veya e-postayla kendiliğinden gider",
];

/** Ana sayfada panelin nasıl kullanıldığını animasyonla gösteren bölüm. */
export default function LiveDemo({ headingAs: Heading = "h2" }: SectionProps) {
  return (
    <section className="border-b border-line bg-white py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <Reveal>
          <span className="text-sm font-semibold uppercase tracking-[0.08em] text-lime-deep">Canlı önizleme</span>
          <Heading className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Bir randevu, birkaç tıklama
          </Heading>
          <p className="mt-5 text-lg leading-8 text-quiet">
            Resepsiyonda üye beklerken defter karıştırmazsınız. Üyeyi seçer, seansı işaretlersiniz; randevu takvime düşer.
          </p>
          <ul className="mt-6 grid gap-3">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-body">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime text-ink">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <DetailLink href="/iletisim" className="mt-8">
            Salonunuz için teklif alın
          </DetailLink>
        </Reveal>

        <Reveal>
          <LiveCalendarDemo />
        </Reveal>
      </div>
    </section>
  );
}
