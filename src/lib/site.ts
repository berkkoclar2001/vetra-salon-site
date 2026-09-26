/**
 * Sitenin mutlak adresi ve marka bilgileri.
 * Canonical, sitemap, robots, Open Graph ve JSON-LD hep buradan okur.
 * Yayında `NEXT_PUBLIC_SITE_URL` gerçek domain olmalı (ör. https://vetra.app).
 */
export const siteConfig = {
  name: "Vetra",
  legalName: "Vetra App Software",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  title: "Spor Salonu ve Pilates Stüdyosu Yönetim Programı",
  description:
    "Pilates, yoga, fitness ve butik ders stüdyoları için üye, randevu, paket, ödeme ve raporlama operasyonunu tek panelde toplayan salon yönetim yazılımı.",
  locale: "tr_TR",
  logo: "/logo.jpg",
  /**
   * İletişim kanalları. Boş bırakılan kanal sitede gösterilmez.
   * whatsapp: ülke koduyla, yalnız rakam (ör. "905321234567").
   * phone: ekranda görünen biçim; `tel:` linki için boşluklar atılır.
   * Adres ve telefon Google İşletme Profili'ndeki yazımla birebir aynı kalmalı.
   */
  contact: {
    whatsapp: "905316554416" as string,
    phone: "0531 655 44 16" as string,
    email: "vetraakademi@gmail.com" as string,
  },
  address: {
    street: "Atakent Mah. 235. Sk. No:19 D:6, Lounge 2 Point Çarşı",
    district: "Küçükçekmece",
    city: "İstanbul",
    postalCode: "34303",
    country: "TR",
  },
  /** schema.org günleri + görünür metin tek listeden üretilir. */
  hours: [
    { label: "Hafta içi", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "19:00" },
    { label: "Cumartesi", days: ["Saturday"], opens: "10:00", closes: "15:00" },
  ],
} as const;

export const fullAddress = () => {
  const a = siteConfig.address;
  return `${a.street}, ${a.postalCode} ${a.district}/${a.city}`;
};

export const mapsUrl = () =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress())}`;

/** Telefon numarasını uluslararası biçime çevirir: "0531 655 44 16" → "+905316554416". */
export const phoneE164 = () => `+90${siteConfig.contact.phone.replace(/\D/g, "").replace(/^0/, "")}`;

export const absoluteUrl = (path = "/") => `${siteConfig.url}${path === "/" ? "" : path}`;

/**
 * Sayfa metadata'sı: başlık, açıklama, canonical ve Open Graph'ı tek yerden üretir.
 * Sayfada `openGraph` tanımlamak kök layout'takini tamamen ezdiği için ortak alanlar burada tekrar verilir.
 */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website" as const,
      locale: siteConfig.locale,
      siteName: siteConfig.legalName,
      title,
      description,
      url: path,
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: title }],
    },
  };
}

/**
 * Site geneli schema.org grafiği: firma, web sitesi ve yazılım ürünü.
 * `offers` bilinçli olarak yok — fiyatlar örnek; gerçek fiyatlar girilince eklenecek.
 */
export function siteJsonLd() {
  const org = `${siteConfig.url}/#organization`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": org,
        name: siteConfig.legalName,
        url: siteConfig.url,
        logo: absoluteUrl(siteConfig.logo),
        email: siteConfig.contact.email,
        telephone: phoneE164(),
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.address.street,
          addressLocality: siteConfig.address.district,
          addressRegion: siteConfig.address.city,
          postalCode: siteConfig.address.postalCode,
          addressCountry: siteConfig.address.country,
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: phoneE164(),
          email: siteConfig.contact.email,
          availableLanguage: "Turkish",
          hoursAvailable: siteConfig.hours.map((h) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: h.days,
            opens: h.opens,
            closes: h.closes,
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        name: siteConfig.legalName,
        url: siteConfig.url,
        inLanguage: "tr-TR",
        publisher: { "@id": org },
      },
      {
        "@type": "SoftwareApplication",
        name: `${siteConfig.name} Salon Yönetim Paneli`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: siteConfig.description,
        url: siteConfig.url,
        inLanguage: "tr-TR",
        publisher: { "@id": org },
      },
    ],
  };
}

/** Görünür breadcrumb ile aynı veriden BreadcrumbList şeması. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Sayfadaki görünür SSS ile birebir aynı içerikten FAQPage şeması. */
export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
