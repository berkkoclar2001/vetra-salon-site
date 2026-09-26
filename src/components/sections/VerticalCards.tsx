import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import { verticalHref, verticals } from "@/lib/verticals";
import type { SectionProps } from "./types";

/** Ana sayfadaki "Kimler için" özeti: altı işletme türü, her biri kendi landing sayfasına gider. */
export default function VerticalCards({ headingAs: Heading = "h2", detailHref }: SectionProps) {
  return (
    <section className="border-b border-line bg-paper py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-3xl">
            <span className="text-sm font-semibold uppercase tracking-[0.08em] text-lime-deep">Kimler için</span>
            <Heading className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Salonunuz hangi işi yapıyorsa, panel ona göre kurulur
            </Heading>
            <p className="mt-4 text-lg leading-8 text-quiet">
              Branşlarınızı, paketlerinizi ve ölçüm alanlarınızı Vetra değil siz tanımlarsınız.
            </p>
          </Reveal>
          {detailHref && (
            <Link
              href={detailHref}
              className="inline-flex items-center gap-2 text-base font-semibold text-ink underline-offset-4 hover:underline"
            >
              Tüm işletme türleri
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        <Reveal stagger spotlight className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {verticals.map((v) => (
            <Link
              key={v.slug}
              href={verticalHref(v)}
              className="spotlight group flex flex-col rounded-xl border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lg hover:shadow-black/5"
            >
              <span className="text-sm font-semibold uppercase tracking-[0.08em] text-lime-deep">{v.tab}</span>
              <h3 className="mt-3 text-xl font-semibold leading-snug text-ink">{v.title}</h3>
              <p className="mt-3 flex-1 leading-7 text-quiet">{v.intro}</p>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-ink">
                İncele
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
