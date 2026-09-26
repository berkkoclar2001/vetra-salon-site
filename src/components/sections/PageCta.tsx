import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/motion/Reveal";

/** Alt sayfaların kapanış çağrısı. */
export default function PageCta({
  title = "Salonunuz için Vetra akışını birlikte kuralım",
  text = "Salonunuzu tanıyalım, size uygun kurulumu ve paketi birlikte belirleyelim.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="border-t border-ink-line bg-ink py-16 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Reveal className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
          <p className="mt-3 leading-7 text-on-ink-muted">{text}</p>
        </Reveal>
        <Link
          href="/iletisim"
          className="btn-shine inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-lime px-6 text-base font-semibold text-ink transition hover:bg-lime-hover"
        >
          Teklif Alın
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
