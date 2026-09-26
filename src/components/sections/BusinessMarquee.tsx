import { verticals } from "@/lib/verticals";

// Geniş ekranda altı ad şeridi doldurmuyor; her kopyada iki tur basılır ki döngüde boşluk görünmesin.
const names = [...verticals, ...verticals].map((v) => v.tab);

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {names.map((name, i) => (
        <li key={i} aria-hidden={i >= verticals.length || undefined} className="flex items-center gap-3 whitespace-nowrap px-5 text-sm font-medium text-quiet">
          <span className="h-1.5 w-1.5 rounded-full bg-lime-deep" />
          {name}
        </li>
      ))}
    </ul>
  );
}

/** Metrik şeridinin altında Vetra'nın hitap ettiği işletme türleri sürekli kayar; hover'da durur. */
export default function BusinessMarquee() {
  return (
    <div className="marquee overflow-hidden border-t border-line py-3">
      <div className="marquee-track flex w-max">
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
