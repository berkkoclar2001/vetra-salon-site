import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Hero from "@/components/sections/Hero";
import MetricsStrip from "@/components/sections/MetricsStrip";
import VerticalCards from "@/components/sections/VerticalCards";
import HowItWorks from "@/components/sections/HowItWorks";
import LiveDemo from "@/components/sections/LiveDemo";
import FeatureGrid from "@/components/sections/FeatureGrid";
import Reports from "@/components/sections/Reports";
import PricingTeaser from "@/components/sections/PricingTeaser";
import Faq from "@/components/sections/Faq";
import PageCta from "@/components/sections/PageCta";

export const metadata: Metadata = pageMetadata({
  title: "Spor Salonu ve Pilates Stüdyosu Yönetim Programı",
  description:
    "Pilates, yoga ve fitness stüdyoları için üye takibi, randevu, paket, tahsilat ve raporları tek panelde toplayan salon yönetim yazılımı.",
  path: "/",
});

// Yalnız panelde karşılığı olan konular; cevaplar alt sayfalardaki içerikle tutarlı.
const faq = [
  {
    q: "Vetra hangi işletmeler için uygun?",
    a: "Pilates ve yoga stüdyoları, personal training stüdyoları, fitness salonları, fizyoterapi ve rehabilitasyon merkezleri ile dans ve sanat kursları. Branşlarınızı ve paketlerinizi kendiniz tanımladığınız için panel işinize göre şekillenir.",
  },
  {
    q: "Mevcut üye kayıtlarımı taşıyabilir miyim?",
    a: "Evet. Kurulum sırasında mevcut üye ve paket listenizi (Excel ya da başka bir programdan) panele biz aktarıyoruz. Kurulum ücretsizdir.",
  },
  {
    q: "Seanslı ve süreli paketleri birlikte kullanabilir miyim?",
    a: "Evet. Paketi seans adedine, gün sayısına ya da ikisine birden bağlayabilirsiniz. Devir hakkı, dondurma süresi ve iptal penceresi paket bazında tanımlanır.",
  },
  {
    q: "Üyelere otomatik hatırlatma gönderiliyor mu?",
    a: "Paket bitişi, üyelik bitişi, doğum günü, seans hatırlatması ve bir süredir gelmeyen üyeler için SMS veya e-posta şablonu tanımlarsınız; bildirimler kendiliğinden gönderilir.",
  },
  {
    q: "Eğitmenler ve resepsiyon aynı paneli mi kullanıyor?",
    a: "Herkes aynı panele kendi hesabıyla girer ama rolüne göre yetkilendirilir. Finans, tanımlamalar ve raporlar gibi ekranlar yalnız yöneticiye açıktır.",
  },
  {
    q: "Taahhüt var mı?",
    a: "Hayır. Aylık ödersiniz ve istediğiniz ay bırakabilirsiniz. Paket detayları fiyatlar sayfasında.",
  },
];

export default function Home() {
  return (
    <>
      <Hero />
      <MetricsStrip />
      <VerticalCards detailHref="/kimler-icin" />
      <HowItWorks detailHref="/nasil-calisir" />
      <LiveDemo />
      <FeatureGrid limit={6} detailHref="/ozellikler" />
      <Reports detailHref="/raporlar" />
      <PricingTeaser />
      <Faq items={faq} className="border-t border-line bg-paper" />
      <PageCta />
    </>
  );
}
