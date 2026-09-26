import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Pricing from "@/components/sections/Pricing";
import PageCta from "@/components/sections/PageCta";

export const metadata: Metadata = pageMetadata({
  title: "Salon Yönetim Programı Fiyatları",
  description:
    "Spor salonu ve pilates stüdyosu yazılımı paket fiyatları. Kurulum, veri taşıma ve eğitim dahil; aylık ödeme, taahhüt yok.",
  path: "/fiyatlar",
});

export default function FiyatlarPage() {
  return (
    <>
      <Pricing headingAs="h1" />
      <PageCta title="Hangi paket size uygun, birlikte bakalım" />
    </>
  );
}
