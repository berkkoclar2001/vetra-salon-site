import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import MemberApp from "@/components/sections/MemberApp";
import PageCta from "@/components/sections/PageCta";

export const metadata: Metadata = pageMetadata({
  title: "Spor Salonu Üye Uygulaması: Rezervasyon ve QR Giriş",
  description:
    "Üyeleriniz ders rezervasyonunu, paket bakiyesini ve QR ile salon girişini telefonundan yapar. Salonunuzun markasıyla iOS ve Android.",
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
