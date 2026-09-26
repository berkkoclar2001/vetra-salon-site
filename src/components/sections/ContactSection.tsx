import Reveal from "@/components/motion/Reveal";
import { ArrowRight, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { onboardingSteps } from "@/lib/onboarding";
import { fullAddress, mapsUrl, siteConfig } from "@/lib/site";
import type { SectionProps } from "./types";

type Channel = {
  /** GTM'de tıklama dönüşümü olarak dinlenecek anahtar (`data-contact`). */
  id: "whatsapp" | "phone" | "email";
  icon: LucideIcon;
  label: string;
  hint: string;
  value: string;
  display: string;
  href: string;
};

const { whatsapp, phone, email } = siteConfig.contact;
const hoursText = siteConfig.hours.map((h) => `${h.label} ${h.opens}–${h.closes}`).join(" · ");
const whatsappText = "Merhaba, salonum için Vetra hakkında bilgi almak istiyorum.";

const channels: Channel[] = [
  {
    id: "whatsapp" as const,
    icon: MessageCircle,
    label: "WhatsApp'tan yazın",
    hint: "En hızlı yol; genellikle aynı gün dönüyoruz.",
    value: whatsapp,
    display: whatsapp.replace(/^(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})$/, "+$1 $2 $3 $4 $5"),
    href: `https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappText)}`,
  },
  {
    id: "phone" as const,
    icon: Phone,
    label: "Arayın",
    hint: hoursText,
    value: phone,
    display: phone,
    href: `tel:${phone.replace(/\s/g, "")}`,
  },
  {
    id: "email" as const,
    icon: Mail,
    label: "E-posta gönderin",
    hint: "Salonunuzu ve ihtiyacınızı kısaca anlatın.",
    value: email,
    display: email,
    href: `mailto:${email}?subject=${encodeURIComponent("Vetra teklif talebi")}`,
  },
].filter((c) => c.value);

export default function ContactSection({ headingAs: Heading = "h2" }: SectionProps) {
  return (
    <section className="border-y border-line bg-white py-16 sm:py-20">
      {/* Mobilde sıra başlık → kanallar → adımlar (aksiyon ilk ekranda); masaüstünde kanallar sağ sütunda. */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-x-16 lg:px-8">
        <div className="hero-rise order-1 lg:order-none lg:col-start-1">
          <span className="text-sm font-semibold uppercase tracking-[0.08em] text-lime-deep">İletişim</span>
          <Heading className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Salonunuz için Vetra kurulumunu konuşalım
          </Heading>
          <p className="mt-5 text-lg leading-8 text-quiet">
            Salonunuzu kısaca anlatın, size uygun kurulumu ve paketi birlikte belirleyelim. Kurulum ücretsiz,
            taahhüt yok.
          </p>
        </div>

        <Reveal as="ol" stagger className="order-3 space-y-6 lg:order-none lg:col-start-1">
          {onboardingSteps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-ink text-sm font-bold text-lime">
                {index + 1}
              </span>
              <div>
                <p className="font-semibold text-ink">{step.title}</p>
                <p className="mt-1 leading-7 text-quiet">{step.text}</p>
              </div>
            </li>
          ))}
        </Reveal>

        <div style={{ "--d": "120ms" } as React.CSSProperties} className="hero-rise order-2 space-y-3 self-start lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {channels.map((channel, index) => (
            <a
              key={channel.id}
              href={channel.href}
              data-contact={channel.id}
              {...(channel.id === "whatsapp" && { target: "_blank", rel: "noopener noreferrer" })}
              className={`group flex items-center gap-4 rounded-xl border p-5 transition ${
                index === 0
                  ? "border-ink bg-ink text-white hover:bg-ink-hover"
                  : "border-line bg-sunken text-ink hover:border-line-strong hover:bg-white"
              }`}
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                  index === 0 ? "bg-lime text-ink" : "bg-white text-ink ring-1 ring-line"
                }`}
              >
                <channel.icon className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-semibold">{channel.label}</span>
                <span className={`block truncate text-sm ${index === 0 ? "text-on-ink-muted" : "text-quiet"}`}>
                  {channel.display}
                </span>
                <span className={`mt-1 block text-sm ${index === 0 ? "text-on-ink-faint" : "text-quiet"}`}>
                  {channel.hint}
                </span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 transition group-hover:translate-x-0.5" />
            </a>
          ))}

          <div className="space-y-3 rounded-xl border border-line p-5 text-sm leading-6 text-quiet">
            <a
              href={mapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              data-contact="address"
              className="flex gap-3 transition hover:text-ink"
            >
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-ink" aria-hidden />
              <span>
                <span className="block font-semibold text-ink">{siteConfig.legalName}</span>
                {fullAddress()}
              </span>
            </a>
            <p className="flex gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-ink" aria-hidden />
              <span>{hoursText}</span>
            </p>
          </div>

          {channels.length === 0 && process.env.NODE_ENV !== "production" && (
            <p className="rounded-xl border border-dashed border-danger/40 bg-danger/5 p-5 text-sm leading-6 text-danger">
              Geliştirme notu: <code>src/lib/site.ts</code> içindeki <code>contact</code> alanına WhatsApp, telefon
              veya e-posta girilmedi. Yayında bu alan boş görünür.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
