import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import VitrinSection from "@/components/sections/VitrinSection";
import PageCta from "@/components/sections/PageCta";

export const metadata: Metadata = pageMetadata({
  title: "Salon Vitrini: Ders Programı ve Online Rezervasyon",
  description:
    "Salonunuzun herkese açık tek sayfası: canlı ders programı, online rezervasyon, yol tarifi ve WhatsApp. Instagram bio'nuza koyacağınız tek link.",
  path: "/vitrin",
});

export default function VitrinPage() {
  return (
    <>
      <VitrinSection headingAs="h1" />
      <PageCta title="Vitrininizi birlikte kuralım" />
    </>
  );
}
