import Reveal from "@/components/motion/Reveal";
import { ArrowRight, CheckCircle2, Store } from "lucide-react";
import VitrinPreview from "@/components/home/VitrinPreview";
import type { SectionProps } from "./types";

const vitrinPoints = [
  {
    title: "Instagram bio'nuza koyacağınız tek link",
    text: "Butik salonların çoğunun web sitesi yok, tek dijital adresi Instagram hesabı. Vitrin tam o boşluğu doldurur.",
  },
  {
    title: "Ders programı panelden canlı gelir",
    text: "Takvimi ayrıca güncellemezsiniz. Panelde ne varsa vitrinde o görünür, kontenjan doldukça anında değişir.",
  },
  {
    title: "Ziyaretçi oradan rezervasyon yapar",
    text: "Uygulama indirmesine gerek kalmadan yerini ayırtır. Yeni üye için en kısa yol.",
  },
  {
    title: "Yol tarifi, WhatsApp ve Google yorumu",
    text: "Tek dokunuşla haritaya, mesaja ya da değerlendirme ekranına gider. Yorum toplamak kolaylaşır.",
  },
  {
    title: "Sizin logonuz, sizin renkleriniz",
    text: "Salon kuralları, fiyat listesi, iban gibi kendi içeriğinizi de ekleyebilirsiniz.",
  },
];

export default function VitrinSection({ headingAs: Heading = "h2" }: SectionProps) {
  return (
    <section className="border-t border-line bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hero-rise">
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-lime-deep">
              <Store className="h-4 w-4" />
              Vitrin
            </span>
            <Heading className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Web siteniz yoksa, vitrininiz var.
            </Heading>
            <p className="mt-5 text-lg leading-8 text-quiet">
              Vitrin, salonunuzun herkese açık tek sayfası. Panelde girdiğiniz bilgilerden kendiliğinden
              üretilir; ayrıca site yaptırmanız, güncellemeniz ya da hosting ödemeniz gerekmez.
            </p>

            <Reveal stagger className="mt-8 space-y-5">
              {vitrinPoints.map((point) => (
                <div key={point.title} className="flex gap-4">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-ink" />
                  <div>
                    <h3 className="font-semibold text-ink">{point.title}</h3>
                    <p className="mt-1 leading-7 text-quiet">{point.text}</p>
                  </div>
                </div>
              ))}
            </Reveal>

            <a
              href="/iletisim"
              className="mt-9 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ink px-6 text-base font-semibold text-white transition hover:bg-ink-hover"
            >
              Vitrininizi oluşturalım
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>

          <div style={{ "--d": "150ms" } as React.CSSProperties} className="hero-panel">
            <VitrinPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
