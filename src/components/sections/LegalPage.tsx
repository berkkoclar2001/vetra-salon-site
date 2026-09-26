import PageHeader from "./PageHeader";

type Props = {
  title: string;
  description: string;
  /** Metnin son güncellendiği tarih, ör. "17 Eylül 2026". */
  updated: string;
  children: React.ReactNode;
};

/**
 * KVKK ve çerez politikası gibi uzun hukuki metinlerin ortak düzeni.
 * Tipografi eklentisi olmadığı için başlık, paragraf ve liste stilleri burada tanımlı.
 */
export default function LegalPage({ title, description, updated, children }: Props) {
  return (
    <>
      <PageHeader eyebrow="Yasal" title={title} description={description} />
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-quiet">Son güncelleme: {updated}</p>
          <div className="mt-8 space-y-5 leading-7 text-body [&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-ink [&_li]:mt-2 [&_table]:w-full [&_table]:text-left [&_table]:text-sm [&_td]:border-t [&_td]:border-line [&_td]:py-3 [&_td]:pr-4 [&_td]:align-top [&_th]:pb-2 [&_th]:pr-4 [&_th]:font-semibold [&_th]:text-ink [&_ul]:list-disc [&_ul]:pl-5">
            {children}
          </div>
        </div>
      </section>
    </>
  );
}
