import Reveal from "@/components/motion/Reveal";
import StepsProgress from "@/components/motion/StepsProgress";
import DetailLink from "./DetailLink";
import type { SectionProps } from "./types";

const workflow = [
  "Salona özel panel linki oluşturulur.",
  "Ekip üyeleri rolüne göre panele girer.",
  "Üyeler, paketler, seanslar ve ödemeler tek yerde takip edilir.",
  "Salon sahibi raporlardan kapasite ve gelir durumunu izler.",
];

export default function HowItWorks({ headingAs: Heading = "h2", detailHref }: SectionProps) {
  return (
    <section className="border-y border-ink-line bg-ink py-20 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        {/* Alt sayfada h1 olarak ilk ekrandaysa scroll beklemeden CSS ile girer. */}
        <Reveal className={Heading === "h1" ? "hero-rise" : undefined} variant={Heading === "h1" ? "" : undefined}>
          <span className="text-sm font-semibold uppercase tracking-[0.08em] text-lime">Salon linki modeli</span>
          <Heading className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
            Salonunuza özel link, ekibinize özel panel.
          </Heading>
          <p className="mt-5 text-lg leading-8 text-on-ink-muted">
            Vetra salonunuza ayrı bir panel bağlantısı verir. Ekibiniz bu bağlantıdan kendi hesabıyla girer; resepsiyon günlük işi yürütür, finans ve raporlar yalnız size açık kalır.
          </p>
          {detailHref && (
            <DetailLink href={detailHref} tone="dark" className="mt-8">
              Nasıl çalıştığını görün
            </DetailLink>
          )}
        </Reveal>

        <StepsProgress className="grid gap-3">
          {workflow.map((item, index) => (
            <div key={item} className="step flex items-start gap-4 rounded-lg border border-ink-line bg-ink-raised p-5">
              <span className="step-badge relative z-20 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-lime text-sm font-bold text-ink">
                {index + 1}
              </span>
              <p className="pt-1 text-lg text-on-ink">{item}</p>
            </div>
          ))}
        </StepsProgress>
      </div>
    </section>
  );
}
