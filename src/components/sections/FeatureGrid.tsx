import { UsersRound, CalendarDays, CreditCard, Ruler, BellRing, HandCoins, Wallet, BarChart3, ShieldCheck } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import DetailLink from "./DetailLink";
import type { SectionProps } from "./types";

// Yalnız panel kodunda karşılığı olan modüller. Ana sayfa ilk altısını gösterir.
const features = [
  {
    icon: UsersRound,
    title: "Üye yaşam döngüsü",
    text: "Ön kayıt, aktif üye, dondurma, pasifleştirme, paket hakkı ve üye notları aynı profil üzerinden takip edilir.",
  },
  {
    icon: CalendarDays,
    title: "Ders ve randevu takvimi",
    text: "Günlük, haftalık ve aylık görünümlerle seansları, eğitmenleri, kontenjanları ve katılım durumunu yönetirsiniz.",
  },
  {
    icon: CreditCard,
    title: "Esnek üyelik paketleri",
    text: "Paket ders adedine, süreye ya da ikisine birden bağlanır. Devir hakkı, dondurma süresi ve iptal penceresi paket bazında tanımlanır.",
  },
  {
    icon: Ruler,
    title: "Gelişim takibi",
    text: "Ölçülecek alanları salon kendisi tanımlar; kilo, çevre ve oran değerleri zaman içinde izlenir, antrenman planı üyeye haftalık günlere bölünerek atanır.",
  },
  {
    icon: Wallet,
    title: "Üyelik satışı ve taksit",
    text: "Üyeliği panelden satar, ödeme planını ve tahsilatı takip edersiniz. Kimin borcu kaldığı borç listesinde nettir.",
  },
  {
    icon: BellRing,
    title: "Otomatik SMS ve e-posta",
    text: "Paket bitişi, üyelik bitişi, doğum günü, seans hatırlatması ve bir süredir gelmeyen üyeler için şablonlarınız kendiliğinden gönderilir.",
  },
  {
    icon: HandCoins,
    title: "Eğitmen hakedişi",
    text: "Eğitmen ödemesini ders başı ücret, ciro payı ya da sabit ücretle tanımlarsınız; hakediş raporu dönem sonunda tutarı hesaplar.",
  },
  {
    icon: BarChart3,
    title: "İşletme raporları",
    text: "Üyelik, kapasite, rezervasyon, borç, eğitmen, hakediş, finans ve dondurma raporları operasyonun nereye aktığını gösterir.",
  },
  {
    icon: ShieldCheck,
    title: "Rol bazlı panel",
    text: "Admin, personel ve eğitmen rolleriyle herkes sadece ihtiyacı olan operasyon alanına odaklanır.",
  },
];

/**
 * Modül kartları. /ozellikler tüm kartları başlıksız gösterir (başlığı PageHeader verir);
 * ana sayfa `limit` ve `detailHref` ile başlıklı özet olarak kullanır.
 */
export default function FeatureGrid({ headingAs: Heading = "h2", detailHref, limit }: SectionProps & { limit?: number }) {
  const items = limit ? features.slice(0, limit) : features;

  return (
    <section className={`bg-paper ${detailHref ? "py-16 sm:py-20" : "pb-20 pt-12"}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {detailHref && (
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <Reveal className="max-w-3xl">
              <span className="text-sm font-semibold uppercase tracking-[0.08em] text-lime-deep">Özellikler</span>
              <Heading className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Salonun günlük işini tek panelde toplayan modüller
              </Heading>
            </Reveal>
            <DetailLink href={detailHref}>Tüm modülleri inceleyin</DetailLink>
          </div>
        )}
        <Reveal stagger spotlight className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((feature) => (
            <article key={feature.title} className="spotlight rounded-lg border border-line bg-white p-6">
              <feature.icon className="h-7 w-7 text-ink" />
              <h3 className="mt-5 text-xl font-semibold text-ink">{feature.title}</h3>
              <p className="mt-3 leading-7 text-quiet">{feature.text}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
