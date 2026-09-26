import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Reports from "@/components/sections/Reports";
import PageCta from "@/components/sections/PageCta";

export const metadata: Metadata = pageMetadata({
  title: "Spor Salonu Raporlama: Kapasite, Tahsilat, Eğitmen",
  description:
    "Üyelik, kapasite, rezervasyon, borç listesi, eğitmen performansı ve dondurma raporlarıyla salonunuzun nereye aktığını tek ekranda görün.",
  path: "/raporlar",
});

export default function RaporlarPage() {
  return (
    <>
      <Reports headingAs="h1" />
      <PageCta />
    </>
  );
}
