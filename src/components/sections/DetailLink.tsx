import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Ana sayfa özetlerinden alt sayfaya giden link. İç linklemenin ana kaynağı. */
export default function DetailLink({
  href,
  children = "Detaylı incele",
  tone = "light",
  className = "",
}: {
  href: string;
  children?: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 text-base font-semibold underline-offset-4 hover:underline ${
        tone === "dark" ? "text-lime" : "text-ink"
      } ${className}`}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
    </Link>
  );
}
