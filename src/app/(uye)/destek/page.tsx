import type { Metadata } from "next";
import LegalPage from "@/components/sections/LegalPage";
import { pageMetadata, siteConfig } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Üye Uygulaması Destek",
  description:
    "Vetra üye uygulaması için yardım: giriş bilgileri, şifre sıfırlama, paketler, rezervasyon ve iptal, hesap silme, bildirimler ve iletişim.",
  path: "/destek",
});

const email = siteConfig.contact.memberSupportEmail;

/**
 * App Store Connect'teki destek adresi bu sayfadır. App Store 3.1.1 gereği burada fiyat, plan,
 * satın alma çağrısı veya tanıtım sayfalarına bağlantı olmamalı. Metin uygulamanın diliyle ("sen") yazılır.
 */
export default function MemberSupportPage() {
  return (
    <LegalPage
      eyebrow="Destek"
      title="Vetra Üye Uygulaması — Destek"
      description="Uygulamayla ilgili en sık sorulan konular aşağıda. Cevabını bulamazsan bize e-postayla yaz."
    >
      <h2>Giriş bilgim yok</h2>
      <p>
        Hesabını salonun açar. Salonda kayıtlı telefon numaran ve salonun verdiği şifreyle girersin. Bilgin yoksa
        salonuna sor.
      </p>

      <h2>Şifremi unuttum</h2>
      <p>
        Giriş ekranında &quot;Şifremi unuttum&quot;a dokun ve telefon numaranı gir. 6 haneli kod SMS ya da e-postayla
        gelir, 10 dakika geçerlidir.
      </p>

      <h2>Paketler ve ödeme</h2>
      <p>
        Paketler salonda satın alınır, uygulamada satın alma yoktur. Paketini yenilemek için salonunla görüş.
      </p>

      <h2>Rezervasyon ve iptal</h2>
      <p>
        Dersler sekmesinden yerini ayırt, Rezervasyonlarım&apos;dan iptal et. İptal süresini salonun belirler.
      </p>

      <h2>Hesabımı silmek istiyorum</h2>
      <p>
        Profil &gt; Profili düzenle &gt; Hesabımı Sil. Talep salona gider ve en geç 30 gün içinde tamamlanır. Bu süre
        içinde talebini geri çekebilirsin.
      </p>
      <p>
        Uygulamaya giremiyorsan <a href={`mailto:${email}`}>{email}</a> adresine salonunun adını ve salonda kayıtlı
        telefon numaranı yazarak silme talebi gönderebilirsin.
      </p>

      <h2>Bildirimler</h2>
      <p>Ders hatırlatmasını Ayarlar&apos;dan açıp kapatabilirsin.</p>

      <h2>İletişim</h2>
      <p>
        <a href={`mailto:${email}`}>{email}</a>
      </p>
    </LegalPage>
  );
}
