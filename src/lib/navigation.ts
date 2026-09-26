import type { NavEntry } from "@/components/layout/SiteHeader";
import { verticalHref, verticals } from "@/lib/verticals";

/**
 * Üst menü, footer ve sitemap bu listeden beslenir.
 * "Kimler İçin" altındaki dikey sayfalar her sayfadan iç link alır (SEO).
 */
export const navItems: NavEntry[] = [
  {
    label: "Ürün",
    children: [
      { label: "Özellikler", href: "/ozellikler" },
      { label: "Raporlar", href: "/raporlar" },
      { label: "Üye Uygulaması", href: "/uye-uygulamasi" },
      { label: "Vitrin", href: "/vitrin" },
      { label: "Nasıl çalışır", href: "/nasil-calisir" },
    ],
  },
  {
    label: "Kimler İçin",
    children: [
      { label: "Tüm işletme türleri", href: "/kimler-icin" },
      ...verticals.map((v) => ({ label: v.tab, href: verticalHref(v) })),
    ],
  },
  { label: "Fiyatlar", href: "/fiyatlar" },
  { label: "İletişim", href: "/iletisim" },
];

/** Hukuki metinler: footer'daki yasal metinler sütunu ve sitemap buradan okur. */
export const legalLinks = [
  { label: "Kullanıcı Sözleşmesi", href: "/kullanici-sozlesmesi" },
  { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
  { label: "KVKK Aydınlatma Metni", href: "/kvkk" },
  { label: "Çerez Politikası", href: "/cerez-politikasi" },
];
