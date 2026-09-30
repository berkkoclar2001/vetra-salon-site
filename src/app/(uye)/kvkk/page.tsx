import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/sections/LegalPage";
import { fullAddress, pageMetadata, siteConfig } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "KVKK Aydınlatma Metni",
  description:
    "Vetra App Software'in hangi durumda hangi kişisel verinizi, hangi amaç ve hukuki sebeple işlediği, kimlerle paylaştığı ve 6698 sayılı Kanun kapsamındaki haklarınızı nasıl kullanabileceğiniz.",
  path: "/kvkk",
});

const { legalName, contact } = siteConfig;

/**
 * Vetra ile karşılaşma anına göre işlenen veriler. Aydınlatma Yükümlülüğü Tebliği'nin istediği
 * "veri – amaç – hukuki sebep – toplama yöntemi" bilgisini her durum için bir arada verir.
 * Yeni bir veri toplama noktası (form, analiz aracı, ödeme altyapısı vb.) eklenirse önce burası güncellenmeli.
 */
const situations = [
  {
    when: "Bize WhatsApp, telefon veya e-postayla ulaştığınızda",
    data: "Adınız, telefon numaranız, e-posta adresiniz, işletmenizin adı ve türü, mesajınızın içeriği.",
    purpose: "Sorunuzu yanıtlamak ve talep ettiğiniz bilgiyi hazırlamak.",
    basis: "Sözleşme öncesi görüşmeler için sözleşmenin kurulmasıyla doğrudan ilgili olması (m. 5/2-c).",
    method: "Sizin bize iletmenizle, elektronik ortamda.",
  },
  {
    when: "Vetra müşterisi olduğunuzda",
    data: "Yetkili kişinin kimlik ve iletişim bilgileri, fatura bilgileri (vergi dairesi ve numarası, gerekirse T.C. kimlik numarası), hizmet ve ödeme kayıtları, destek yazışmaları.",
    purpose: "Hizmet sözleşmesini yürütmek; kurulum, eğitim ve destek vermek; faturalandırmak; muhasebe ve vergi kayıtlarını tutmak.",
    basis: "Sözleşmenin ifası (m. 5/2-c) ve vergi ile ticaret mevzuatından doğan hukuki yükümlülüklerimiz (m. 5/2-ç).",
    method: "Sizden, sözleşme ve fatura süreçlerinde; elektronik ortamda veya yazılı olarak.",
  },
  {
    when: "Vetra paneline giriş yaptığınızda",
    data: "Kullanıcı adınız, rolünüz ve yetkileriniz, giriş zamanları, IP adresi ve tarayıcı bilgisi, panelde yaptığınız işlemlerin kayıtları.",
    purpose: "Hesabınızı doğrulamak, yetkinize göre ekranları göstermek, hesabı yetkisiz erişime karşı korumak, hataları tespit etmek.",
    basis: "Sözleşmenin ifası (m. 5/2-c) ve hizmet güvenliğine yönelik meşru menfaatimiz (m. 5/2-f).",
    method: "Panel kullanımı sırasında otomatik olarak (sunucu kayıtları ve oturum çerezi).",
  },
  {
    when: "Tanıtım sitemizi gezdiğinizde",
    data: "Sunucuya ulaşan teknik bağlantı bilgileri (IP adresi, tarih ve saat, istenen sayfa, tarayıcı türü).",
    purpose: "Sitenin çalışması, kötüye kullanımın ve saldırıların önlenmesi.",
    basis: "Meşru menfaatimiz (m. 5/2-f).",
    method: "Barındırma altyapısı tarafından otomatik olarak. Sitede analiz veya reklam çerezi yoktur.",
  },
  {
    when: "Kampanya ve yenilik duyurularımızı almak istediğinizde",
    data: "Adınız, telefon numaranız ve/veya e-posta adresiniz, onayınızın kaydı.",
    purpose: "Yeni özellikler, kampanyalar ve etkinlikler hakkında ticari elektronik ileti göndermek.",
    basis: "Açık rızanız (m. 5/1) ve 6563 sayılı Kanun kapsamındaki onayınız. Onay vermemeniz hizmetten yararlanmanızı etkilemez; onayınızı dilediğiniz an geri alabilirsiniz.",
    method: "Onay verdiğiniz kanal üzerinden, elektronik ortamda.",
  },
  {
    when: "İş başvurusu yaptığınızda",
    data: "Özgeçmişinizdeki kimlik, iletişim, eğitim ve iş deneyimi bilgileri, görüşme notları.",
    purpose: "Başvurunuzu değerlendirmek ve sizinle iletişime geçmek.",
    basis: "Sözleşmenin kurulmasıyla doğrudan ilgili olması (m. 5/2-c).",
    method: "Sizin bize iletmenizle, elektronik ortamda veya yazılı olarak.",
  },
];

