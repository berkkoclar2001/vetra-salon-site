import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import ContactSection from "@/components/sections/ContactSection";

export const metadata: Metadata = pageMetadata({
  title: "Teklif Alın",
  description:
    "Salonunuz için Vetra kurulumunu birlikte planlayalım. Ücretsiz kurulum, veri taşıma ve ekip eğitimi için teklif alın.",
  path: "/iletisim",
});

export default function IletisimPage() {
  return <ContactSection headingAs="h1" />;
}
