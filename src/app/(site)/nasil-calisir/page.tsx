import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import HowItWorks from "@/components/sections/HowItWorks";
import HowItWorksSteps from "@/components/sections/HowItWorksSteps";
import Faq from "@/components/sections/Faq";
import PageCta from "@/components/sections/PageCta";

export const metadata: Metadata = pageMetadata({
  title: "Salon Yönetim Paneli Nasıl Çalışır",
  description:
    "Salonunuza özel panel linki oluşturulur, ekip rolüne göre girer; üyeler, paketler, seanslar ve ödemeler tek yerden takip edilir.",
  path: "/nasil-calisir",
});

// Cevaplar ana sayfa SSS'i ve paneldeki rol yetkileriyle tutarlı.
const faq = [
  {
    q: "Panel linki tanıtım sitesinden neden ayrı?",
    a: "Ekibiniz her gün panele girer; tanıtım sayfalarından geçmek zorunda kalmaz. Salonunuza özel bağlantıyı yer imine ekler ve doğrudan kendi girişine ulaşır.",
  },
  {
    q: "Eğitmenler ve resepsiyon aynı paneli mi kullanıyor?",
    a: "Herkes aynı panele kendi hesabıyla girer ama rolüne göre yetkilendirilir. Finans, tanımlamalar ve raporlar gibi ekranlar yalnız yöneticiye açıktır.",
  },
  {
    q: "Mevcut üye kayıtlarımı taşıyabilir miyim?",
    a: "Evet. Kurulum sırasında mevcut üye ve paket listenizi (Excel ya da başka bir programdan) panele biz aktarıyoruz. Kurulum ücretsizdir.",
  },
];

export default function NasilCalisirPage() {
  return (
    <>
      <HowItWorks headingAs="h1" />
      <HowItWorksSteps />
      <Faq items={faq} className="border-t border-line bg-paper" />
      <PageCta />
    </>
  );
}
