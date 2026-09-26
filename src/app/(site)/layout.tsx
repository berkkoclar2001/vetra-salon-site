import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import JsonLd from "@/components/seo/JsonLd";
import { navItems } from "@/lib/navigation";
import { siteJsonLd } from "@/lib/site";

/**
 * Tanıtım sitesinin ortak çerçevesi: sabit üst menü + footer.
 * Panel ve giriş ekranları bu düzenin dışındadır.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <JsonLd data={siteJsonLd()} />
      <SiteHeader navItems={navItems} />
      <main className="pt-16">{children}</main>
      <SiteFooter />
    </div>
  );
}
