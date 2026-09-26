import Reveal from "@/components/motion/Reveal";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, LayoutGrid } from "lucide-react";
import Breadcrumbs from "@/components/sections/Breadcrumbs";
import Faq from "@/components/sections/Faq";
import PageCta from "@/components/sections/PageCta";
import { onboardingSteps } from "@/lib/onboarding";
import { pageMetadata } from "@/lib/site";
import { getVertical, verticalHref, verticals } from "@/lib/verticals";

type Props = { params: Promise<{ slug: string }> };

// Yalnız tanımlı altı dikey üretilir; başka slug 404 döner.
export const dynamicParams = false;

export function generateStaticParams() {
  return verticals.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const vertical = getVertical((await params).slug);
  if (!vertical) return {};
  return pageMetadata({
    title: vertical.metaTitle,
    description: vertical.metaDescription,
    path: verticalHref(vertical),
  });
}

export default async function VerticalPage({ params }: Props) {
  const vertical = getVertical((await params).slug);
  if (!vertical) notFound();

  const others = verticals.filter((v) => v.slug !== vertical.slug);

  return (
    <>
      <section className="border-b border-ink-line bg-ink py-14 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { name: "Ana sayfa", path: "/" },
              { name: "Kimler İçin", path: "/kimler-icin" },
              { name: vertical.tab, path: verticalHref(vertical) },
            ]}
          />
          <div className="hero-rise mt-8 max-w-3xl">
            <span className="text-sm font-semibold uppercase tracking-[0.08em] text-lime">{vertical.tab}</span>
            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{vertical.h1}</h1>
            <p className="mt-5 text-lg leading-8 text-on-ink-muted sm:text-xl">{vertical.lead}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/iletisim"
                className="btn-shine inline-flex h-12 items-center justify-center gap-2 rounded-md bg-lime px-6 text-base font-semibold text-ink transition hover:bg-lime-hover"
              >
                Salonunuz İçin Teklif Alın
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/ozellikler"
                className="inline-flex h-12 items-center justify-center rounded-md border border-ink-line bg-ink-raised px-6 text-base font-semibold text-on-ink transition hover:bg-ink-hover"
              >
                Tüm özellikleri görün
              </Link>
            </div>
            <p className="mt-3 text-sm text-on-ink-faint">
              Kurulum ücretsiz · Taahhüt yok · Mevcut kayıtlarınızı biz taşırız
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-paper py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-[0.08em] text-lime-deep">Tanıdık geliyor mu?</span>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Defterle ve Excel&apos;le yönetirken en çok yaşanan sorunlar
          </h2>
          <Reveal stagger spotlight className="mt-10 grid gap-4 md:grid-cols-3">
            {vertical.problems.map((problem) => (
              <article key={problem.title} className="spotlight rounded-xl border border-line bg-white p-6">
                <h3 className="text-xl font-semibold text-ink">{problem.title}</h3>
                <p className="mt-3 leading-7 text-quiet">{problem.text}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.08em] text-lime-deep">Vetra ile</span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{vertical.title}</h2>
            <Reveal as="ul" stagger className="mt-10 space-y-8">
              {vertical.solutions.map((solution) => (
                <li key={solution.title} className="flex gap-4">
                  <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-lime-deep" />
                  <div>
                    <h3 className="text-lg font-semibold text-ink">{solution.title}</h3>
                    <p className="mt-2 leading-7 text-body">{solution.text}</p>
                  </div>
                </li>
              ))}
            </Reveal>
          </div>

          <aside className="self-start rounded-xl border border-line bg-sunken p-6 lg:sticky lg:top-24">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-lime-deep">
              <LayoutGrid className="h-4 w-4" />
              Çok kullanacağınız ekranlar
            </div>
            <ul className="mt-5 space-y-2.5">
              {vertical.screens.map((screen) => (
                <li key={screen} className="rounded-md border border-line bg-white px-4 py-3 text-sm font-medium text-body">
                  {screen}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-6 text-quiet">
              Kurulumda bu ekranları salonunuzun akışına göre birlikte ayarlıyoruz.
            </p>
            <Link
              href="/iletisim"
              className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-ink px-5 text-sm font-semibold text-white transition hover:bg-ink-hover"
            >
              Bu kurulumu konuşalım
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </section>

      <section className="border-t border-line bg-sunken py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.08em] text-lime-deep">Kimler için uygun</span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {vertical.tab} için doğru panel mi?
            </h2>
            <p className="mt-5 text-lg leading-8 text-body">{vertical.fit}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-ink">Kurulum 3 adımda</h2>
            <Reveal as="ol" stagger className="mt-6 space-y-6">
              {onboardingSteps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-ink text-sm font-bold text-lime">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">{step.title}</h3>
                    <p className="mt-1 leading-7 text-quiet">{step.text}</p>
                  </div>
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <Faq items={vertical.faq} title={`${vertical.tab} için sık sorulanlar`} className="border-t border-line bg-paper" />

      <section className="border-t border-line bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-ink">Diğer işletme türleri</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {others.map((v) => (
              <li key={v.slug}>
                <Link
                  href={verticalHref(v)}
                  className="inline-flex items-center gap-2 rounded-md border border-line bg-sunken px-4 py-2.5 text-sm font-medium text-body transition hover:border-line-strong hover:bg-white hover:text-ink"
                >
                  {v.tab}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <PageCta title={`${vertical.tab} için Vetra kurulumunu konuşalım`} />
    </>
  );
}
