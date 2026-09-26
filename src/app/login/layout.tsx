import type { Metadata } from "next";

// Giriş sayfası client bileşeni olduğu için metadata burada tanımlanır.
export const metadata: Metadata = {
  title: "Panel Girişi",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