const recipients = [
  {
    who: "Altyapı ve iletişim hizmeti aldığımız firmalar",
    why: "Sunucu, barındırma, yedekleme, e-posta ve mesajlaşma hizmetlerinin sağlanması. Bu firmalar verileri yalnız bizim adımıza ve talimatımızla işler.",
  },
  {
    who: "Muhasebe, mali müşavirlik ve hukuk danışmanlarımız",
    why: "Faturalandırma, vergi beyanları ve hukuki süreçlerin yürütülmesi.",
  },
  {
    who: "Yetkili kamu kurumları ve yargı mercileri",
    why: "Mevzuatın zorunlu kıldığı hallerde veya usulüne uygun bir talep üzerine, talep edilen kapsamla sınırlı olarak.",
  },
];

/** Kanun'un 11. maddesindeki haklar, sade dille yeniden ifade edildi. */
const rights = [
  "Hakkınızda kişisel veri işleyip işlemediğimizi öğrenmek ve işliyorsak bilgi istemek,",
  "Verilerinizi hangi amaçla işlediğimizi ve bu amaca uygun kullanıp kullanmadığımızı öğrenmek,",
  "Verilerinizin yurt içinde veya yurt dışında kimlere aktarıldığını bilmek,",
  "Eksik ya da yanlış bir bilgi varsa düzeltilmesini istemek,",
  "İşlenmesini gerektiren sebep ortadan kalktıysa silinmesini veya yok edilmesini istemek,",
  "Düzeltme veya silme işleminin, verinin aktarıldığı kişilere de bildirilmesini istemek,",
  "Yalnız otomatik sistemlerle yapılan bir analiz sonucunda aleyhinize bir sonuç çıkarsa buna itiraz etmek,",
  "Verilerinizin hukuka aykırı işlenmesi nedeniyle zarar gördüyseniz bu zararın giderilmesini istemek.",
];

