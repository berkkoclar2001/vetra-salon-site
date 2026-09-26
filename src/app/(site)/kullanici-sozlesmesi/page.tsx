import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/sections/LegalPage";
import { fullAddress, pageMetadata, siteConfig } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Kullanıcı Sözleşmesi",
  description:
    "Vetra salon yönetim panelini kullanan işletmelerle aramızdaki kurallar: hesaplar, kullanım koşulları, aylık ücret ve iptal, hizmet sürekliliği, sorumluluklar ve sözleşmenin sona ermesi.",
  path: "/kullanici-sozlesmesi",
});

const { legalName, contact } = siteConfig;

/**
 * Buradaki süre ve taahhütler sitede verilen sözlerle aynı kalmalı:
 * "aylık ödeme, taahhüt yok" (Pricing), "kurulum ücretsiz" (Hero), "30 gün içinde dışa aktarma" ve
 * "önemli değişiklikte 15 gün önce e-posta" (gizlilik politikası). Birini değiştirirseniz diğerlerini de güncelleyin.
 */
const summary = [
  "Vetra'yı aylık olarak kullanırsınız; asgari süre taahhüdü yoktur, bir sonraki ay başlamadan iptal edebilirsiniz.",
  "Kurulum, mevcut kayıtlarınızın panele aktarılması ve ilk eğitim ücretsizdir.",
  "Panele girdiğiniz üye, ders ve ödeme kayıtları salonunuza aittir; ayrıldığınızda size teslim edilir.",
  "Üyelerinize karşı yükümlülükler (aydınlatma, izin, SMS onayı) salonunuza aittir; biz size bunun için araç sağlarız.",
  "Fiyat veya sözleşme değişikliklerini yürürlüğe girmeden önce e-postayla bildiririz.",
];

const definitions = [
  { term: "Vetra", meaning: `${legalName}; paneli geliştiren ve işleten taraf.` },
  {
    term: "İşletme",
    meaning:
      "Vetra'ya abone olan spor salonu, pilates, yoga veya dans stüdyosu, fizyoterapi merkezi, eğitmen ya da benzeri ticari işletme.",
  },
  {
    term: "Hesap sahibi",
    meaning: "İşletme adına aboneliği başlatan ve işletmeyi temsil etmeye yetkili kişi.",
  },
  {
    term: "Panel kullanıcısı",
    meaning: "Hesap sahibinin panele eklediği yönetici, eğitmen, resepsiyon görevlisi gibi çalışanlar.",
  },
  {
    term: "Üye",
    meaning: "İşletmenin panelde kaydını tuttuğu müşterisi, danışanı veya öğrencisi.",
  },
  {
    term: "Kayıtlar",
    meaning:
      "İşletmenin panele girdiği veya panelin işletme adına ürettiği üye, paket, ders, yoklama, ödeme, ölçüm ve rapor bilgileri.",
  },
  {
    term: "Abonelik dönemi",
    meaning: "Ücretin ödendiği bir aylık kullanım süresi (yazılı olarak farklı bir süre kararlaştırılmadıysa).",
  },
];

/** Ödeme gecikmesinde izlenen adımlar. Gün sayıları operasyonla teyit edilmeli. */
const latePayment = [
  { day: "Vade günü", step: "Ödenmemiş fatura için hesap sahibine e-posta veya WhatsApp ile hatırlatma gönderilir." },
  { day: "Vadeden 7 gün sonra", step: "İkinci hatırlatma yapılır; askıya alma tarihi açıkça bildirilir." },
  {
    day: "Vadeden 15 gün sonra",
    step: "Panel yalnız görüntüleme moduna alınır: kayıtlarınızı görebilir ve dışa aktarabilirsiniz, yeni işlem giremezsiniz.",
  },
  { day: "Ödeme yapıldığında", step: "Panel aynı iş günü içinde tam kullanıma açılır; hiçbir kayıt silinmez." },
];

