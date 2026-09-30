import Reveal from "@/components/motion/Reveal";
import { ArrowRight, Smartphone, CalendarCheck, Wallet2, CalendarX, BellDot, Building2 } from "lucide-react";
import type { SectionProps } from "./types";

/**
 * Yalnız App Store'daki uygulamada gerçekten olan özellikler yazılır (tek "Vetra" uygulaması, salona özel
 * marka veya QR giriş yok). Uygulamada olmayan bir iddia App Store incelemesinde tutarsızlık yaratır.
 */
const appFeatures = [
  {
    icon: CalendarCheck,
    title: "Dersini kendi seçer",
    text: "Üye müsait dersleri telefonundan tarar, kontenjan dolmadan yerini ayırır. Resepsiyon telefonu susar.",
  },
  {
    icon: Wallet2,
    title: "Paket bakiyesi cebinde",
    text: "Kaç dersi kaldığını, üyeliğinin ne zaman bittiğini ve ödeme geçmişini kendisi görür.",
  },
  {
    icon: CalendarX,
    title: "İptalini kendisi yapar",
    text: "Üye ayırttığı dersleri tek ekranda görür, sizin belirlediğiniz süre içinde iptal eder; hakkı paketine geri döner.",
  },
  {
    icon: BellDot,
    title: "Ders hatırlatması",
    text: "Yaklaşan dersin hatırlatması üyenin telefonuna gelir. Üye isterse ayarlardan kapatır.",
  },
  {
    icon: Building2,
    title: "Yalnız sizin salonunuz",
    text: "Üye ücretsiz Vetra uygulamasını indirir, sizin verdiğiniz bilgilerle girer ve yalnız sizin derslerinizi ve paketlerini görür.",
  },
];

export default function MemberApp({ headingAs: Heading = "h2" }: SectionProps) {
  return (
    <section className="border-t border-ink-line bg-ink py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="hero-rise">
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-lime">
              <Smartphone className="h-4 w-4" />
              Üye uygulaması
            </span>
            <Heading className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Salonun yükünü üyenin telefonuna aktarın
            </Heading>
            <p className="mt-5 text-lg leading-8 text-on-ink-muted">
              Rezervasyon, paket bakiyesi ve giriş takibi üyenin kendi elinde olduğunda resepsiyonun işi
              yarıya iner. Üyeleriniz Vetra uygulamasını iOS ve Android&apos;de ücretsiz indirir; uygulama
              panelle aynı veriyi kullanır, ayrı bir sistem öğrenmeniz gerekmez.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/iletisim"
                className="btn-shine inline-flex h-12 items-center justify-center gap-2 rounded-md bg-lime px-6 text-base font-semibold text-ink transition hover:bg-lime-hover"
              >
                Uygulamayı salonunuza bağlayalım
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>

          <Reveal stagger spotlight className="grid gap-3 sm:grid-cols-2">
            {appFeatures.map((feature) => (
              <article
                key={feature.title}
                className="spotlight rounded-lg border border-ink-line bg-ink-raised p-5 last:sm:col-span-2"
              >
                <feature.icon className="h-6 w-6 text-lime" />
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-on-ink-muted">{feature.text}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
