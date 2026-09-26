import { Check, Lock } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import BrowserFrame from "@/components/home/BrowserFrame";
import LiveCalendarDemo from "@/components/home/LiveCalendarDemo";

/** 1. adım: salona özel bağlantıdaki giriş ekranı (statik HTML). */
function LinkVisual() {
  return (
    <BrowserFrame address="salonunuz.vetra.app">
      <div className="flex justify-center bg-sunken px-6 py-10">
        <div className="w-full max-w-xs rounded-lg border border-line bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ink text-sm font-bold text-lime">S</span>
            <div>
              <p className="font-semibold text-ink">Salonunuz</p>
              <p className="text-xs text-quiet">Ekip girişi</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3">
            <div>
              <p className="text-xs font-medium text-quiet">Kullanıcı adı</p>
              <p className="mt-1 rounded-md border border-line bg-paper px-3 py-2 text-sm text-body">resepsiyon</p>
            </div>
            <div>
              <p className="text-xs font-medium text-quiet">Şifre</p>
              <p className="mt-1 rounded-md border border-line bg-paper px-3 py-2 text-sm tracking-widest text-body">••••••••</p>
            </div>
            <span className="mt-2 rounded-md bg-ink py-2 text-center text-sm font-semibold text-white">Giriş yap</span>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

// Paneldeki menü yetkileri (src/components/layout/Sidebar.tsx): yönetici dışındakiler yalnız günlük ekranları görür.
const roles = [
  {
    name: "Yönetici",
    who: "Salon sahibi",
    open: ["Panel", "Randevular", "Üyeler", "Personel", "Finansman", "Tanımlamalar", "Raporlar"],
    locked: [],
  },
  {
    name: "Personel",
    who: "Resepsiyon ve eğitmen",
    open: ["Panel", "Randevular", "Üyeler"],
    locked: ["Finansman", "Raporlar"],
  },
];

/** 2. adım: aynı panel, role göre farklı menü. */
function RolesVisual() {
  return (
    <div className="grid gap-4 rounded-xl border border-line bg-sunken p-5 sm:grid-cols-2">
      {roles.map((role) => (
        <div key={role.name} className="rounded-lg border border-line bg-white p-5">
          <p className="font-semibold text-ink">{role.name}</p>
          <p className="text-xs text-quiet">{role.who}</p>
          <ul className="mt-4 grid gap-2 text-sm">
            {role.open.map((item) => (
              <li key={item} className="flex items-center gap-2 text-body">
                <Check className="h-4 w-4 text-lime-deep" strokeWidth={3} />
                {item}
              </li>
            ))}
            {role.locked.map((item) => (
              <li key={item} className="flex items-center gap-2 text-quiet line-through">
                <Lock className="h-4 w-4" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// Yalnız görsel: haftanın en yoğun günü vurgulanır, sayı gösterilmez (Reports bölümüyle aynı dil).
const weekLoad = [58, 72, 64, 86, 100, 76, 34];
const days = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

/** 4. adım: rapor ekranından kesit. */
function ReportsVisual() {
  return (
    <BrowserFrame address="salonunuz.vetra.app/raporlar">
      <div className="grid gap-4 bg-white p-5">
        <div className="rounded-md border border-line px-4 pb-3 pt-4">
          <p className="text-xs font-medium text-quiet">Kapasite · Haftalık yoğunluk</p>
          <Reveal variant="bars-reveal" aria-hidden className="mt-3 flex h-24 items-end gap-2">
            {weekLoad.map((value, i) => (
              <span
                key={days[i]}
                style={{ height: `${value}%` }}
                className={`flex-1 rounded-sm ${value === 100 ? "bg-lime" : "bg-line-strong"}`}
              />
            ))}
          </Reveal>
          <div aria-hidden className="mt-2 flex gap-2">
            {days.map((d) => (
              <span key={d} className="flex-1 text-center text-[11px] text-quiet">{d}</span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm font-medium text-body">
          {["Finans raporları", "Borç listesi", "Eğitmen performansı", "Üyelik analizi"].map((item) => (
            <span key={item} className="rounded-md border border-line bg-paper px-3 py-2">{item}</span>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}

const steps = [
  {
    title: "Salonunuza özel panel linki oluşturulur",
    text: "Kurulumda salonunuz için ayrı bir panel bağlantısı hazırlanır. Ekibiniz tanıtım sitesiyle uğraşmaz; bu bağlantıyı yer imine ekler ve doğrudan kendi girişine ulaşır.",
    visual: <LinkVisual />,
  },
  {
    title: "Ekip üyeleri rolüne göre panele girer",
    text: "Herkes kendi hesabıyla girer. Resepsiyon ve eğitmenler günlük ekranları kullanır; finans, tanımlamalar ve raporlar yalnız yöneticiye açık kalır.",
    visual: <RolesVisual />,
  },
  {
    title: "Üyeler, paketler, seanslar ve ödemeler tek yerde",
    text: "Resepsiyonda üyeyi seçer, seansı işaretlersiniz; randevu takvime düşer. Kontenjan ve katılım durumu randevuyla birlikte güncellenir.",
    visual: <LiveCalendarDemo />,
  },
  {
    title: "Salon sahibi raporlardan kapasite ve gelir durumunu izler",
    text: "Hangi gün ve saatlerin dolduğunu, tahsilatın nerede kaldığını ve eğitmen performansını rapor ekranlarından takip edersiniz.",
    visual: <ReportsVisual />,
  },
];

/** /nasil-calisir sayfasında dört adımı görselleriyle sırayla anlatan bölüm. */
export default function HowItWorksSteps() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-20 px-4 sm:px-6 lg:gap-28 lg:px-8">
        {steps.map((step, index) => (
          <div key={step.title} className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <Reveal className={index % 2 === 1 ? "lg:order-2" : undefined}>
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-lime text-sm font-bold text-ink">
                {index + 1}
              </span>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{step.title}</h2>
              <p className="mt-4 text-lg leading-8 text-quiet">{step.text}</p>
            </Reveal>
            <Reveal className={index % 2 === 1 ? "lg:order-1" : undefined}>{step.visual}</Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
