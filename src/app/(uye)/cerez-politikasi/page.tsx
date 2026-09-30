import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/sections/LegalPage";
import { fullAddress, pageMetadata, siteConfig } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Çerez Politikası",
  description:
    "Vetra tanıtım sitesinde ve salon yönetim panelinde hangi çerezlerin ve tarayıcı depolama kayıtlarının, hangi amaçla, hangi hukuki sebeple ve ne kadar süreyle kullanıldığı.",
  path: "/cerez-politikasi",
});

const { legalName, contact } = siteConfig;

/**
 * Sitede ve panelde GERÇEKTEN kullanılan çerez ve depolama kayıtları.
 * Yeni bir kayıt eklenirse (ör. GA4/GTM, Google Ads, Meta Pixel) önce bu liste güncellenmeli,
 * zorunlu olmayanlar için onay bandı kurulmadan kod yayına alınmamalı.
 */
const storageItems = [
  {
    name: "token",
    kind: "Çerez · birinci taraf",
    category: "Zorunlu",
    purpose: "Giriş yapan kullanıcının oturumunu doğrular; her istekte kimliğinizin tekrar sorulmasını önler.",
    duration: "1 gün veya çıkış yapılana kadar",
  },
  {
    name: "user",
    kind: "Yerel depolama (localStorage)",
    category: "Zorunlu",
    purpose: "Giriş yapan kullanıcının adını ve rolünü tutar; menü ve yetkiler buna göre gösterilir.",
    duration: "Çıkış yapılana kadar",
  },
];

/** Amaca göre çerez sınıfları; "Vetra'da" sütunu gerçek kullanımı yansıtmalı. */
const categories = [
  {
    name: "Zorunlu",
    text: "Sitenin veya panelin temel işlevleri için gereklidir; oturum açma ve güvenlik bunlara örnektir. Kapatılırsa ilgili hizmet çalışmaz.",
    consent: "Gerekmez",
    used: "Evet (yalnız panelde)",
  },
  {
    name: "İşlevsel",
    text: "Dil, görünüm gibi tercihlerinizi hatırlayarak kullanımı kolaylaştırır; hizmetin çalışması için şart değildir.",
    consent: "Gerekir",
    used: "Hayır",
  },
  {
    name: "Analiz / performans",
    text: "Hangi sayfaların ziyaret edildiğini ve sitenin nasıl kullanıldığını ölçerek iyileştirme yapmamızı sağlar.",
    consent: "Gerekir",
    used: "Hayır",
  },
  {
    name: "Pazarlama / hedefleme",
    text: "Reklamların etkisini ölçmek veya ilgi alanınıza göre reklam göstermek için kullanılır; çoğunlukla üçüncü taraflarca yerleştirilir.",
    consent: "Gerekir",
    used: "Hayır",
  },
];

const browsers = [
  { name: "Google Chrome", href: "https://support.google.com/chrome/answer/95647?hl=tr" },
  { name: "Mozilla Firefox", href: "https://support.mozilla.org/kb/clear-cookies-and-site-data-firefox" },
  {
    name: "Microsoft Edge",
    href: "https://support.microsoft.com/tr-tr/microsoft-edge/microsoft-edge-de-tanımlama-bilgilerini-silme-63947406-40ac-c3b8-57b9-2a946a29ae09",
  },
  { name: "Safari (Mac)", href: "https://support.apple.com/tr-tr/guide/safari/sfri11471/mac" },
  { name: "Safari (iPhone / iPad)", href: "https://support.apple.com/tr-tr/105082" },
];

