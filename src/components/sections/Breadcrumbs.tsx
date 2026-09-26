import Link from "next/link";
import { ChevronRight } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/site";

/** Görünür konum yolu + BreadcrumbList şeması. Son öğe mevcut sayfadır. */
export default function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Konum" className="text-sm">
      <JsonLd data={breadcrumbJsonLd(items)} />
      <ol className="flex flex-wrap items-center gap-1.5 text-on-ink-faint">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="inline-block py-1.5 text-on-ink-muted">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.path} className="inline-block py-1.5 transition hover:text-white">
                    {item.name}
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
