import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/sections/LegalPage";
import { pageMetadata, siteConfig } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Üye Kullanım Koşulları",
  description:
    "Vetra üye uygulamasını kullanan salon üyeleri için kurallar: hesabı kimin açtığı, paketler ve ödeme, rezervasyon ve iptal, hesap güvenliği, hesap silme ve iletişim.",
  path: "/uye-kullanim-kosullari",
});

const { legalName } = siteConfig;
const email = siteConfig.contact.memberSupportEmail;

/**
 * Üye uygulamasındaki "Kullanıcı Sözleşmesi" satırı bu sayfayı açar.
 * App Store 3.1.1 gereği burada ücret, plan, otomatik yenileme veya iade gibi salon sözleşmesine ait
 * maddeler ve /fiyatlar, /iletisim gibi tanıtım sayfalarına bağlantı olmamalı. Salonlarla yapılan
 * sözleşme /kullanici-sozlesmesi adresindedir. Silme süreleri uygulamadaki akışla aynı kalmalı.
 */
export default function MemberTermsPage() {
  return (
    <LegalPage
      title="Üye Kullanım Koşulları"
      description="Vetra üye uygulamasını kullanan salon üyeleri için kurallar. Uygulamayı kullanarak bu koşulları kabul etmiş olursunuz."
      updated="1 Ekim 2026"
    >
      <h2>1. Taraflar ve roller</h2>
      <ul>
        <li>
          Uygulamadaki hesabınızı <strong>üyesi olduğunuz salon</strong> açar. Üyeliğiniz, paketleriniz, ders
          programı, ders ve iptal kuralları sizinle salonunuz arasındadır.
        </li>
        <li>
          <strong>{legalName}</strong> (&quot;Vetra&quot;), salonunuzun kullandığı yazılımı sağlar ve üye verilerinizi
          salonunuz adına işler. Kişisel verilerin korunması mevzuatı bakımından <strong>veri sorumlusu
          salonunuz</strong>, Vetra ise <strong>veri işleyendir</strong>. Ayrıntılar{" "}
          <Link href="/kvkk">KVKK Aydınlatma Metni</Link> ve <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link>
          &apos;ndadır.
        </li>
      </ul>

      <h2>2. Uygulama ücretsizdir</h2>
      <p>
        Uygulamayı indirmek ve hesabınızı kullanmak ücretsizdir. Hesap açmak için sizden ücret alınmaz, uygulamada
        satın alma yoktur.
      </p>

      <h2>3. Paketler ve ödeme</h2>
      <p>
        Paketler salonda satın alınır ve ödeme doğrudan salona yapılır. Uygulama yalnız paketinizde kalan ders
        hakkını ve salona yaptığınız ödemelerin kaydını gösterir. Paketinizle veya bir ödeme kaydıyla ilgili
        sorularınız için salonunuzla görüşün.
      </p>

      <h2>4. Rezervasyon ve iptal</h2>
      <ul>
        <li>Derslere uygulamadan yer ayırtabilir ve rezervasyonlarınızı uygulamadan iptal edebilirsiniz.</li>
        <li>İptal süresini ve ders kurallarını salonunuz belirler.</li>
        <li>Salonun belirlediği süre içinde iptal ettiğiniz dersin hakkı paketinize geri döner.</li>
      </ul>

      <h2>5. Hesap güvenliği</h2>
      <ul>
        <li>Giriş bilgileriniz size özeldir; başkasıyla paylaşmayın ve hesabınızı başkasına kullandırmayın.</li>
        <li>
          Şifrenizi unutursanız giriş ekranındaki &quot;Şifremi unuttum&quot; ile sıfırlayabilirsiniz.
        </li>
        <li>
          Hesabınızın başkası tarafından kullanıldığından şüphelenirseniz şifrenizi değiştirin ve salonunuza ya da{" "}
          <a href={`mailto:${email}`}>{email}</a> adresine haber verin.
        </li>
      </ul>

      <h2>6. Hesap silme</h2>
      <ul>
        <li>
          Hesabınızın silinmesini uygulamada <strong>Profil &gt; Profili düzenle &gt; Hesabımı Sil</strong> adımlarıyla
          isteyebilirsiniz.
        </li>
        <li>Talebiniz salonunuza iletilir ve salonunuz hesabınızı en geç 30 gün içinde siler.</li>
        <li>Bu süre içinde talebinizi geri çekebilirsiniz.</li>
        <li>Yedeklerdeki kopyalar da en geç 30 gün içinde silinir.</li>
        <li>Kanunen saklanması zorunlu kayıtlar yalnız yasal süre boyunca ve yalnız bu amaçla tutulur.</li>
      </ul>

      <h2>7. Kullanım kuralları</h2>
      <p>Uygulamayı yalnız kendi üyeliğinizi takip etmek için kullanabilirsiniz. Aşağıdakiler yasaktır:</p>
      <ul>
        <li>Başka bir üyenin hesabına veya kayıtlarına erişmeye çalışmak,</li>
        <li>Gerçekte katılmayacağınız derslere toplu veya otomatik rezervasyon yaparak diğer üyelerin yerini almak,</li>
        <li>Uygulamayı bozmaya, yavaşlatmaya veya güvenliğini aşmaya çalışmak,</li>
        <li>Uygulamayı kanuna aykırı bir amaçla kullanmak.</li>
      </ul>
      <p>
        Bu kurallara aykırı kullanımda salonunuz veya Vetra hesabınızın erişimini geçici olarak kısıtlayabilir.
      </p>

      <h2>8. Sorumluluğun sınırı</h2>
      <ul>
        <li>
          Dersler, eğitmenler, paket içerikleri ve salonun verdiği hizmetten salonunuz sorumludur. Vetra bu hizmetin
          tarafı değildir.
        </li>
        <li>
          Uygulamanın kesintisiz çalışması için çalışırız; ancak bakım, internet bağlantısı veya kontrolümüz dışındaki
          sebeplerle kısa süreli kesintiler olabilir.
        </li>
        <li>
          Bu sınırlamalar kastımız veya ağır ihmalimizle verilen zararlarda ve kanunen sınırlanamayan hallerde
          uygulanmaz.
        </li>
      </ul>

      <h2>9. Bu koşullardaki değişiklikler</h2>
      <p>
        Koşulları güncellediğimizde yeni metni bu sayfada yayımlar, sayfanın başındaki tarihi değiştiririz. Haklarınızı
        daraltan önemli bir değişikliği yürürlüğe girmeden önce bu sayfada duyururuz. Değişiklikten sonra
        uygulamayı kullanmaya devam etmeniz, güncel koşulları kabul ettiğiniz anlamına gelir.
      </p>

      <h2>10. İletişim</h2>
      <p>
        Uygulamayla ilgili sorularınız için <a href={`mailto:${email}`}>{email}</a> adresine yazabilirsiniz. Üyeliğiniz,
        paketleriniz veya dersleriniz hakkındaki sorular için salonunuzla görüşün.
      </p>
    </LegalPage>
  );
}
