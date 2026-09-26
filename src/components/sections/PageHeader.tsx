type Props = {
  eyebrow: string;
  title: string;
  description: string;
};

/** Alt sayfaların ortak giriş başlığı. */
export default function PageHeader({ eyebrow, title, description }: Props) {
  return (
    <section className="border-b border-line bg-paper py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="hero-rise max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-[0.08em] text-lime-deep">
            {eyebrow}
          </span>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-quiet">{description}</p>
        </div>
      </div>
    </section>
  );
}
