import { BarChart3 } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import DetailLink from "./DetailLink";
import type { SectionProps } from "./types";

// Panelde birebir karşılığı olan on rapor ekranı (src/app/dashboard/reports).
const reportItems = [
  "Üye raporları",
  "Finans raporları",
  "Ajanda ve yoğunluk",
  "Kapasite takibi",
  "Rezervasyonlar",
  "Borç listesi",
  "Eğitmen performansı",
  "Dondurulan üyelikler",
  "Üyelik analizi",
  "Eğitmen hakedişi",
];

// Yalnız görsel: haftanın en yoğun günü vurgulanır, sayı gösterilmez.
const weekLoad = [
  { day: "Pzt", value: 58 },
  { day: "Sal", value: 72 },
  { day: "Çar", value: 64 },
  { day: "Per", value: 86 },
  { day: "Cum", value: 100 },
  { day: "Cmt", value: 76 },
  { day: "Paz", value: 34 },
];

export default function Reports({ headingAs: Heading = "h2", detailHref }: SectionProps) {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
        {/* Alt sayfada h1 olarak ilk ekrandaysa scroll beklemeden CSS ile girer. */}
        <Reveal className={Heading === "h1" ? "hero-rise" : undefined} variant={Heading === "h1" ? "" : undefined}>
          <span className="text-sm font-semibold uppercase tracking-[0.08em] text-lime-deep">Karar ekranları</span>
          <Heading className="mt-3 text-3xl font-semibold tracking-normal text-ink sm:text-4xl">
            Sadece kayıt tutan değil, salon sahibine işaret veren panel
          </Heading>
          <p className="mt-5 text-lg leading-8 text-quiet">
            Raporlar, salon sahibinin en yoğun saatleri, tahsilat durumunu, eğitmen performansını ve üyelik hareketlerini daha hızlı görmesi için tasarlanır.
          </p>
          {detailHref && <DetailLink href={detailHref} className="mt-8">Raporları inceleyin</DetailLink>}
        </Reveal>

        <Reveal className="rounded-lg border border-line bg-sunken p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-quiet">Rapor merkezi</p>
              <h3 className="text-2xl font-semibold text-ink">Takip edilen başlıklar</h3>
            </div>
            <BarChart3 className="h-8 w-8 text-ink" />
          </div>
          <div className="mb-4 rounded-md border border-line bg-white px-4 pb-3 pt-4">
            <p className="text-xs font-medium text-quiet">Haftalık yoğunluk</p>
            <Reveal variant="bars-reveal" aria-hidden className="mt-3 flex h-20 items-end gap-2">
              {weekLoad.map((d) => (
                <span
                  key={d.day}
                  style={{ height: `${d.value}%` }}
                  className={`flex-1 rounded-sm ${d.value === 100 ? "bg-lime" : "bg-line-strong"}`}
                />
              ))}
            </Reveal>
            <div aria-hidden className="mt-2 flex gap-2">
              {weekLoad.map((d) => (
                <span key={d.day} className="flex-1 text-center text-[11px] text-quiet">{d.day}</span>
              ))}
            </div>
          </div>
          <Reveal stagger className="grid gap-3 sm:grid-cols-2">
            {reportItems.map((item) => (
              <div key={item} className="rounded-md border border-line bg-white px-4 py-3 text-sm font-medium text-body">
                {item}
              </div>
            ))}
          </Reveal>
        </Reveal>
      </div>
    </section>
  );
}
