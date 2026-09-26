import CountUp from "@/components/motion/CountUp";
import BusinessMarquee from "./BusinessMarquee";

const metrics = [
  { value: 9, label: "panel modülü" },
  { value: 10, label: "hazır işletme raporu" },
  { value: "Tek ekran", label: "üye, randevu, ödeme ve rapor takibi" },
];

export default function MetricsStrip() {
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-3 sm:px-6 lg:px-8">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex items-center gap-4 border-t border-line pt-4 first:border-t-0 first:pt-0 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0 sm:first:border-l-0 sm:first:pl-0">
            <strong className="text-2xl font-semibold text-ink">
              {typeof metric.value === "number" ? <CountUp value={metric.value} /> : metric.value}
            </strong>
            <span className="max-w-40 text-sm leading-5 text-quiet">{metric.label}</span>
          </div>
        ))}
      </div>
      <BusinessMarquee />
    </section>
  );
}
