type Props = {
  /** Tarayıcı çubuğunda gösterilecek sahte adres. */
  address?: string;
  className?: string;
  children: React.ReactNode;
};

/** Panel görsellerini saran sahte tarayıcı çerçevesi (hero ekran görüntüsü ve canlı önizleme). */
export default function BrowserFrame({ address = "panel.vetra.app", className = "", children }: Props) {
  return (
    <figure className={`overflow-hidden rounded-xl border border-ink-line bg-white shadow-2xl shadow-black/40 ${className}`}>
      <div className="flex h-9 items-center gap-2 border-b border-line bg-sunken px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-[#e5675c]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#e2b04a]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#5eb264]" />
        <span className="mx-auto rounded-md bg-white/70 px-3 py-0.5 text-[11px] font-medium text-quiet">{address}</span>
      </div>
      {children}
    </figure>
  );
}
