import Reveal from "@/components/motion/Reveal";
import { Clock3, ClipboardList, MessagesSquare } from "lucide-react";

export default function BenefitCards() {
  return (
    <section className="bg-paper pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal stagger spotlight className="grid gap-4 md:grid-cols-3">
          <div className="spotlight rounded-lg border border-line bg-white p-6">
            <Clock3 className="h-7 w-7 text-lime-deep" />
            <h3 className="mt-5 text-xl font-semibold text-ink">Daha az manuel takip</h3>
            <p className="mt-3 leading-7 text-quiet">Paket hakkı, seans katılımı, ödeme ve notlar dağınık defterlerden çıkar.</p>
          </div>
          <div className="spotlight rounded-lg border border-line bg-white p-6">
            <ClipboardList className="h-7 w-7 text-lime-deep" />
            <h3 className="mt-5 text-xl font-semibold text-ink">Daha net ekip akışı</h3>
            <p className="mt-3 leading-7 text-quiet">Personel ve eğitmenler kendi görev alanlarını aynı takvim ve üye verisi üzerinden izler.</p>
          </div>
          <div className="spotlight rounded-lg border border-line bg-white p-6">
            <MessagesSquare className="h-7 w-7 text-lime-deep" />
            <h3 className="mt-5 text-xl font-semibold text-ink">Daha iyi üye ilişkisi</h3>
            <p className="mt-3 leading-7 text-quiet">Doğum günü, kalan ders ve üyelik yenileme gibi temas noktalarını kaçırmak zorlaşır.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
