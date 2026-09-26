import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/sections/LegalPage";
import { pageMetadata, siteConfig } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Gizlilik Politikası",
  description:
    "Vetra'yı kullanan salonların panele girdiği kayıtların kime ait olduğu, bu kayıtlarla ne yaptığımız ve asla yapmadığımız, verilerin nasıl korunduğu, dışa aktarıldığı ve silindiği.",
  path: "/gizlilik-politikasi",
});

const { legalName, contact } = siteConfig;

/**
 * Salonlara verilen taahhütler. Buradaki her madde üründe ve operasyonda gerçekten karşılanabilmeli;
 * karşılanamayan bir söz yazılmamalı. Özellikle dışa aktarma biçimi ve 30 günlük süreler
 * backend/operasyonla teyit edilmeli.
 */
const neverDo = [
  "Salonunuzun kayıtlarını satmayız, kiralamayız veya reklam amacıyla kimseye vermeyiz.",
  "Üyelerinizle kendi adımıza iletişime geçmez, onlara kampanya veya teklif göndermeyiz.",
  "Üye listenizi başka bir salona, rakibinize ya da bir veri şirketine aktarmayız.",
  "Kayıtlarınızı, sizi veya üyelerinizi tanımlayabilecek şekilde başka bir amaçla kullanmayız.",
];

