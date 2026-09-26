import type { MetadataRoute } from "next";
import { legalLinks, navItems } from "@/lib/navigation";
import { absoluteUrl } from "@/lib/site";

/** Menüdeki her rota sitemap'e girer; yeni sayfa menüye eklenince burası kendiliğinden güncellenir. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = navItems.flatMap((entry) =>
    entry.children ? entry.children.map((c) => c.href) : entry.href ? [entry.href] : [],
  );

  // lastModified bilinçli olarak yok: her istekte "şimdi" demek Google'ın lastmod'a güvenini düşürür.
  return ["/", ...paths, ...legalLinks.map((l) => l.href)].map((path) => ({ url: absoluteUrl(path) }));
}
