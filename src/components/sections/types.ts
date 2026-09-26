/**
 * Bölüm bileşenleri hem ana sayfada (h2) hem kendi alt sayfalarında (sayfanın tek h1'i) kullanılır.
 * Alt sayfa, en üstteki bölüme `headingAs="h1"` verir.
 * Ana sayfadaki özet kullanımda `detailHref` verilirse bölüm kendi alt sayfasına "Detaylı incele" linki gösterir.
 */
export type SectionProps = { headingAs?: "h1" | "h2"; detailHref?: string };
