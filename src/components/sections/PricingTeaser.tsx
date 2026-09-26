import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Ana sayfadaki fiyat özeti. Rakam içermez; paketler /fiyatlar sayfasında. */
export default function PricingTeaser() {
  return (
    <section className="bg-lime py-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Kurulum ücretsiz, taahhüt yok
          </h2>
          <p className="mt-3 text-lg leading-8 text-ink/80">
            Üç paket, gizli kalem yok. Veri taşıma ve ekip eğitimi her pakete dahil; aylık ödersiniz.
          </p>
        </div>
        <Link
          href="/fiyatlar"
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-ink px-6 text-base font-semibold text-white transition hover:bg-ink-hover"
        >
          Paketleri inceleyin
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
