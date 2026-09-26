"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";

export type NavLink = { label: string; href: string };
export type NavEntry = { label: string; href?: string; children?: NavLink[] };

/** Bir üst seviye girdinin kapsadığı tüm rotalar. */
function routesOf(entry: NavEntry): string[] {
    return entry.children?.map((c) => c.href) ?? (entry.href ? [entry.href] : []);
}

export default function SiteHeader({ navItems }: { navItems: NavEntry[] }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const headerRef = useRef<HTMLElement>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Rota değişince açık menüler kapansın.
    useEffect(() => {
        setMobileOpen(false);
        setOpenMenu(null);
    }, [pathname]);

    // Mobil menü açıkken arka plan kaymasın.
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    // Sayfa kaydırıldığında header'a gölge gelsin.
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);


    // Escape ve dışarı tıklama menüyü kapatsın.
    useEffect(() => {
        if (!openMenu) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenMenu(null);
        const onClick = (e: MouseEvent) => {
            if (!headerRef.current?.contains(e.target as Node)) setOpenMenu(null);
        };
        document.addEventListener("keydown", onKey);
        document.addEventListener("mousedown", onClick);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.removeEventListener("mousedown", onClick);
        };
    }, [openMenu]);

    const isActive = useCallback(
        (entry: NavEntry) => routesOf(entry).includes(pathname),
        [pathname],
    );

    const hoverOpen = (label: string) => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setOpenMenu(label);
    };
    const hoverClose = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
    };

    return (
        <header
            ref={headerRef}
            className={`fixed inset-x-0 top-0 z-50 border-b bg-paper/90 backdrop-blur-xl transition-shadow duration-200 ${
                scrolled ? "border-line shadow-sm shadow-black/10" : "border-line"
            }`}
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    className="flex shrink-0 items-center gap-3"
                    aria-label="Vetra ana sayfa"
                    onClick={() => setMobileOpen(false)}
                >
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-black">
                        <Image src="/vetra.jpeg" alt="" fill sizes="40px" className="object-contain p-1" />
                    </span>
                    <span className="whitespace-nowrap text-lg font-semibold text-ink">
                        Vetra App Software
                    </span>
                </Link>

                <nav className="hidden items-center gap-1 lg:flex" aria-label="Ana menü">
                    {navItems.map((entry) => {
                        const active = isActive(entry);
                        const baseLink =
                            "relative rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:transition-all";
                        const stateClass = active
                            ? "text-ink after:bg-ink"
                            : "text-quiet hover:text-ink after:bg-transparent";

                        if (!entry.children) {
                            return (
                                <Link
                                    key={entry.label}
                                    href={entry.href!}
                                    className={`${baseLink} ${stateClass}`}
                                    aria-current={active ? "page" : undefined}
                                >
                                    {entry.label}
                                </Link>
                            );
                        }

                        const open = openMenu === entry.label;
                        return (
                            <div
                                key={entry.label}
                                className="relative"
                                onMouseEnter={() => hoverOpen(entry.label)}
                                onMouseLeave={hoverClose}
                            >
                                <button
                                    type="button"
                                    aria-expanded={open}
                                    aria-haspopup="true"
                                    onClick={() => setOpenMenu(open ? null : entry.label)}
                                    className={`${baseLink} inline-flex items-center gap-1 ${stateClass}`}
                                >
                                    {entry.label}
                                    <ChevronDown
                                        className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {open && (
                                    <div className="absolute left-0 top-full pt-2">
                                        <div className="min-w-[220px] overflow-hidden rounded-lg border border-line bg-white p-1.5 shadow-xl shadow-black/15">
                                            {entry.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    onClick={() => setOpenMenu(null)}
                                                    className={`block rounded-md px-3 py-2.5 text-sm font-medium transition ${
                                                        pathname === child.href
                                                            ? "bg-lime-tint text-ink"
                                                            : "text-body hover:bg-sunken hover:text-ink"
                                                    }`}
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-2">
                    <Link
                        href="/iletisim"
                        className="hidden items-center gap-2 whitespace-nowrap rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-ink-hover sm:inline-flex"
                    >
                        Teklif Alın
                        <ArrowRight className="h-4 w-4" />
                    </Link>

                    <button
                        type="button"
                        onClick={() => setMobileOpen((v) => !v)}
                        aria-expanded={mobileOpen}
                        aria-controls="site-menu"
                        aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line-strong bg-white/75 text-ink transition hover:bg-white lg:hidden"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div
                    id="site-menu"
                    className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-line bg-paper lg:hidden"
                >
                    <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6" aria-label="Mobil menü">
                        {navItems.map((entry) =>
                            entry.children ? (
                                <div key={entry.label} className="border-b border-line py-3">
                                    <p className="px-1 pb-1 text-xs font-semibold uppercase tracking-[0.08em] text-lime-deep">
                                        {entry.label}
                                    </p>
                                    {entry.children.map((child) => (
                                        <Link
                                            key={child.href}
                                            href={child.href}
                                            onClick={() => setMobileOpen(false)}
                                            className="block py-2.5 pl-1 text-base font-medium text-body transition hover:text-ink"
                                        >
                                            {child.label}
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <Link
                                    key={entry.label}
                                    href={entry.href!}
                                    onClick={() => setMobileOpen(false)}
                                    className="block border-b border-line py-3.5 pl-1 text-base font-medium text-body transition hover:text-ink"
                                >
                                    {entry.label}
                                </Link>
                            ),
                        )}

                        <div className="mt-5 flex flex-col gap-3 pb-2">
                            <Link
                                href="/iletisim"
                                onClick={() => setMobileOpen(false)}
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ink px-6 text-base font-semibold text-white transition hover:bg-ink-hover"
                            >
                                Teklif Alın
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
