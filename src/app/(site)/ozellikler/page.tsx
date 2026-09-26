import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import PageHeader from "@/components/sections/PageHeader";
import FeatureGrid from "@/components/sections/FeatureGrid";
import BenefitCards from "@/components/sections/BenefitCards";
import PageCta from "@/components/sections/PageCta";

export const metadata: Metadata = pageMetadata({
  title: "Salon Yazılımı Özellikleri: Üye, Randevu, Paket",
  description:
    "Üye yaşam döngüsü, ders ve randevu takvimi, esnek paketler, gelişim takibi, otomatik SMS bildirimleri ve eğitmen hakedişi. Vetra salon panelinin dokuz modülü.",
  path: "/ozellikler",
});

export default function OzelliklerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Ürün omurgası"
        title="Salonun günlük işini dağıtmadan toparlayan modüller"
        description="Vetra'nın en güçlü yanı tek bir vitrin özelliği değil; resepsiyondan eğitmene, finans ekranından rapora kadar salon ritmini aynı merkezde tutması."
      />
      <FeatureGrid />
      <BenefitCards />
      <PageCta />
    </>
  );
}