export default function CerezPolitikasiPage() {
  return (
    <LegalPage
      title="Çerez Politikası"
      description="Sitemizde ve panelimizde hangi çerezleri neden kullandığımızı, onayınızın ne zaman gerektiğini ve tercihlerinizi nasıl yöneteceğinizi açıklıyoruz."
      updated="17 Eylül 2026"
    >
      <h2>1. Bu politikanın kapsamı</h2>
      <p>
        Bu politika, {legalName} (&quot;Vetra&quot;) tarafından işletilen tanıtım sitesini ve salonların kullandığı
        Vetra yönetim panelini ziyaret eden herkes için geçerlidir. Çerezler aracılığıyla işlenen kişisel verilerin
        veri sorumlusu, {fullAddress()} adresinde faaliyet gösteren {legalName}&apos;dir.
      </p>
      <p>
        Politika; 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;Kanun&quot;) ve Kişisel Verileri Koruma
        Kurumu&apos;nun yayımladığı{" "}
        <a
          href="https://www.kvkk.gov.tr/Icerik/7208/Cerez-Uygulamalari-Hakkinda-Rehber"
          target="_blank"
          rel="noopener noreferrer"
        >
          Çerez Uygulamaları Hakkında Rehber
        </a>{" "}
        esas alınarak hazırlanmıştır. Kişisel verilerinizin genel olarak nasıl işlendiğini{" "}
        <Link href="/kvkk">KVKK Aydınlatma Metni</Link>&apos;nde bulabilirsiniz.
      </p>

      <h2>2. Çerez ve benzeri teknolojiler nedir?</h2>
      <p>
        <strong>Çerez</strong>, bir web sitesini açtığınızda tarayıcınıza bırakılan ve sonraki isteklerde siteye geri
        gönderilen küçük bir veri kaydıdır. Site, bu sayede örneğin giriş yaptığınızı her sayfada yeniden sormadan
        anlayabilir.
      </p>
      <p>
        <strong>Yerel depolama (localStorage)</strong> da benzer şekilde tarayıcınızda veri saklar; farkı, bu verinin
        sunucuya kendiliğinden gönderilmemesi ve yalnız sitenin kendi kodu tarafından okunabilmesidir. Bu politikada
        &quot;çerez&quot; ifadesi, aksi belirtilmedikçe bu tür benzer teknolojileri de kapsar.
      </p>

      <h2>3. Vetra&apos;da kullanılan çerezler</h2>
      <p>
        <strong>Tanıtım sitemizde şu an hiçbir çerez kullanılmamaktadır.</strong> Analiz, reklam veya sosyal medya
        takip aracı bulunmaz; siteyi gezmeniz tarayıcınıza kayıt bırakmaz. Aşağıdaki kayıtlar yalnız panele giriş
        yaptığınızda oluşturulur:
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Ad</th>
              <th>Tür</th>
              <th>Kategori</th>
              <th>Amaç</th>
              <th>Saklama süresi</th>
            </tr>
          </thead>
          <tbody>
            {storageItems.map((item) => (
              <tr key={item.name}>
                <td className="font-mono">{item.name}</td>
                <td>{item.kind}</td>
                <td>{item.category}</td>
                <td>{item.purpose}</td>
                <td>{item.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Bu kayıtlar yalnız Vetra tarafından oluşturulur ve okunur (birinci taraf); herhangi bir üçüncü kişiyle
        paylaşılmaz, reklam veya profilleme amacıyla kullanılmaz.
      </p>

      <h2>4. Çerez türleri</h2>
      <p>Çerezler kim tarafından yerleştirildiklerine ve ne kadar süre kaldıklarına göre de ayrılır:</p>
      <ul>
        <li>
          <strong>Birinci taraf çerezler</strong> ziyaret ettiğiniz sitenin kendisi tarafından,{" "}
          <strong>üçüncü taraf çerezler</strong> ise siteye gömülü başka bir hizmet (ör. bir analiz aracı) tarafından
          yerleştirilir. Vetra yalnız birinci taraf kayıt kullanır.
        </li>
        <li>
          <strong>Oturum çerezleri</strong> tarayıcı kapatıldığında silinir. <strong>Kalıcı çerezler</strong> ise
          belirlenen süre dolana veya siz silene kadar kalır. Vetra&apos;nın <span className="font-mono">token</span>{" "}
          çerezi en fazla 1 gün kalan kalıcı bir çerezdir.
        </li>
      </ul>
      <p>Amaçlarına göre ise dört sınıf vardır:</p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Sınıf</th>
              <th>Ne işe yarar?</th>
              <th>Açık rıza</th>
              <th>Vetra&apos;da</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.name}>
                <td className="font-medium text-ink">{c.name}</td>
                <td>{c.text}</td>
                <td>{c.consent}</td>
                <td>{c.used}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>5. Hukuki sebep ve onayınız</h2>
      <p>
        Zorunlu çerezler, panel kullanım sözleşmesinin kurulması ve ifası (Kanun m. 5/2-c) ile hizmetin güvenli
        şekilde sunulmasına yönelik meşru menfaatimiz (m. 5/2-f) kapsamında işlenir. Bu çerezler hizmetin
        çalışması için şart olduğundan onayınıza bağlı değildir.
      </p>
      <p>
        İleride işlevsel, analiz veya pazarlama çerezi kullanmaya başlarsak bunları yalnız{" "}
        <strong>açık rızanızla</strong> (m. 5/1) çalıştıracağız. Bu durumda:
      </p>
      <ul>
        <li>Siteye ilk girişinizde, onay vermeden önce hiçbir zorunlu olmayan çerez yüklenmeyecektir.</li>
        <li>&quot;Kabul et&quot; ve &quot;Reddet&quot; seçenekleri eşit kolaylıkta sunulacaktır.</li>
        <li>Çerez sınıflarını ayrı ayrı seçebilecek, verdiğiniz onayı dilediğiniz an geri alabileceksiniz.</li>
        <li>Siteyi gezmeye devam etmeniz onay olarak kabul edilmeyecektir.</li>
      </ul>

      <h2>6. Üçüncü taraf hizmetler ve yurt dışı aktarım</h2>
      <p>
        Bugün sitemizde veya panelimizde üçüncü taraf çerez yerleştiren bir hizmet bulunmamaktadır. Böyle bir hizmet
        (ör. bir ziyaretçi ölçüm aracı) eklenirse; sağlayıcının adı, yerleştirdiği çerezler, saklama süreleri ve
        verinin yurt dışına aktarılıp aktarılmadığı bu sayfada listelenecek, yurt dışı aktarım Kanun&apos;un 9.
        maddesindeki şartlara uygun şekilde yapılacaktır.
      </p>
      <p>
        Sitemizde yer alan WhatsApp, Google Haritalar veya e-posta bağlantılarına tıkladığınızda ilgili hizmetin
        kendi sayfasına veya uygulamasına geçersiniz. Bu noktadan sonra o hizmetin kendi çerez ve gizlilik
        politikaları geçerlidir.
      </p>

      <h2>7. Çerezleri nasıl yönetebilirsiniz?</h2>
      <p>
        Panelden <strong>çıkış yaptığınızda</strong> <span className="font-mono">token</span> çerezi ve{" "}
        <span className="font-mono">user</span> kaydı otomatik olarak silinir. Bunun dışında tarayıcınızın ayarlarından
        kayıtlı çerezleri görebilir, silebilir veya tamamen engelleyebilirsiniz. Zorunlu çerezleri engellerseniz panele
        giriş yapamazsınız; tanıtım sitesi ise etkilenmez.
      </p>
      <p>Yaygın tarayıcıların resmi yardım sayfaları:</p>
      <ul>
        {browsers.map((b) => (
          <li key={b.name}>
            <a href={b.href} target="_blank" rel="noopener noreferrer">
              {b.name}
            </a>
          </li>
        ))}
      </ul>

      <h2>8. Haklarınız</h2>
      <p>
        Çerezler yoluyla işlenen kişisel verilerinize ilişkin olarak Kanun&apos;un 11. maddesinde sayılan haklara
        sahipsiniz. Haklarınızın kapsamı ve başvuru yöntemi{" "}
        <Link href="/kvkk">KVKK Aydınlatma Metni</Link>&apos;nde açıklanmıştır.
      </p>

      <h2>9. Politikadaki değişiklikler</h2>
      <p>
        Kullandığımız çerezler veya ilgili mevzuat değiştiğinde bu politikayı güncelleriz. Güncel metin her zaman bu
        sayfada yayımlanır; sayfanın başındaki &quot;Son güncelleme&quot; tarihi en son değişikliği gösterir. Yeni bir
        zorunlu olmayan çerez eklenmesi durumunda onayınız yeniden istenir.
      </p>

      <h2>10. İletişim</h2>
      <p>
        Bu politika hakkındaki sorularınız için <a href={`mailto:${contact.email}`}>{contact.email}</a> adresine
        yazabilirsiniz.
      </p>
    </LegalPage>
  );
}
