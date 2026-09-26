import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import VerticalTabs from "@/components/home/VerticalTabs";
import PageCta from "@/components/sections/PageCta";
import { verticals } from "@/lib/verticals";

export const metadata: Metadata = pageMetadata({
  title: "Pilates, Yoga ve Fitness Salonları İçin Yazılım",
  description:
    "Pilates stüdyoları, yoga, personal training, fizyoterapi, fitness salonları ve dans kursları için hazır kurulum. Branş ve paketlerinizi siz tanımlarsınız.",
  path: "/kimler-icin",
});

export default function KimlerIcinPage() {
  return (
    <>
      <VerticalTabs
        headingAs="h1"
        items={verticals.map(({ id, slug, tab, title, intro, points, screens }) => ({ id, slug, tab, title, intro, points, screens }))}
      />
      <PageCta />
    </>
  );
}
