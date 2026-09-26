import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { legalLinks, navItems } from "@/lib/navigation";
import { fullAddress, mapsUrl, siteConfig } from "@/lib/site";

const companyLinks = [
  { label: "Fiyatlar", href: "/fiyatlar" },
  { label: "İletişim", href: "/iletisim" },
  { label: "Panel Girişi", href: "/login" },
];

const { whatsapp, phone, email } = siteConfig.contact;

/** Boş kanal gösterilmez; `data-contact` GTM tıklama dönüşümü içindir. */
const contactItems = [
  { id: "phone", icon: Phone, text: phone, href: `tel:${phone.replace(/\s/g, "")}` },
  { id: "whatsapp", icon: MessageCircle, text: "WhatsApp'tan yazın", value: whatsapp, href: `https://wa.me/${whatsapp}` },
  { id: "email", icon: Mail, text: email, href: `mailto:${email}` },
].filter((item) => item.value ?? item.text);

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();
  // Menüdeki açılır gruplar footer'da sütun olur; her sayfadan tüm alt sayfalara iç link verilir.
  const columns = [
    ...navItems.filter((e) => e.children).map((e) => ({ title: e.label, links: e.children! })),
    { title: "Vetra", links: companyLinks },
    { title: "Yasal Metinler", links: legalLinks },
  ];

  return (
    <footer className="border-t border-ink-line bg-ink py-14 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_2fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3" aria-label="Vetra ana sayfa">
            <span className="relative h-10 w-10 overflow-hidden rounded-md bg-black ring-1 ring-ink-line">
              <Image src="/logo.jpg" alt="" fill sizes="40px" className="object-contain p-1" />
            </span>
            <span className="font-semibold">Vetra App Software</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-on-ink-muted">
            Pilates, yoga, fitness ve butik ders stüdyoları için üye takip ve salon yönetim programı.
          </p>

          <address className="mt-6 space-y-3 text-sm not-italic leading-6 text-on-ink-muted">
            {contactItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                data-contact={item.id}
                {...(item.id === "whatsapp" && { target: "_blank", rel: "noopener noreferrer" })}
                className="flex items-center gap-3 transition hover:text-white"
              >
                <item.icon className="h-4 w-4 shrink-0 text-lime" aria-hidden />
                {item.text}
              </a>
            ))}
            <a
              href={mapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              data-contact="address"
              className="flex max-w-sm gap-3 transition hover:text-white"
            >
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-lime" aria-hidden />
              {fullAddress()}
            </a>
            <p className="flex gap-3">
              <Clock className="mt-1 h-4 w-4 shrink-0 text-lime" aria-hidden />
              <span>
                {siteConfig.hours.map((h) => (
                  <span key={h.label} className="block">
                    {h.label} {h.opens}–{h.closes}
                  </span>
                ))}
              </span>
            </p>
          </address>
        </div>

        <nav aria-label="Alt menü" className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {columns.map((column) => (
            <div key={column.title}>
              {/* md+: başlıklar 2 satır yüksekliğinde; uzun başlıklar sarınca linkler hizalı kalır. */}
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-lime md:min-h-10">{column.title}</p>
              <ul className="mt-4 space-y-1">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block py-1.5 text-sm text-on-ink-muted transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="mx-auto mt-12 max-w-7xl border-t border-ink-line px-4 pt-6 text-sm text-on-ink-faint sm:px-6 lg:px-8">
        <p>© {currentYear} {siteConfig.legalName}</p>
      </div>
    </footer>
  );
}
