import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /login taranabilir kalır ki noindex etiketini Google görebilsin; panel hiç taranmaz.
      disallow: ["/dashboard"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
