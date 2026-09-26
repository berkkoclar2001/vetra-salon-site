import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import PanelShot from "@/components/home/PanelShot";

const headline = "Spor salonu ve pilates stüdyoları için üye takip programı";

/** Hero öğeleri sırayla gelir (globals.css `.hero-rise`); gecikme --d ile verilir. */
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-ink">
      <div className="absolute inset-x-0 bottom-0 h-[32%] bg-paper" />
      <div className="mx-auto grid min-h-[min(calc(100vh-64px),880px)] max-w-7xl content-end px-4 pb-8 pt-12 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-4xl pb-8">
          <div style={delay(0)} className="hero-rise mb-5 inline-flex items-center gap-2 rounded-full border border-ink-line bg-ink-raised px-3 py-1 text-sm font-medium text-on-ink">
            <Sparkles className="h-4 w-4 text-lime" />
            Vetra Salon Yönetim Paneli
          </div>
          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {headline.split(" ").map((word, i) => (
              <span key={i}>
                <span style={delay(60 + i * 35)} className="hero-rise hero-word">
                  {word}
                </span>{" "}
              </span>
            ))}
          </h1>
          <p style={delay(380)} className="hero-rise mt-5 max-w-2xl text-lg leading-8 text-on-ink-muted sm:text-xl">
            Üye, randevu, paket, tahsilat ve raporlar tek panelde. Pilates, yoga, fitness ve butik ders stüdyoları için; her salon kendi özel panel linkiyle çalışır.
          </p>
          <div style={delay(460)} className="hero-rise mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/iletisim"
              className="btn-shine inline-flex h-12 items-center justify-center gap-2 rounded-md bg-lime px-6 text-base font-semibold text-ink shadow-sm transition hover:bg-lime-hover"
            >
              Salonunuz İçin Teklif Alın
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/ozellikler"
              className="inline-flex h-12 items-center justify-center rounded-md border border-ink-line bg-ink-raised px-6 text-base font-semibold text-on-ink transition hover:bg-ink-hover"
            >
              Paneli Ekranlarla Gör
            </Link>
          </div>
          <p style={delay(540)} className="hero-rise mt-3 text-sm text-on-ink-faint">
            Kurulum ücretsiz · Taahhüt yok · Mevcut kayıtlarınızı biz taşırız
          </p>
        </div>

        <div style={delay(180)} className="hero-panel relative z-10">
          <PanelShot
            src="/panel-dashboard.png"
            alt="Vetra yönetim paneli: üye durumları, günün dersleri, paketi bitenler, aylık ciro ve randevu yoğunluğu"
            priority
          />
        </div>
      </div>
    </section>
  );
}
