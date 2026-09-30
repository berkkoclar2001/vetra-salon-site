import Image from "next/image";
import Link from "next/link";
import { memberLinks } from "@/lib/navigation";
import { siteConfig } from "@/lib/site";

/**
 * Üye uygulamasının ve App Store kaydının açtığı sayfaların düzeni: /destek, /uye-kullanim-kosullari,
 * /gizlilik-politikasi, /kvkk, /cerez-politikasi.
 * App Store 3.1.1 gereği tanıtım sitesinin menüsü ve footer'ı (Fiyatlar, İletişim) burada yoktur;
 * bu sayfalardan tanıtım sayfalarına bağlantı verilmemeli.
 * Uygulama `main` dışındaki header/footer'ı gizlediği için tüm içerik tek `main` içinde durur.
 */
export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-black">
            <Image src="/vetra.jpeg" alt="" fill sizes="40px" className="object-contain p-1" />
          </span>
          <span className="text-lg font-semibold text-ink">{siteConfig.legalName}</span>
        </div>
      </div>

      {children}

      <nav aria-label="Üye bağlantıları" className="border-t border-line py-8">
        <ul className="mx-auto flex max-w-3xl flex-wrap gap-x-6 gap-y-2 px-4 text-sm sm:px-6 lg:px-8">
          {memberLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-quiet underline underline-offset-2 transition hover:text-ink">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-4 max-w-3xl px-4 text-sm text-quiet sm:px-6 lg:px-8">
          © {new Date().getFullYear()} {siteConfig.legalName}
        </p>
      </nav>
    </main>
  );
}
