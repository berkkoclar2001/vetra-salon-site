"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, Plus } from "lucide-react";
import BrowserFrame from "./BrowserFrame";

/*
 * Canlı panel önizlemesi: HTML ile çizilmiş mini ders takvimi üzerinde imleç randevu ekler.
 * Adımlar görünür alandayken döner; ekran dışında ya da sekme gizliyken durur.
 * Hareket azaltmayı seçen kullanıcı "kaydedildi" karesini durağan görür.
 */

const PHASES = [
  { key: "rest", ms: 1000 },
  { key: "toAdd", ms: 900 },
  { key: "pressAdd", ms: 260 },
  { key: "form", ms: 700 },
  { key: "typing", ms: 1400 },
  { key: "toSave", ms: 800 },
  { key: "pressSave", ms: 260 },
  { key: "saved", ms: 3400 },
  { key: "reset", ms: 700 },
] as const;
type PhaseKey = (typeof PHASES)[number]["key"];
const at = (key: PhaseKey) => PHASES.findIndex((p) => p.key === key);

const MEMBER = "Elif Yıldız";
const DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum"];
const TIMES = ["09:00", "11:00", "18:00", "19:30"];
const TARGET = "Sal-18:00";

// Kurgusal hafta. Hedef seans 7/8 doluyken randevu eklenince dolar.
const SESSIONS: Record<string, { name: string; taken: number; cap: number }> = {
  "Pzt-09:00": { name: "Mat Pilates", taken: 6, cap: 10 },
  "Pzt-18:00": { name: "Reformer Pilates", taken: 8, cap: 8 },
  "Sal-11:00": { name: "Yoga Flow", taken: 5, cap: 12 },
  "Sal-18:00": { name: "Reformer Pilates", taken: 7, cap: 8 },
  "Çar-09:00": { name: "Mat Pilates", taken: 9, cap: 10 },
  "Çar-19:30": { name: "Yoga Flow", taken: 4, cap: 12 },
  "Per-11:00": { name: "Reformer Pilates", taken: 3, cap: 8 },
  "Per-18:00": { name: "Mat Pilates", taken: 10, cap: 10 },
  "Cum-18:00": { name: "Reformer Pilates", taken: 6, cap: 8 },
  "Cum-19:30": { name: "Yoga Flow", taken: 7, cap: 12 },
};

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export default function LiveCalendarDemo() {
  const reduced = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const addRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const saveRef = useRef<HTMLSpanElement>(null);

  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState(0);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const running = inView && pageVisible && !reduced;
  const phase = reduced ? at("saved") : step;
  const key = PHASES[phase].key;

  // Görünürlük: ekranda ve sekme açıkken döner.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(el);
    const onVisibility = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Adım makinesi: durunca bulunduğu adımda bekler, dönünce o adımı baştan oynatır.
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => {
      const next = (step + 1) % PHASES.length;
      if (PHASES[next].key === "rest") setTyped(0);
      setStep(next);
    }, PHASES[step].ms);
    return () => clearTimeout(timer);
  }, [step, running]);

  // Üye adı yazı makinesiyle yazılır.
  useEffect(() => {
    if (!running || key !== "typing") return;
    const timer = setInterval(() => setTyped((n) => Math.min(n + 1, MEMBER.length)), 75);
    return () => clearInterval(timer);
  }, [running, key]);

  // İmleç hedefe kayar; hedef, adımın ilgilendiği öğenin ekrandaki konumundan ölçülür.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => {
      const target =
        key === "toAdd" || key === "pressAdd"
          ? addRef.current
          : key === "form" || key === "typing"
            ? nameRef.current
            : key === "toSave" || key === "pressSave"
              ? saveRef.current
              : null;
      const box = root.getBoundingClientRect();
      if (!target) {
        setCursor({ x: box.width * 0.72, y: box.height * 0.82 });
        return;
      }
      const r = target.getBoundingClientRect();
      setCursor({ x: r.left - box.left + r.width * 0.6, y: r.top - box.top + r.height * 0.55 });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [key]);

  const formOpen = phase >= at("form") && phase <= at("pressSave");
  const saved = key === "saved";
  const pressed = key === "pressAdd" || key === "pressSave";
  const typedName = reduced || phase > at("typing") ? MEMBER : MEMBER.slice(0, typed);

  return (
    <BrowserFrame address="salonunuz.vetra.app/takvim">
      <p className="sr-only">
        Animasyonlu önizleme: panelde yeni randevu oluşturulur, Reformer Pilates seansının kontenjanı dolar ve SMS hatırlatması planlanır.
      </p>
      <div ref={rootRef} aria-hidden className="relative select-none overflow-hidden bg-white p-3 sm:p-4">
        {/* Üst çubuk */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-ink">Ders takvimi</p>
            <p className="text-[11px] text-quiet">15 – 19 Eylül</p>
          </div>
          <span
            ref={addRef}
            className={`inline-flex h-8 items-center gap-1 rounded-md bg-lime px-3 text-xs font-semibold text-ink transition-transform duration-150 ${
              key === "pressAdd" ? "scale-95" : ""
            }`}
          >
            <Plus className="h-3.5 w-3.5" />
            Randevu
          </span>
        </div>

        {/* Haftalık ızgara: mobilde ilk üç gün */}
        <div className="grid grid-cols-[40px_repeat(3,minmax(0,1fr))] gap-1.5 sm:grid-cols-[48px_repeat(5,minmax(0,1fr))]">
          <span />
          {DAYS.map((day, d) => (
            <span key={day} className={`pb-1 text-center text-[11px] font-medium text-quiet ${d > 2 ? "hidden sm:block" : ""}`}>
              {day}
            </span>
          ))}
          {TIMES.map((time) => (
            <Row key={time} time={time} saved={saved} />
          ))}
        </div>

        {/* Yeni randevu formu */}
        <div
          className={`absolute inset-x-3 top-12 z-20 rounded-lg border border-line bg-white p-4 shadow-xl shadow-black/10 transition duration-300 sm:left-auto sm:right-4 sm:w-64 ${
            formOpen ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-1 scale-[0.97] opacity-0"
          }`}
        >
          <p className="text-sm font-semibold text-ink">Yeni randevu</p>
          <Field label="Üye">
            <span ref={nameRef} className="flex items-center">
              {typedName || <span className="text-quiet">Üye arayın</span>}
              {key === "typing" && <span className="ml-px h-3.5 w-px animate-pulse bg-ink" />}
            </span>
          </Field>
          <Field label="Ders" className="hidden sm:block">
            Reformer Pilates
          </Field>
          <Field label="Seans">Reformer · Sal 18:00 · 7/8</Field>
          <div className="mt-4 flex justify-end gap-2 text-xs font-semibold">
            <span className="inline-flex h-8 items-center rounded-md px-3 text-quiet">Vazgeç</span>
            <span
              ref={saveRef}
              className={`inline-flex h-8 items-center rounded-md bg-ink px-4 text-white transition-transform duration-150 ${
                key === "pressSave" ? "scale-95" : ""
              }`}
            >
              Kaydet
            </span>
          </div>
        </div>

        {/* Bildirim */}
        <div
          className={`absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-lg bg-ink px-3 py-2 text-xs text-on-ink shadow-lg transition duration-300 ${
            saved ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-lime text-ink">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          <span className="font-semibold">Randevu oluşturuldu</span>
          <span className="hidden text-on-ink-faint sm:inline">· SMS hatırlatma planlandı</span>
        </div>

        {/* İmleç (yalnız geniş ekranda) */}
        {!reduced && (
          <span
            className="pointer-events-none absolute left-0 top-0 z-30 hidden transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] sm:block"
            style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}
          >
            <span
              className={`absolute -left-3 -top-3 h-6 w-6 rounded-full bg-lime/60 transition duration-200 ${
                pressed ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
            />
            <svg width="18" height="20" viewBox="0 0 18 20" className={`relative drop-shadow transition-transform duration-150 ${pressed ? "scale-90" : ""}`}>
              <path d="M1 1l6.5 17 2.4-7.1L17 8.4z" fill="#0b0b0c" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>
    </BrowserFrame>
  );
}

function Row({ time, saved }: { time: string; saved: boolean }) {
  return (
    <>
      <span className="pt-2 text-[11px] tabular-nums text-quiet">{time}</span>
      {DAYS.map((day, d) => {
        const slot = `${day}-${time}`;
        const session = SESSIONS[slot];
        const desktopOnly = d > 2;
        if (!session)
          return <span key={slot} className={`h-14 rounded-md border border-dashed border-line ${desktopOnly ? "hidden sm:block" : ""}`} />;

        const isTarget = slot === TARGET;
        const taken = isTarget && saved ? session.taken + 1 : session.taken;
        const full = taken >= session.cap;
        const lit = isTarget && saved;
        return (
          <span
            key={slot}
            className={`h-14 flex-col justify-between rounded-md border p-1.5 transition duration-500 sm:p-2 ${desktopOnly ? "hidden sm:flex" : "flex"} ${
              lit ? "scale-[1.04] border-lime bg-lime shadow-md shadow-lime/40" : "border-line bg-sunken"
            }`}
          >
            <span className="truncate text-[11px] font-semibold leading-tight text-ink">{session.name}</span>
            <span className="flex items-center gap-1.5">
              <span className={`h-1 flex-1 overflow-hidden rounded-full ${lit ? "bg-ink/15" : "bg-line"}`}>
                <span
                  className={`block h-full rounded-full transition-[width] duration-500 ${lit ? "bg-ink" : full ? "bg-quiet" : "bg-lime-deep"}`}
                  style={{ width: `${(taken / session.cap) * 100}%` }}
                />
              </span>
              <span className="text-[10px] tabular-nums text-quiet">
                {taken}/{session.cap}
              </span>
            </span>
          </span>
        );
      })}
    </>
  );
}

function Field({ label, className = "", children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`mt-3 ${className}`}>
      <p className="mb-1 text-[11px] font-medium text-quiet">{label}</p>
      <div className="flex h-8 items-center rounded-md border border-line bg-paper px-2.5 text-xs text-ink">{children}</div>
    </div>
  );
}