export default function KvkkPage() {
  return (
    <LegalPage
      title="KVKK Aydınlatma Metni"
      description="Kişisel verilerinizi ne zaman, neden ve nasıl işlediğimizi; kimlerle paylaştığımızı ve haklarınızı nasıl kullanacağınızı sade bir dille anlatıyoruz."
      updated="30 Eylül 2026"
    >
      <h2>Kısaca</h2>
      <ul>
        <li>
          Yalnız hizmetimizi sunmak, sizinle iletişim kurmak ve yasal yükümlülüklerimizi yerine getirmek için gereken
          bilgileri işleriz.
        </li>
        <li>Kişisel verilerinizi satmayız, kiralamayız, reklam amacıyla başkalarıyla paylaşmayız.</li>
        <li>Tanıtım sitemizde analiz veya reklam çerezi kullanmayız.</li>
        <li>Salonların panele girdiği üye bilgilerinden salonlar sorumludur; biz bu verileri yalnız onlar adına saklarız.</li>
        <li>
          Verilerinizle ilgili her talebinizi <a href={`mailto:${contact.email}`}>{contact.email}</a> adresine
          iletebilirsiniz.
        </li>
      </ul>

      <h2>1. Bu metni kim, neden yayımlıyor?</h2>
      <p>
        Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu&apos;nun (&quot;Kanun&quot;) 10. maddesi ve Aydınlatma
        Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ uyarınca, veri sorumlusu
        sıfatıyla <strong>{legalName}</strong> (&quot;Vetra&quot;) tarafından hazırlanmıştır.
      </p>
      <ul>
        <li>Adres: {fullAddress()}</li>
        <li>Telefon: {contact.phone}</li>
        <li>
          E-posta: <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </li>
      </ul>
      <p>
        Metin; tanıtım sitemizi ziyaret eden, bizimle iletişime geçen, Vetra&apos;yı kullanan işletmelerin yetkilileri
        ve panel kullanıcıları ile bize iş başvurusu yapan kişileri kapsar.
      </p>

      <h2>2. Bir salonun üyesiyseniz</h2>
      <p>
        Vetra, spor salonu ve stüdyoların üye, ders ve ödeme kayıtlarını yönettiği bir yazılımdır. Salonunuzun panele
        girdiği bilgileriniz (ad, telefon, üyelik paketi, ödemeler, katıldığınız dersler, varsa ölçüm veya sağlık
        notları) bakımından <strong>veri sorumlusu üyesi olduğunuz salondur</strong>. Vetra bu kayıtları yalnız salon
        adına ve salonla yaptığı sözleşme çerçevesinde barındıran <strong>veri işleyendir</strong>; bu verileri kendi
        amaçları için kullanmaz ve kimseyle paylaşmaz.
      </p>
      <p>
        Bu verilerle ilgili bilgi, düzeltme veya silme taleplerinizi doğrudan salonunuza iletmeniz gerekir. Bize
        ulaşırsanız talebinizi ilgili salona yönlendirir, salonun talebinizi karşılayabilmesi için gereken teknik
        desteği sağlarız. Sağlık notu gibi özel nitelikli bilgileri kaydetmeden önce gerekli hukuki şartı sağlamak
        salonun sorumluluğundadır.
      </p>

      <h2>3. Hangi durumda hangi verinizi işliyoruz?</h2>
      <p>
        Aşağıda, bizimle karşılaştığınız her durum için işlediğimiz verileri, amacımızı, dayandığımız hukuki sebebi
        (Kanun&apos;un 5. maddesindeki ilgili bent) ve verinin nasıl toplandığını bulabilirsiniz.
      </p>
      {situations.map((s) => (
        <div key={s.when}>
          <h3>{s.when}</h3>
          <div className="overflow-x-auto">
            <table>
              <tbody>
                <tr>
                  <td className="w-40 font-medium text-ink">İşlenen veriler</td>
                  <td>{s.data}</td>
                </tr>
                <tr>
                  <td className="font-medium text-ink">Amaç</td>
                  <td>{s.purpose}</td>
                </tr>
                <tr>
                  <td className="font-medium text-ink">Hukuki sebep</td>
                  <td>{s.basis}</td>
                </tr>
                <tr>
                  <td className="font-medium text-ink">Toplama yöntemi</td>
                  <td>{s.method}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
      <p>
        Vetra, kendi faaliyetleri için özel nitelikli kişisel veri (ör. sağlık veya biyometrik veri) toplamaz. Bizimle
        yazışırken bu tür bilgileri paylaşmamanızı rica ederiz.
      </p>

      <h2>4. Verilerinizi kimlerle paylaşıyoruz?</h2>
      <p>
        Verilerinizi yalnız yukarıdaki amaçlar için gerektiği ölçüde ve Kanun&apos;un 8. maddesine uygun olarak şu
        gruplarla paylaşabiliriz:
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Kiminle</th>
              <th>Hangi amaçla</th>
            </tr>
          </thead>
          <tbody>
            {recipients.map((r) => (
              <tr key={r.who}>
                <td className="font-medium text-ink">{r.who}</td>
                <td>{r.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Yurt dışındaki hizmet sağlayıcılar</h3>
      <p>
        Kullandığımız bazı bulut, e-posta ve mesajlaşma hizmetlerinin (ör. WhatsApp) sunucuları yurt dışında
        bulunabilir. Bu durumda aktarım, Kanun&apos;un 9. maddesinde sayılan yollardan birine dayanılarak yapılır:
        ilgili ülke hakkında verilmiş bir yeterlilik kararı, Kurul&apos;un ilan ettiği standart sözleşmeler gibi uygun
        güvenceler veya maddede sayılan istisnai haller. Bize WhatsApp üzerinden yazmayı seçerseniz yazışmanız ayrıca
        WhatsApp&apos;ın kendi gizlilik koşullarına tabidir.
      </p>

      <h2>5. Verilerinizi nasıl koruyoruz?</h2>
      {/* Bu tedbirler backend ile teyit edilmeli; uygulanmayan bir tedbir burada yazmamalı. */}
      <p>Kanun&apos;un 12. maddesi uyarınca verilerinizi korumak için teknik ve idari tedbirler alırız. Örneğin:</p>
      <ul>
        <li>Site ve panel bağlantıları şifreli (HTTPS) olarak kurulur.</li>
        <li>Panelde her kullanıcı yalnız rolünün izin verdiği ekranları görür; her salon yalnız kendi kayıtlarına erişir.</li>
        <li>Verilere erişim, işi gereği ihtiyaç duyan kişilerle sınırlıdır ve bu kişiler gizlilik yükümlülüğü altındadır.</li>
        <li>Veriler düzenli olarak yedeklenir.</li>
      </ul>
      <p>
        Verilerinizin yetkisiz kişilerce ele geçirildiğini öğrenirsek, durumu en kısa sürede size ve Kişisel Verileri
        Koruma Kurulu&apos;na bildiririz.
      </p>

      <h2>6. Ne kadar süre saklıyoruz?</h2>
      <p>
        Verilerinizi, işlenme amacı devam ettiği sürece ve mevzuatın öngördüğü süreler boyunca saklarız. Örneğin fatura
        ve muhasebe kayıtları Vergi Usul Kanunu ile Türk Ticaret Kanunu&apos;nun öngördüğü süreler boyunca tutulur.
        Sözleşmesi sona eren bir salonun panel verileri, salonun dışa aktarma veya silme talebi dikkate alınarak
        silinir.
      </p>
      <p>
        Saklama sebebi ortadan kalkan veriler, Kanun&apos;un 7. maddesi ve Kişisel Verilerin Silinmesi, Yok Edilmesi
        veya Anonim Hale Getirilmesi Hakkında Yönetmelik uyarınca kendiliğimizden veya talebiniz üzerine silinir, yok
        edilir ya da kimseyle ilişkilendirilemeyecek şekilde anonim hale getirilir.
      </p>

      <h2>7. Haklarınız</h2>
      <p>Kanun&apos;un 11. maddesi size şu hakları tanır:</p>
      <ul>
        {rights.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
      <p>
        Bu hakların bazıları Kanun&apos;un 28. maddesinde sayılan hallerde sınırlanabilir; örneğin verinin yargı
        makamlarınca bir soruşturma veya yargılama kapsamında işlenmesi ya da resmi istatistik için anonim olarak
        kullanılması gibi.
      </p>

      <h2>8. Başvuru nasıl yapılır?</h2>
      <p>
        Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ uyarınca başvurunuzda adınızı ve soyadınızı, T.C.
        kimlik numaranızı (yabancıysanız uyruğunuzu ve pasaport numaranızı), tebligat adresinizi, varsa e-posta ve
        telefon bilginizi ve talebinizi açıkça belirtmeniz gerekir. Başvurunuzu şu yollardan biriyle iletebilirsiniz:
      </p>
      <ul>
        <li>Islak imzalı dilekçeyle, elden veya posta yoluyla: {fullAddress()}</li>
        <li>
          Daha önce bize bildirdiğiniz ve sistemimizde kayıtlı e-posta adresinizden{" "}
          <a href={`mailto:${contact.email}`}>{contact.email}</a> adresine,
        </li>
        <li>Güvenli elektronik imza veya mobil imza ile imzalayarak aynı e-posta adresine.</li>
      </ul>
      <p>
        Başvurunuzu en geç 30 gün içinde ücretsiz olarak yanıtlarız. Yanıt ayrıca bir maliyet gerektirirse Kurul&apos;un
        belirlediği tarife üzerinden ücret istenebilir. Talebiniz reddedilirse, yanıtı yetersiz bulursanız veya
        süresinde yanıt alamazsanız Kanun&apos;un 14. maddesi uyarınca Kişisel Verileri Koruma Kurulu&apos;na şikâyette
        bulunabilirsiniz.
      </p>

      <h2>9. Güncellemeler</h2>
      <p>
        Veri işleme süreçlerimiz veya mevzuat değiştiğinde bu metni güncelleriz. Geçerli metin her zaman bu sayfadadır;
        son değişiklik tarihi sayfanın başında yazar. Tarayıcınızdaki çerezler hakkında bilgi için{" "}
        <Link href="/cerez-politikasi">Çerez Politikası</Link>&apos;na bakabilirsiniz.
      </p>
    </LegalPage>
  );
}