export default function UserAgreementPage() {
  return (
    <LegalPage
      title="Kullanıcı Sözleşmesi"
      description="Vetra salon panelini kullanan işletmelerle aramızdaki kurallar. Açık, kısa ve sitede verdiğimiz sözlerle aynı olacak şekilde yazdık."
      updated="17 Eylül 2026"
    >
      <h2>Kısaca</h2>
      <p>Aşağıdaki özet sözleşmenin yerini tutmaz, ama en çok sorulan konuları tek bakışta gösterir:</p>
      <ul>
        {summary.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>1. Taraflar ve tanımlar</h2>
      <p>
        Bu sözleşme; {fullAddress()} adresinde faaliyet gösteren <strong>{legalName}</strong> ile Vetra salon yönetim
        panelini kullanmak için abone olan işletme arasındadır. Metinde geçen bazı kelimeler şu anlamlarda
        kullanılmıştır:
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Terim</th>
              <th>Anlamı</th>
            </tr>
          </thead>
          <tbody>
            {definitions.map((row) => (
              <tr key={row.term}>
                <td className="w-40 font-medium text-ink">{row.term}</td>
                <td>{row.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link>, <Link href="/kvkk">KVKK Aydınlatma Metni</Link>{" "}
        ve <Link href="/cerez-politikasi">Çerez Politikası</Link> bu sözleşmenin ayrılmaz parçasıdır. Sizinle ayrıca
        sözleşmeye ek olarak yazılı bir teklif veya sipariş formu imzalanmışsa, o belgedeki fiyat ve süreye ilişkin özel şartlar bu metne
        göre önceliklidir.
      </p>

      <h2>2. Sözleşme ne zaman başlar?</h2>
      <p>
        Sözleşme, bu metnin basılı nüshasının işletme yetkilisi ve Vetra tarafından <strong>ıslak imzayla</strong>{" "}
        imzalandığı tarihte yürürlüğe girer. Nüshalardan biri işletmede, biri Vetra&apos;da kalır. Panele giriş
        bağlantısı ve kullanıcı bilgileri imzadan sonra hesap sahibine iletilir; imza atılmadan panel hesabı açılmaz.
      </p>
      <p>
        Bu sayfadaki metin bilgilendirme amaçlıdır. İmzalanan nüshanın güncellenmesi 12. maddede anlatılan şekilde
        yapılır; iki metin arasında fark olursa imzalanan nüsha ve sonradan usulüne uygun bildirilen değişiklikler
        esas alınır.
      </p>
      <p>
        Vetra, işletmelerin ticari faaliyetleri için tasarlanmış bir yazılımdır. Sözleşmeyi imzalayan kişi 18 yaşını
        doldurmuş olduğunu ve işletmeyi temsil etmeye yetkili bulunduğunu kabul eder. Şirketler için imza yetkisini
        gösteren belge (ör. imza sirküleri) imza sırasında istenebilir. Sözleşmeden doğan hak ve borçlar kişiye
        değil, temsil edilen işletmeye aittir.
      </p>

      <h2>3. Ne sunuyoruz?</h2>
      <p>Abonelik süresince işletmenize şunları sağlarız:</p>
      <ul>
        <li>Seçtiğiniz pakette yer alan panel modüllerine internet üzerinden erişim,</li>
        <li>Kurulum, mevcut üye ve paket listenizin panele aktarılması ve kullanım eğitimi (ücretsiz),</li>
        <li>Hizmetin güvenli çalışması için barındırma, güncelleme ve düzenli yedekleme,</li>
        <li>Çalışma saatlerimizde e-posta, telefon ve WhatsApp üzerinden destek.</li>
      </ul>
      <p>
        Hangi modülün hangi pakette olduğu <Link href="/fiyatlar">Fiyatlar</Link> sayfasında ve size gönderilen
        teklifte yazar. Sitede &quot;yakında&quot; olarak tanıtılan özellikler, yayına alınana kadar sözleşmenin
        konusu değildir ve bunlar için ek ücret talep edilmez. Paneli sürekli geliştiririz; bir ekranın görünümü veya
        işleyişi değişebilir, ancak paketinizdeki bir temel işlevi abonelik döneminin ortasında kaldırmayız.
      </p>

      <h2>4. Hesaplar ve panel kullanıcıları</h2>
      <ul>
        <li>
          Hesap sahibi, çalışanlarını panel kullanıcısı olarak ekleyebilir ve her birinin rolünü belirler. Kimin hangi
          ekranı göreceğine ve ne zaman erişiminin kapatılacağına işletme karar verir.
        </li>
        <li>
          Her kullanıcı yalnız kendi giriş bilgileriyle panele girmelidir. Bir hesabın birden fazla kişi tarafından
          ortak kullanılması, yapılan işlemlerin kimin tarafından yapıldığının izlenmesini imkânsız hale getirir.
        </li>
        <li>
          Giriş bilgileriyle yapılan işlemler işletmenin işlemi sayılır. İşten ayrılan personelin erişimini kapatmak
          işletmenin sorumluluğundadır.
        </li>
        <li>
          Şifrenizin başkasının eline geçtiğinden şüphelenirseniz şifreyi hemen değiştirin ve{" "}
          <a href={`mailto:${contact.email}`}>{contact.email}</a> adresine haber verin; ilgili oturumları kapatmanıza
          yardım ederiz.
        </li>
        <li>
          Hesap ve iletişim bilgilerinin (özellikle fatura bilgileri ve e-posta adresi) güncel tutulması işletmenin
          sorumluluğundadır; bildirimler kayıtlı adrese gönderilir.
        </li>
      </ul>

      <h2>5. Kullanım kuralları</h2>
      <p>Paneli yalnız işletmenizin yasal faaliyetleri için kullanabilirsiniz. Aşağıdakiler yasaktır:</p>
      <ul>
        <li>Başka bir işletmenin kayıtlarına veya size tanınmamış yetkilere erişmeye çalışmak,</li>
        <li>Güvenlik açığı aramak, yük testi yapmak, otomatik araçlarla veri çekmek veya sistemi yavaşlatmak,</li>
        <li>Yazılımı kopyalamak, kaynak koduna ulaşmaya çalışmak veya benzer bir ürün geliştirmek için incelemek,</li>
        <li>Paneli üçüncü kişilere kiralamak, satmak veya kendi adınıza başka işletmelere hizmet olarak sunmak,</li>
        <li>Zararlı yazılım içeren dosya yüklemek, üyelere izinsiz toplu ileti göndermek için paneli kullanmak.</li>
      </ul>
      <p>
        Bir güvenlik açığı fark ederseniz lütfen bize bildirin; iyi niyetle yapılan bildirimler için teşekkür eder,
        sorunu gidermek için birlikte çalışırız.
      </p>

      <h2>6. Kayıtlarınız ve üyelerinize karşı sorumluluklarınız</h2>
      <p>
        Kayıtlar işletmenize aittir. Vetra bu kayıtları yalnız size hizmet vermek için ve{" "}
        <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link>&apos;nda anlatılan şekilde işler. Kişisel
        verilerin korunması mevzuatı bakımından işletmeniz <strong>veri sorumlusu</strong>, Vetra ise{" "}
        <strong>veri işleyen</strong>dir. Bu nedenle:
      </p>
      <ul>
        <li>
          Üyelerinizi hangi bilgilerini neden kaydettiğiniz konusunda bilgilendirmek ve gerektiğinde açık rızalarını
          almak işletmenin yükümlülüğüdür.
        </li>
        <li>
          Sağlık durumu, sakatlık veya hamilelik notu gibi özel nitelikli kişisel verileri yalnız hizmet için gerçekten
          gerekliyse ve 6698 sayılı Kanun&apos;un 6. maddesindeki şartlar sağlanıyorsa kaydedin.
        </li>
        <li>
          Panel üzerinden üyelere gönderilen doğum günü, kampanya veya yenileme teklifi gibi tanıtım amaçlı SMS ve
          e-postalar 6563 sayılı Kanun kapsamında ticari elektronik iletidir. Bu iletiler için alıcının onayını almak
          ve gerekiyorsa İleti Yönetim Sistemi (İYS) kaydını yapmak işletmenin sorumluluğundadır. Seans hatırlatması
          gibi yalnız mevcut hizmete ilişkin bilgilendirmeler bu kapsamda değildir.
        </li>
        <li>
          Panele girdiğiniz ücret, borç ve tahsilat bilgilerinin doğruluğu ile fatura kesme ve vergi beyanı gibi
          yükümlülükler işletmenize aittir. Panelin raporları karar vermenize yardımcı olur; muhasebe kaydı veya
          resmî belge yerine geçmez.
        </li>
      </ul>
      <p>
        Kayıtlarınızı düzenli olarak yedekleriz. Yine de önemli dönemlerde (ör. yıl sonu) panelden dışa aktarım
        almanızı öneririz. Bir yetkili makam kanuna uygun bir kararla kayıtlarınızı isterse, hukuken engel yoksa önce
        size haber verir ve yalnız istenen kapsamda paylaşırız.
      </p>

      <h2>7. Ücret, fatura ve iptal</h2>
      <h3>Ücret ve fatura</h3>
      <ul>
        <li>
          Abonelik ücreti, seçtiğiniz pakete göre aylık olarak ve her abonelik döneminin başında peşin ödenir. Güncel
          ücretler <Link href="/fiyatlar">Fiyatlar</Link> sayfasında veya size özel teklifte yer alır; ilan edilen
          fiyatlara KDV dahil olup olmadığı fiyatın yanında belirtilir.
        </li>
        <li>
          Her dönem için faturanız kayıtlı e-posta adresinize elektronik olarak gönderilir. Ödeme, faturada belirtilen
          yöntemle ve faturada yazan vade tarihine kadar yapılır.
        </li>
        <li>Kurulum, kayıt aktarımı ve eğitim için ayrıca ücret alınmaz.</li>
        <li>
          SMS gönderim bedeli paketinize dahil değilse, teklifte belirtilen birim fiyatla bir sonraki faturaya
          eklenir.
        </li>
      </ul>

      <h3>Paket değişikliği</h3>
      <p>
        Daha kapsamlı bir pakete istediğiniz zaman geçebilirsiniz; yeni özellikler hemen açılır ve fark, dönemin kalan
        günlerine oranlanarak faturalanır. Daha küçük bir pakete geçiş bir sonraki abonelik döneminin başında geçerli
        olur.
      </p>

      <h3>Fiyat değişikliği</h3>
      <p>
        Ücretleri değiştirdiğimizde yeni fiyatı yürürlüğe girmeden en az 30 gün önce e-postayla bildiririz. Yeni fiyat,
        bildirimden sonra başlayan ilk abonelik döneminden itibaren uygulanır; ödemesi yapılmış bir dönemin ücreti
        sonradan artırılmaz. Yeni fiyatı kabul etmezseniz, yürürlük tarihinden önce aboneliğinizi ek bir bedel ödemeden
        sonlandırabilirsiniz.
      </p>

      <h3>İptal ve iade</h3>
      <p>
        Asgari süre taahhüdü yoktur. Aboneliğiniz siz iptal edene kadar her ay kendiliğinden devam eder. İptal için
        mevcut dönem bitmeden <a href={`mailto:${contact.email}`}>{contact.email}</a> adresine veya WhatsApp hattımıza
        yazmanız yeterlidir; iptal, ödemesi yapılmış dönemin sonunda geçerli olur ve o güne kadar paneli kullanmaya
        devam edersiniz. Kullanılmaya başlanmış bir dönemin ücreti gün bazında iade edilmez.
      </p>

      <h3>Ödeme gecikirse</h3>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Ne zaman</th>
              <th>Ne olur</th>
            </tr>
          </thead>
          <tbody>
            {latePayment.map((row) => (
              <tr key={row.day}>
                <td className="w-44 font-medium text-ink">{row.day}</td>
                <td>{row.step}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>8. Hizmetin sürekliliği ve destek</h2>
      <p>
        Panelin günün her saatinde erişilebilir olması için çalışırız. Bununla birlikte internet altyapısı, barındırma
        sağlayıcıları veya elektrik kesintisi gibi kontrolümüz dışındaki sebeplerle ya da bakım nedeniyle kısa süreli
        kesintiler olabilir. Bu nedenle kesintisiz bir hizmet garantisi vermiyoruz; ancak:
      </p>
      <ul>
        <li>
          Planlı bakımları mümkün olduğunca salonların yoğun olmadığı gece saatlerinde yapar, uzun sürecek bakımları en
          az 24 saat önce duyururuz.
        </li>
        <li>
          Plansız bir kesintide sorunu öncelikle gideririz. Bir kesinti aynı abonelik döneminde toplam 24 saati aşarsa,
          talebiniz üzerine kesintiye uğrayan günlerin ücretini bir sonraki faturanızdan düşeriz.
        </li>
      </ul>
      <p>
        Destek taleplerinizi {siteConfig.hours.map((h) => `${h.label.toLocaleLowerCase("tr")} ${h.opens}–${h.closes}`).join(", ")}{" "}
        saatleri arasında {contact.phone} numaralı telefondan, WhatsApp hattımızdan veya{" "}
        <a href={`mailto:${contact.email}`}>{contact.email}</a> adresinden iletebilirsiniz. Mesai dışında gelen talepler
        bir sonraki çalışma gününde yanıtlanır.
      </p>

      <h2>9. Fikri mülkiyet</h2>
      <p>
        Vetra yazılımı, tasarımı, logosu ve markası ile bunlar üzerindeki tüm haklar {legalName}&apos;e aittir. Bu
        sözleşme, abonelik süresince paneli işletmenizin iç işleri için kullanma hakkı verir; bu hak devredilemez ve
        başkasına alt lisans olarak verilemez. Kayıtlarınız üzerinde ise hiçbir hak iddia etmeyiz.
      </p>
      <p>
        Paneli geliştirmemiz için ilettiğiniz öneri ve geri bildirimleri, size bir yükümlülük doğurmadan ürüne
        yansıtabiliriz.
      </p>

      <h2>10. Sorumluluğun sınırları</h2>
      <ul>
        <li>
          İşletmenin panele girdiği kayıtların içeriğinden, bu kayıtlara dayanarak verdiği kararlardan ve üyeleriyle
          arasındaki ilişkiden işletme sorumludur.
        </li>
        <li>
          Vetra&apos;nın bu sözleşme kapsamındaki toplam sorumluluğu, zararın doğduğu tarihten önceki 12 ay içinde
          işletmenin Vetra&apos;ya ödediği abonelik ücretleriyle sınırlıdır. Kâr kaybı gibi dolaylı zararlardan
          sorumlu değiliz.
        </li>
        <li>
          Bu sınırlamalar; kastımız veya ağır ihmalimizle verilen zararlarda ve kanunen sınırlanamayan hallerde
          uygulanmaz (Türk Borçlar Kanunu m. 115).
        </li>
        <li>
          İşletme, bu sözleşmeye veya mevzuata aykırı kullanımı nedeniyle üçüncü kişilerin Vetra&apos;ya yönelttiği
          taleplerden doğan zararı karşılar.
        </li>
      </ul>

      <h2>11. Sözleşmenin sona ermesi</h2>
      <h3>Sizin tarafınızdan</h3>
      <p>
        Aboneliğinizi yukarıdaki &quot;İptal ve iade&quot; bölümünde anlatıldığı şekilde istediğiniz zaman
        sonlandırabilirsiniz; herhangi bir gerekçe göstermeniz veya cezai bedel ödemeniz gerekmez.
      </p>
      <h3>Vetra tarafından</h3>
      <ul>
        <li>
          Vetra, 30 gün önceden yazılı bildirim yaparak sözleşmeyi gerekçe göstermeden sona erdirebilir. Bu durumda
          ödemesi yapılmış ancak kullanılmamış günlerin ücreti iade edilir.
        </li>
        <li>
          Sözleşmeye aykırı kullanım tespit edilirse işletmeye yazılı bildirim yapılır ve aykırılığı gidermesi için
          makul bir süre verilir. Süre içinde giderilmezse sözleşme feshedilebilir.
        </li>
        <li>
          Başka işletmelerin kayıtlarını veya sistemin güvenliğini tehlikeye atan ya da açıkça hukuka aykırı olan bir
          kullanım varsa, zararı önlemek için hesap önceden bildirim yapılmadan askıya alınabilir. Bu durumda işletmeye
          sebebi gecikmeden bildirilir.
        </li>
      </ul>
      <h3>Sona erdikten sonra kayıtlarınız</h3>
      <p>
        Sözleşme hangi sebeple sona ererse ersin, sona erme tarihinden itibaren <strong>30 gün</strong> içinde
        kayıtlarınızı yaygın bir dosya biçiminde (ör. Excel) ücretsiz olarak size teslim ederiz. Bu sürenin sonunda
        kayıtlar yedekler dahil silinir veya anonim hale getirilir; kanunen saklanması zorunlu fatura ve ödeme
        bilgileri ise yalnız yasal süre boyunca tutulur. Ayrıntılar{" "}
        <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link>&apos;ndadır.
      </p>

      <h2>12. Bu sözleşmedeki değişiklikler</h2>
      <p>
        Sözleşmeyi mevzuat değişiklikleri veya yeni özellikler nedeniyle güncelleyebiliriz. Yeni metni bu sayfada
        yayımlar, sayfanın başındaki tarihi değiştiririz. Haklarınızı daraltan veya yükümlülüklerinizi artıran bir
        değişiklik, yürürlüğe girmeden en az 15 gün önce kayıtlı e-posta adresinize bildirilir. Değişikliği kabul
        etmiyorsanız yürürlük tarihine kadar aboneliğinizi sonlandırabilirsiniz; bu durumda kalan günlerin ücreti iade
        edilir.
      </p>

      <h2>13. Bildirimler, uygulanacak hukuk ve yetkili mahkeme</h2>
      <ul>
        <li>
          Taraflar arasındaki bildirimler, hesapta kayıtlı e-posta adresine ve{" "}
          <a href={`mailto:${contact.email}`}>{contact.email}</a> adresine yapılır; bu yolla yapılan bildirimler yazılı
          bildirim sayılır.
        </li>
        <li>
          Sözleşmenin bir maddesinin geçersiz sayılması diğer maddelerin geçerliliğini etkilemez. Bir hakkın bir süre
          kullanılmaması, o haktan vazgeçildiği anlamına gelmez.
        </li>
        <li>
          Taraflar bir anlaşmazlığı önce aralarında görüşerek çözmeye çalışır. Çözülemeyen uyuşmazlıklarda Türk hukuku
          uygulanır ve İstanbul mahkemeleri ile icra daireleri yetkilidir.
        </li>
      </ul>
      <p>
        Sözleşmeyle ilgili sorularınız için <a href={`mailto:${contact.email}`}>{contact.email}</a> adresine yazabilir
        veya {contact.phone} numaralı telefondan bize ulaşabilirsiniz.
      </p>
    </LegalPage>
  );
}
