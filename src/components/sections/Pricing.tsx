import Reveal from "@/components/motion/Reveal";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { SectionProps } from "./types";

// FİYATLAR — yayına almadan önce gerçek rakamlarla değiştirilecek.
const pricingNote = "Fiyatlar örnektir; yayına almadan önce güncellenecek.";

const plans = [
  {
    name: "Başlangıç",
    price: "1.490",
    tagline: "Tek salon, küçük ekip",
    featured: false,
    features: [
      "Üye, randevu ve paket yönetimi",
      "2 eğitmen hesabı",
      "Ders takvimi ve kontenjan takibi",
      "Temel finans ekranı",
      "E-posta desteği",
    ],
  },
  {
    name: "Profesyonel",
    price: "2.490",
    tagline: "Büyüyen stüdyolar için",
    featured: true,
    features: [
      "Başlangıç paketindeki her şey",
      "Sınırsız eğitmen hesabı",
      "10 işletme raporunun tamamı",
      "Üyelik satışı ve taksitlendirme",
      "Eğitmen hakediş hesabı",
      "Otomatik SMS ve e-posta bildirimleri",
      "WhatsApp destek hattı",
    ],
  },
  {
    name: "Kurumsal",
    price: "Görüşelim",
    tagline: "Çok şubeli işletmeler",
    featured: false,
    features: [
      "Profesyonel paketteki her şey",
      "Şube bazlı ayrı paneller",
      "Rol ve yetki özelleştirmesi",
      "Veri taşıma ve kurulum desteği",
      "Öncelikli destek",
    ],
  },
];

export default function Pricing({ headingAs: Heading = "h2" }: SectionProps) {
  return (
    <section className="border-t border-line bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="hero-rise max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-[0.08em] text-lime-deep">Fiyatlar</span>
          <Heading className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Şeffaf fiyat, gizli kalem yok
          </Heading>
          <p className="mt-4 text-lg leading-8 text-quiet">
            Kurulum, veri taşıma ve eğitim her pakete dahildir. Aylık ödersiniz, taahhüt yoktur, istediğiniz ay bırakırsınız.
          </p>
          <p className="mt-4 inline-flex rounded-md border border-line-strong bg-sunken px-3 py-2 text-sm font-medium text-body">
            {pricingNote}
          </p>
        </div>

        <Reveal stagger className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={
                plan.featured
                  ? "relative flex flex-col rounded-xl border-2 border-ink bg-white p-7 shadow-lg shadow-black/10"
                  : "relative flex flex-col rounded-xl border border-line bg-sunken p-7"
              }
            >
              {plan.featured && (
                <span className="absolute -top-3 left-7 rounded-md bg-lime px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-ink">
                  En çok tercih edilen
                </span>
              )}

              <h3 className="text-xl font-semibold text-ink">{plan.name}</h3>
              <p className="mt-1 text-sm text-quiet">{plan.tagline}</p>

              <p className="mt-6 flex items-baseline gap-1.5">
                {plan.price === "Görüşelim" ? (
                  <span className="text-3xl font-semibold text-ink">Görüşelim</span>
                ) : (
                  <>
                    <span className="text-4xl font-semibold tracking-tight text-ink">₺{plan.price}</span>
                    <span className="text-sm font-medium text-quiet">/ ay</span>
                  </>
                )}
              </p>

              <ul className="mt-7 flex-1 space-y-3 border-t border-line pt-7">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm leading-6 text-body">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="/iletisim"
                className={
                  plan.featured
                    ? "mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ink px-6 text-base font-semibold text-white transition hover:bg-ink-hover"
                    : "mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-md border border-line-strong bg-white px-6 text-base font-semibold text-ink transition hover:border-ink"
                }
              >
                Bu paketi konuşalım
                <ArrowRight className="h-4 w-4" />
              </a>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
