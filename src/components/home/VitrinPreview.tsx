import { CalendarDays, Instagram, MapPin, MessageCircle, Star } from "lucide-react";

const links = [
    { icon: CalendarDays, label: "Ders Programı & Rezervasyon", primary: true },
    { icon: MapPin, label: "Yol Tarifi Al" },
    { icon: MessageCircle, label: "WhatsApp'tan Yaz" },
    { icon: Instagram, label: "Instagram" },
    { icon: Star, label: "Google'da Değerlendir" },
];

/**
 * Vitrin sayfasının telefon önizlemesi.
 * Salonun panelde girdiği bilgilerden üretilen, herkese açık tek sayfa.
 */
export default function VitrinPreview() {
    return (
        <div className="mx-auto w-full max-w-[300px]">
            <div className="rounded-[2rem] border-[10px] border-ink bg-white shadow-2xl shadow-black/25">
                <div className="rounded-[1.3rem] bg-sunken p-5">
                    <div className="flex flex-col items-center text-center">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-lg font-semibold text-white">
                            AP
                        </span>
                        <p className="mt-3 text-base font-semibold text-ink">Ayşe Pilates</p>
                        <p className="text-xs text-quiet">Reformer Pilates &amp; Yoga · Kadıköy</p>
                    </div>

                    <div className="mt-5 space-y-2">
                        {links.map((link) => (
                            <div
                                key={link.label}
                                className={
                                    link.primary
                                        ? "flex items-center gap-2.5 rounded-lg bg-ink px-3 py-2.5 text-[13px] font-semibold text-white"
                                        : "flex items-center gap-2.5 rounded-lg border border-line bg-white px-3 py-2.5 text-[13px] font-medium text-body"
                                }
                            >
                                <link.icon className="h-4 w-4 shrink-0" />
                                {link.label}
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 rounded-lg border border-line bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-lime-deep">
                            Bugünün dersleri
                        </p>
                        <div className="mt-2 space-y-1.5">
                            {[
                                ["09:00", "Reformer", "2 yer"],
                                ["11:00", "Yoga", "Dolu"],
                                ["18:30", "Reformer", "5 yer"],
                            ].map(([time, name, slot]) => (
                                <div key={time} className="flex items-center justify-between text-[12px]">
                                    <span className="font-semibold text-ink">{time}</span>
                                    <span className="text-body">{name}</span>
                                    <span className={slot === "Dolu" ? "text-danger" : "text-success"}>{slot}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="mt-4 text-center text-[10px] text-quiet">vetra.app/vitrin/ayse-pilates</p>
                </div>
            </div>
        </div>
    );
}
