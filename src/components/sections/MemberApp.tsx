import Reveal from "@/components/motion/Reveal";
import { ArrowRight, Smartphone, CalendarCheck, Wallet2, QrCode, BellDot, Palette } from "lucide-react";
import type { SectionProps } from "./types";

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
    icon: QrCode,
    title: "QR ile salona giriş",
    text: "Girişte kartla uğraşmak yok; üye uygulamadaki QR kodunu okutur, katılım otomatik işlenir.",
  },
  {
    icon: BellDot,
    title: "Hatırlatma bildirimleri",
    text: "Yaklaşan ders, biten paket ve doğum günü bildirimleri üyeye kendiliğinden gider.",
  },
  {
    icon: Palette,
    title: "Salonunuzun markasıyla",
    text: "Uygulama sizin logonuz ve renklerinizle çalışır. Üye başka bir markanın uygulamasını indirmez.",
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
              yarıya iner. Üye uygulaması, salonunuzun markasıyla iOS ve Android&apos;de çalışır; panelle
              aynı veriyi kullanır, ayrı bir sistem öğrenmeniz gerekmez.
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