const access = [
  {
    who: "Sizin yetki verdiğiniz kullanıcılar",
    when: "Salon sahibi, yönetici, eğitmen veya resepsiyon; her biri yalnız rolünün açtığı ekranları görür. Kimin hangi yetkiye sahip olacağına siz karar verirsiniz.",
  },
  {
    who: "Vetra destek ekibi",
    when: "Yalnız siz destek istediğinizde veya hizmetin çalışmasını bozan bir arızayı gidermek gerektiğinde, işin gerektirdiği kayıtlarla sınırlı olarak.",
  },
  {
    who: "Altyapı sağlayıcılarımız",
    when: "Sunucu, veritabanı ve yedekleme hizmeti aldığımız firmalar. Kayıtlarınızı kendi amaçları için kullanamaz, yalnız hizmetin çalışması için barındırırlar.",
  },
  {
    who: "Yetkili kamu kurumları ve mahkemeler",
    when: "Yalnız kanunun zorunlu kıldığı durumlarda ve usulüne uygun bir karar veya yazılı talep üzerine, istenen kapsamla sınırlı olarak.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Gizlilik Politikası"
      description="Salonunuzun Vetra'ya girdiği üye, ders ve ödeme kayıtları size aittir. Bu sayfada o kayıtlarla ne yaptığımızı, ne yapmadığımızı ve kontrolün nasıl sizde kaldığını anlatıyoruz."
      updated="17 Eylül 2026"
    >
      <p>
        Bu politika, <strong>{legalName}</strong> (&quot;Vetra&quot;, &quot;biz&quot;) tarafından sunulan salon
        yönetim paneline ve bu tanıtım sitesine uygulanır. Vetra ile yaptığınız hizmet sözleşmesinin bir parçasıdır.
        Hangi kişisel verileri hangi hukuki sebeple işlediğimizi ve 6698 sayılı Kanun&apos;dan doğan haklarınızı ayrıca{" "}
        <Link href="/kvkk">KVKK Aydınlatma Metni</Link>&apos;nde, tarayıcınızda tutulan kayıtları ise{" "}
        <Link href="/cerez-politikasi">Çerez Politikası</Link>&apos;nda bulabilirsiniz.
      </p>

      <h2>1. Kayıtlarınız sizindir</h2>
      <p>
        Panele girdiğiniz üye bilgileri, paketler, ders programı, yoklamalar, ödemeler, ölçümler ve raporlar
        salonunuza aittir. Kişisel verilerin korunması mevzuatı bakımından bu kayıtların <strong>veri sorumlusu
        salonunuzdur</strong>; Vetra ise bu kayıtları yalnız sizin adınıza ve talimatlarınız doğrultusunda barındıran{" "}
        <strong>veri işleyendir</strong>.
      </p>
      <p>
        Bu nedenle üyelerinizin kayıtlarını panele girmeden önce onları bilgilendirmek, gerekiyorsa onaylarını almak
        ve özellikle sağlık notu gibi hassas bilgileri kaydederken hukuki şartları sağlamak salonunuzun
        sorumluluğundadır. Bu konuda yardıma ihtiyaç duyarsanız bize yazabilirsiniz.
      </p>

      <h2>2. Kayıtlarınızı ne için kullanırız?</h2>
      <p>Kayıtlarınızı yalnız size hizmet vermek için kullanırız:</p>
      <ul>
        <li>Paneli çalıştırmak; ekranları, hatırlatmaları ve raporları sizin için üretmek,</li>
        <li>Talep ettiğiniz kurulum, veri taşıma, eğitim ve destek işlemlerini yapmak,</li>
        <li>Hataları bulup düzeltmek, sistemi yetkisiz erişime ve kötüye kullanıma karşı korumak,</li>
        <li>Yedek almak ve bir arıza olduğunda kayıtlarınızı geri yüklemek.</li>
      </ul>
      <p>
        Ürünü geliştirmek için hangi ekranın ne sıklıkla kullanıldığı gibi <strong>toplu ve kimseyi tanımlamayan</strong>{" "}
        kullanım ölçümlerine bakabiliriz. Bu ölçümler hiçbir salon, kullanıcı veya üyeyle ilişkilendirilemez.
      </p>

      <h2>3. Asla yapmadıklarımız</h2>
      <ul>
        {neverDo.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>4. Kayıtlarınızı kim görebilir?</h2>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Kim</th>
              <th>Hangi durumda</th>
            </tr>
          </thead>
          <tbody>
            {access.map((row) => (
              <tr key={row.who}>
                <td className="w-44 font-medium text-ink">{row.who}</td>
                <td>{row.when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Her salonun kayıtları diğer salonlardan ayrı tutulur; bir salonun kullanıcısı başka bir salonun kayıtlarına
        erişemez. Hizmet sağlayıcılarımızın bir kısmı yurt dışında olabilir; bu durumda aktarımın nasıl yapıldığı{" "}
        <Link href="/kvkk">KVKK Aydınlatma Metni</Link>&apos;nde açıklanmıştır.
      </p>

      <h2>5. Güvenlik</h2>
      {/* KVKK sayfasındaki tedbirlerle aynı kalmalı; ikisi de backend ile teyit edilmeli. */}
      <p>
        Panel ve site bağlantıları şifreli (HTTPS) kurulur, erişim rol bazlı yetkilerle sınırlanır ve kayıtlar düzenli
        olarak yedeklenir. Hiçbir sistem kusursuz değildir; kayıtlarınızın yetkisiz kişilerin eline geçtiğini
        öğrenirsek sizi gecikmeden bilgilendirir, etkilenen kayıtları ve aldığımız önlemleri açıklarız. Veri sorumlusu
        olarak Kişisel Verileri Koruma Kurulu&apos;na ve üyelerinize yapmanız gereken bildirimler için ihtiyaç duyacağınız
        bilgileri de sağlarız.
      </p>
      <p>
        Güvenlik sizin tarafınızda da başlar: panel şifrelerinizi paylaşmayın, ayrılan personelin hesabını kapatın ve
        herkese yalnız işinin gerektirdiği yetkiyi verin.
      </p>

      <h2>6. Sözleşmeniz sona erdiğinde</h2>
      {/* Süre ve dosya biçimi operasyonla teyit edilmeli. */}
      <ul>
        <li>
          Talep etmeniz halinde üye, paket ve ödeme kayıtlarınızı yaygın bir dosya biçiminde (ör. Excel) size teslim
          ederiz. Kayıtlarınızı başka bir programa taşımanızı zorlaştırmayız.
        </li>
        <li>
          Sözleşme bitiminden sonraki 30 gün içinde kayıtlarınızı isteyebilirsiniz. Bu sürenin sonunda panel
          kayıtlarınız yedekler de dahil olmak üzere silinir veya anonim hale getirilir.
        </li>
        <li>
          Fatura ve ödeme kayıtları gibi Vergi Usul Kanunu ve Türk Ticaret Kanunu gereği saklamak zorunda olduğumuz
          bilgiler, yalnız bu yasal süre boyunca ve yalnız bu amaçla tutulur.
        </li>
      </ul>

      <h2>7. Silme talepleri</h2>
      <h3>Salon sahibi veya yetkilisiyseniz</h3>
      <p>
        Tek tek üye kayıtlarını panelden kendiniz silebilirsiniz. Salonunuzun tüm kayıtlarının silinmesini istiyorsanız,
        hesapta kayıtlı e-posta adresinizden <a href={`mailto:${contact.email}`}>{contact.email}</a> adresine yazın.
        Talebin gerçekten sizden geldiğini doğruladıktan sonra en geç 30 gün içinde işlemi tamamlar ve size yazılı
        olarak bildiririz.
      </p>
      <h3>Bir salonun üyesiyseniz</h3>
      <p>
        Kayıtlarınızı tutan ve silinip silinmeyeceğine karar veren, üyesi olduğunuz salondur; talebinizi öncelikle
        salonunuza iletin. Salona ulaşamazsanız <a href={`mailto:${contact.email}`}>{contact.email}</a> adresine hangi
        salonun üyesi olduğunuzu belirterek yazabilirsiniz; talebinizi ilgili salona iletir ve salonun işlemi
        yapabilmesi için gereken teknik desteği veririz. Silme işleminden sonra geçmiş üyelik, ders ve ödeme
        bilgilerinizin salon tarafından görüntülenemeyeceğini hatırlatırız.
      </p>

      <h2>8. Bu politikadaki değişiklikler</h2>
      <p>
        Politikayı güncellediğimizde yeni metni bu sayfada yayımlar, sayfanın başındaki tarihi değiştiririz.
        Kayıtlarınızın kullanımını genişleten önemli bir değişiklik olursa, yürürlüğe girmeden en az 15 gün önce
        müşterilerimize e-postayla haber veririz.
      </p>

      <h2>9. Bize ulaşın</h2>
      <p>
        Gizlilikle ilgili her sorunuz için <a href={`mailto:${contact.email}`}>{contact.email}</a> adresine yazabilir
        veya {contact.phone} numaralı telefondan bize ulaşabilirsiniz.
      </p>
    </LegalPage>
  );
}
