"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, LayoutGrid } from "lucide-react";
import type { SectionProps } from "@/components/sections/types";
import { verticalHref, type Vertical } from "@/lib/verticals";

/** Sekmeler yalnız özet alanları alır; landing sayfası içeriği (SSS vb.) istemci paketine girmez. */
export type VerticalTabItem = Pick<Vertical, "id" | "slug" | "tab" | "title" | "intro" | "points" | "screens">;

export default function VerticalTabs({ items, headingAs: Heading = "h2" }: SectionProps & { items: VerticalTabItem[] }) {
    const [active, setActive] = useState(items[0].id);
    const PanelHeading = Heading === "h1" ? "h2" : "h3";

    return (
        <section id="kimler-icin" className="border-b border-ink-line bg-ink py-20 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                    <span className="text-sm font-semibold uppercase tracking-[0.08em] text-lime">
                        Kimler için
                    </span>
                    <Heading className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                        Salonunuz hangi işi yapıyorsa, panel ona göre kurulur
                    </Heading>
                    <p className="mt-4 text-lg leading-8 text-on-ink-muted">
                        Branşlarınızı, paketlerinizi ve ölçüm alanlarınızı Vetra değil siz tanımlarsınız.
                        Aşağıdan işinize en yakın olanı seçin.
                    </p>
                </div>

                <div role="tablist" aria-label="İşletme türleri" className="mt-10 flex flex-wrap gap-2">
                    {items.map((v) => {
                        const isActive = v.id === active;
                        return (
                            <button
                                key={v.id}
                                role="tab"
                                type="button"
                                aria-selected={isActive}
                                aria-controls={`panel-${v.id}`}
                                id={`tab-${v.id}`}
                                onClick={() => setActive(v.id)}
                                className={
                                    isActive
                                        ? "rounded-md bg-lime px-4 py-2.5 text-sm font-semibold text-ink"
                                        : "rounded-md border border-ink-line bg-ink-raised px-4 py-2.5 text-sm font-medium text-on-ink transition hover:bg-ink-hover"
                                }
                            >
                                {v.tab}
                            </button>
                        );
                    })}
                </div>

                {/* Tüm paneller HTML'de render edilir, pasif olanlar yalnız gizlenir: arama motorları altı dikeyin metnini de görür. */}
                {items.map((v) => (
                    <div
                        key={v.id}
                        role="tabpanel"
                        id={`panel-${v.id}`}
                        aria-labelledby={`tab-${v.id}`}
                        hidden={v.id !== active}
                        className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]"
                    >
                        <div>
                            <PanelHeading className="text-2xl font-semibold leading-snug sm:text-3xl">{v.title}</PanelHeading>
                            <p className="mt-4 text-lg leading-8 text-on-ink-muted">{v.intro}</p>

                            <ul className="mt-7 space-y-3.5">
                                {v.points.map((point) => (
                                    <li key={point} className="flex gap-3 leading-7 text-on-ink">
                                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-lime" />
                                        {point}
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                                <Link
                                    href="/iletisim"
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-lime px-6 text-base font-semibold text-ink transition hover:bg-lime-hover"
                                >
                                    Bu kurulumu konuşalım
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                                <Link
                                    href={verticalHref(v)}
                                    className="inline-flex items-center gap-2 font-semibold text-lime underline-offset-4 hover:underline"
                                >
                                    {v.tab} için detaylar
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        <aside className="self-start rounded-xl border border-ink-line bg-ink-raised p-6">
                            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-lime">
                                <LayoutGrid className="h-4 w-4" />
                                Çok kullanacağınız ekranlar
                            </div>
                            <ul className="mt-5 space-y-2.5">
                                {v.screens.map((screen) => (
                                    <li
                                        key={screen}
                                        className="rounded-md border border-ink-line bg-ink px-4 py-3 text-sm font-medium text-on-ink"
                                    >
                                        {screen}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-5 text-sm leading-6 text-on-ink-faint">
                                Kurulumda bu ekranları salonunuzun akışına göre birlikte ayarlıyoruz.
                            </p>
                        </aside>
                    </div>
                ))}
            </div>
        </section>
    );
}
