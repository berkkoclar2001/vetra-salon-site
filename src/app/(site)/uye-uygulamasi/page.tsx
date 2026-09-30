import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import MemberApp from "@/components/sections/MemberApp";
import PageCta from "@/components/sections/PageCta";

export const metadata: Metadata = pageMetadata({
  title: "Spor Salonu Üye Uygulaması: Ders Rezervasyonu ve Paket Takibi",
  description:
    "Üyeleriniz ders rezervasyonunu, iptalini ve kalan ders hakkını telefonundan takip eder. iOS ve Android için ücretsiz Vetra uygulaması.",
  path: "/uye-uygulamasi",
});

export default function UyeUygulamasiPage() {
  return (
    <>
      <MemberApp headingAs="h1" />
      <PageCta />
    </>
  );
}
