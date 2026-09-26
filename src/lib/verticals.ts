/**
 * İşletme türleri (dikeyler): /kimler-icin sekmeleri ve /kimler-icin/[slug] landing sayfaları buradan beslenir.
 *
 * İçerik kuralı: yalnız panel kodunda karşılığı olan özellikler anlatılır
 * (paket türleri, kontenjan, tekrarlayan seans, ölçüm alanları, antrenman planı, üye notları,
 * borç/tahsilat, SMS/e-posta bildirimleri, eğitmen hakedişi, sözleşme şablonları, raporlar, roller).
 * Sağlık kaydı, beslenme programı, WhatsApp entegrasyonu ve bekleme listesi panelde YOK — yazılmaz.
 * Her sayfa bir arama grubunu hedefler (metaTitle / h1); rakam, referans veya müşteri iddiası uydurulmaz.
 */

export type VerticalFaq = { q: string; a: string };
export type VerticalBlock = { title: string; text: string };

export type Vertical = {
  id: string;
  slug: string;
  /** Sekme ve menü etiketi. */
  tab: string;
  /** Sekme paneli: kısa özet. */
  title: string;
  intro: string;
  points: string[];
  screens: string[];
  /** Landing sayfası. */
  metaTitle: string;
  metaDescription: string;
  h1: string;
  lead: string;
  /** "Kimler için uygun" paragrafı: sayfaya özgü, dolgu değil. */
  fit: string;
  problems: VerticalBlock[];
  solutions: VerticalBlock[];
  faq: VerticalFaq[];
};

export const verticals: Vertical[] = [
  {
    id: "pilates",
    slug: "pilates-studyolari",
    tab: "Pilates Stüdyoları",
    title: "Reformer ve mat dersleri kontenjanı şaşmadan dönsün",
    intro:
      "Sekiz kişilik reformer dersinde dokuzuncu üyenin gelmesi, defterde tutulan bir takvimin kaçınılmaz sonucudur. Vetra kontenjanı derse bağlar, iptal penceresini paket kuralına yazar.",
    points: [
      "Ders bazında kontenjan; dolan derse fazladan kayıt açılmaz",
      "Seanslı, süreli ya da ikisi birlikte çalışan karma paket",
      "Devir hakkı, dondurma süresi ve iptal penceresi paket bazında",
      "Paketi bitmek üzere olan üyeye otomatik SMS veya e-posta",
    ],
    screens: ["Randevular · Kontenjan", "Tanımlamalar · Paketler", "Raporlar · Kapasite"],
    metaTitle: "Pilates Salonu Üye Takip ve Randevu Programı",
    metaDescription:
      "Pilates stüdyoları için üye takip ve randevu programı: reformer kontenjanı, seans paketleri, iptal penceresi, dondurma ve paket bitiş hatırlatmaları.",
    h1: "Pilates stüdyoları için üye takip ve randevu programı",
    lead:
      "Reformer sayısı kadar kontenjan, seans sayısı kadar paket, kuralı belli bir iptal penceresi. Vetra, pilates stüdyosunun defterde, Excel'de ve WhatsApp mesajlarında dağılan takibini tek panelde toplar.",
    fit:
      "Reformer, mat ya da cadillac derslerini seans paketleriyle satan butik pilates stüdyoları için. Grup dersini ve özel dersi aynı takvimde yürüten, kontenjanı alet sayısına göre sınırlı olan ve iptal kuralını net koymak isteyen her stüdyo panelin tüm akışını kullanır.",
    problems: [
      {
        title: "Ders doluyken bir kişi daha geliyor",
        text: "Rezervasyonlar farklı kanallardan gelince kontenjan kâğıt üzerinde tutulamıyor. Sekiz aletlik derse dokuzuncu üye geldiğinde hem üye hem eğitmen zor durumda kalıyor.",
      },
      {
        title: "Kaç seans kaldığını kimse net bilmiyor",
        text: "10 seanslık paketin kaçıncı derste olduğu, dondurulan günler ve devreden seanslar elle hesaplanınca üyeyle tartışma kaçınılmaz oluyor.",
      },
      {
        title: "Son dakika iptalleri kuralsız kalıyor",
        text: "Hangi iptal seanstan düşer, hangisi düşmez? Kural yazılı olmayınca her iptal ayrı bir pazarlığa dönüşüyor.",
      },
    ],
    solutions: [
      {
        title: "Kontenjanı derse bağlayan takvim",
        text: "Her dersin kapasitesini reformer ya da mat sayınıza göre tanımlarsınız. Kontenjan dolduğunda derse yeni kayıt eklenmez; günlük, haftalık ve aylık görünümde doluluk bir bakışta okunur.",
      },
      {
        title: "Seanslı, süreli ya da karma paketler",
        text: "Paketi seans adedine, gün sayısına ya da ikisine birden bağlayabilirsiniz. Branş bazında ayrı paketler tanımlar, reformer ve mat derslerini ayrı fiyatlandırırsınız.",
      },
      {
        title: "Paket kuralları: devir, dondurma, iptal",
        text: "Dönem sonunda kaç seansın devredeceğini, üyenin toplam kaç gün dondurabileceğini ve dersten kaç saat önce ücretsiz iptal edebileceğini paketin içine yazarsınız. Kural herkes için aynı işler.",
      },
      {
        title: "Tekrarlayan haftalık dersler",
        text: "Her hafta aynı saatte dönen dersleri bir kez kalıcı seans olarak kurarsınız; takvim her hafta kendiliğinden dolar, katılım dersin üzerine işlenir.",
      },
      {
        title: "Paketi biten üyeye otomatik hatırlatma",
        text: "Paketi bitmek üzere olan, üyeliği sona eren ya da bir süredir gelmeyen üyeye SMS veya e-posta şablonunuz kendiliğinden gider. Yenileme konuşması doğru zamanda başlar.",
      },
    ],
    faq: [
      {
        q: "Reformer ve mat derslerini ayrı paketlerle yönetebilir miyim?",
        a: "Evet. Branşlarınızı kendiniz tanımlarsınız ve her branşa ayrı paket bağlayabilirsiniz. Reformer için seanslı, mat için süreli bir paket aynı anda çalışabilir.",
      },
      {
        q: "Dolan derse fazladan kayıt yapılabilir mi?",
        a: "Her dersin kontenjanı tanımlıdır. Kontenjan dolduğunda derse yeni katılımcı eklenmez, doluluk takvimde ve kapasite raporunda görünür.",
      },
      {
        q: "Üyenin iptal ettiği ders paketinden düşer mi?",
        a: "Bu kararı paket kuralı verir. Paket için tanımladığınız iptal penceresinden (örneğin dersten 12 saat önce) sonra yapılan iptaller kurala göre işlenir.",
      },
      {
        q: "Mevcut üye listemi Excel'den taşıyabilir miyim?",
        a: "Kurulumda mevcut üye ve paket kayıtlarınızı biz aktarıyoruz. Kurulum ücretsizdir, taahhüt istemiyoruz.",
      },
      {
        q: "Üyeler paketini dondurabilir mi?",
        a: "Her pakete toplam dondurma hakkını gün olarak tanımlarsınız. Dondurulan üyelikler dondurma raporunda ayrıca listelenir, böylece hangi üyenin ne zaman döneceğini takip edebilirsiniz.",
      },
      {
        q: "Eğitmenlere ders başı ödeme hesaplanabilir mi?",
        a: "Evet. Her eğitmen için ders başı ücret, ciro payı ya da sabit ücret kuralı tanımlarsınız; hakediş raporu verilen ders sayısına göre dönem sonunda tutarı hesaplar.",
      },
    ],
  },
  {
    id: "yoga",
    slug: "yoga-wellness",
    tab: "Yoga & Wellness",
    title: "Grup dersleri ve eğitmen takvimi tek ekranda",
    intro:
      "Birden fazla eğitmenin farklı saatlerde ders verdiği stüdyoda asıl mesele çakışma. Her dersin eğitmeni ve doluluğu aynı takvimde görünür.",
    points: [
      "Günlük, haftalık ve aylık takvim görünümü",
      "Her dersin eğitmeni ve kontenjanı takvimde görünür",
      "Branşlarınızı kendiniz tanımlarsınız — yoga, meditasyon, nefes",
      "Rezervasyon ve katılım kaydı üye profiline işlenir",
    ],
    screens: ["Randevular · Haftalık", "Personel · Eğitmenler", "Raporlar · Ajanda"],
    metaTitle: "Yoga Stüdyosu Yönetim Programı: Ders ve Eğitmen Takvimi",
    metaDescription:
      "Yoga ve wellness stüdyoları için yönetim programı: grup dersi takvimi, eğitmen planı, branş tanımları, paket takibi ve eğitmen raporları tek panelde.",
    h1: "Yoga ve wellness stüdyoları için ders ve üye yönetim programı",
    lead:
      "Sabah vinyasa, öğlen meditasyon, akşam yin yoga — her biri farklı eğitmen, farklı kontenjan. Vetra, çok eğitmenli bir stüdyonun haftalık programını ve üyelerini tek takvimde yönetir.",
    fit:
      "Haftalık programı sabit grup derslerinden oluşan yoga, meditasyon, nefes ve wellness stüdyoları için. Birden fazla eğitmenle çalışan, atölye ve özel dersleri de aynı takvimde tutmak isteyen stüdyolar panelin tüm akışını kullanır.",
    problems: [
      {
        title: "Haftalık program her hafta yeniden yazılıyor",
        text: "Aynı saatlerde dönen derslerin takvimi her hafta elle kopyalanınca bir değişiklik bir yerde unutuluyor, üye yanlış saate geliyor.",
      },
      {
        title: "Hangi eğitmen ne kadar ders verdi belli değil",
        text: "Ay sonunda eğitmen ödemesi için ders sayısı mesaj geçmişinden çıkarılıyor; hem zaman kaybı hem hata riski.",
      },
      {
        title: "Branşlar tek listede karışıyor",
        text: "Yoga, meditasyon, nefes ve özel atölyeler aynı defterde tutulunca hangi dersin ne kadar dolduğu okunmuyor.",
      },
    ],
    solutions: [
      {
        title: "Bir kez kurulan haftalık program",
        text: "Tekrarlayan dersleri kalıcı seans olarak tanımlarsınız; takvim her hafta kendiliğinden oluşur. Tek seferlik atölyeleri aynı takvime ayrıca eklersiniz.",
      },
      {
        title: "Eğitmenli takvim ve roller",
        text: "Her ders eğitmeniyle birlikte oluşturulur ve takvimde eğitmen adıyla görünür. Eğitmenler rol bazlı yetkiyle panele girer ve yalnız kendi alanlarını görür.",
      },
      {
        title: "Kendi branşlarınız, kendi paketleriniz",
        text: "Branş listesini Vetra değil siz belirlersiniz. Her branşa seanslı, süreli ya da karma paket bağlayabilirsiniz.",
      },
      {
        title: "Eğitmen hakedişi hesabı",
        text: "Eğitmen ödemesini ders başı ücret, ciro payı ya da sabit ücret olarak tanımlarsınız; hakediş raporu ay sonunda ders sayısından kendiliğinden hesaplanır.",
      },
      {
        title: "Ajanda ve rezervasyon raporları",
        text: "Hangi gün ve saatlerin yoğun, hangi derslerin boş kaldığını ajanda, kapasite ve rezervasyon raporlarında görürsünüz.",
      },
    ],
    faq: [
      {
        q: "Farklı eğitmenlerin derslerini tek takvimde görebilir miyim?",
        a: "Evet. Tüm dersler eğitmen adıyla aynı takvimde durur; günlük, haftalık veya aylık görünüme geçebilirsiniz.",
      },
      {
        q: "Eğitmenler paneli kullanabilir mi?",
        a: "Eğitmenler kendi hesaplarıyla, rolüne göre sınırlı yetkiyle girer. Finans ve tanımlamalar gibi ekranlar yalnız yöneticiye açıktır.",
      },
      {
        q: "Eğitmen ödemesini sistem hesaplıyor mu?",
        a: "Eğitmen için ders başı, ciro payı veya sabit ücret kuralı tanımlarsınız. Hakediş raporu bu kurala göre dönem sonunda tutarı çıkarır.",
      },
      {
        q: "Atölye gibi tek seferlik etkinlikleri ekleyebilir miyim?",
        a: "Tekrarlayan derslerin yanında tek seferlik seansları da aynı takvime ekleyebilir, kontenjanlarını ayrı belirleyebilirsiniz.",
      },
      {
        q: "Üyelere ders hatırlatması gönderilebilir mi?",
        a: "Evet. Seans hatırlatma şablonu tanımladığınızda derse kayıtlı üyeye SMS veya e-posta kendiliğinden gider; paketi bitmek üzere olan üyeler de ayrıca uyarılır.",
      },
      {
        q: "Hangi derslerin boş kaldığını nasıl görürüm?",
        a: "Kapasite ve rezervasyon raporları derslerin doluluğunu, ajanda raporu da gün ve saat bazında yoğunluğu gösterir. Programı bu veriye göre düzenleyebilirsiniz.",
      },
    ],
  },
  {
    id: "pt",
    slug: "personal-training",
    tab: "Personal Training",
    title: "Birebir çalışan eğitmenin programı da takibi de sistemde",
    intro:
      "PT'nin değeri takip ettiği detayda. Antrenman programını üyeye haftanın günlerine bölerek atayın, ölçümleri zaman içinde izleyin.",
    points: [
      "Kişiye özel antrenman planı — haftanın günlerine bölünerek atanır",
      "Program şablonları; bir kez yazın, üyeye uyarlayın",
      "Ölçülecek alanları salon kendisi tanımlar (kilo, çevre, oran)",
      "Birebir ve grup seansları aynı takvimde",
    ],
    screens: ["Üyeler · Gelişim", "Tanımlamalar · Program şablonları", "Raporlar · Hakediş"],
    metaTitle: "Personal Trainer Üye ve Antrenman Takip Programı",
    metaDescription:
      "Personal trainer ve PT stüdyoları için üye takip programı: haftalık antrenman planı, program şablonları, ölçüm takibi, seans paketleri ve eğitmen hakedişi.",
    h1: "Personal trainer ve PT stüdyoları için üye ve antrenman takibi",
    lead:
      "Antrenman programı bir uygulamada, ölçümler not defterinde, seans sayısı mesajlarda… Vetra, birebir çalışan eğitmenin üyesiyle ilgili her şeyi tek profilde toplar.",
    fit:
      "Kendi stüdyosunda ya da bir salon içinde birebir çalışan personal trainer'lar ile birden fazla eğitmenle çalışan PT stüdyoları için. Antrenman planını, ölçümleri ve seans paketini tek üye profilinde görmek isteyen her eğitmen panelin tüm akışını kullanır.",
    problems: [
      {
        title: "Program her üye için sıfırdan yazılıyor",
        text: "Benzer hedefli üyelere aynı programı tekrar tekrar yazmak, eğitmenin antrenmana ayıracağı zamanı yiyor.",
      },
      {
        title: "Gelişim kanıtlanamıyor",
        text: "Üye üç ay sonra 'bir şey değişmedi' dediğinde, başlangıç ölçümleri elde yoksa emeği göstermek mümkün olmuyor.",
      },
      {
        title: "Seans ve ödeme takibi karışıyor",
        text: "Kaç seans yapıldı, kaç seans kaldı, ödemenin ne kadarı alındı — birebir çalışmada küçük bir hata doğrudan gelir kaybı demek.",
      },
    ],
    solutions: [
      {
        title: "Haftanın günlerine bölünmüş antrenman planı",
        text: "Pazartesi üst vücut, çarşamba bacak… Egzersiz, set, tekrar, ağırlık ve dinlenme süresiyle planı üyeye gün gün atarsınız.",
      },
      {
        title: "Program şablonları",
        text: "Sık kullandığınız programları şablon olarak saklar, yeni üyeye birkaç değişiklikle uyarlarsınız.",
      },
      {
        title: "Salonun kendi tanımladığı ölçümler",
        text: "Kilo, bel çevresi, yağ oranı ya da sizin önemsediğiniz başka bir değer — ölçüm alanlarını siz tanımlarsınız, geçmişi üye profilinde birikir.",
      },
      {
        title: "Seans paketi ve borç takibi",
        text: "Birebir seans paketleri kalan seans sayısıyla izlenir. Ödemesi eksik üyeler borç listesinde görünür.",
      },
      {
        title: "Eğitmen hakedişi",
        text: "Çok eğitmenli PT stüdyosunda ödemeyi ders başı, ciro payı veya sabit ücretle tanımlarsınız; hakediş raporu dönem sonunda hesaplar.",
      },
    ],
    faq: [
      {
        q: "Antrenman programını üyeye nasıl atıyorum?",
        a: "Üye profilinden haftalık plan oluşturur, her güne egzersiz, set, tekrar ve ağırlık eklersiniz. Hazır şablondan başlayıp üyeye göre değiştirebilirsiniz.",
      },
      {
        q: "Hangi ölçümleri takip edebilirim?",
        a: "Ölçüm alanlarını salon olarak siz tanımlarsınız. Tanımladığınız her alan için üyenin ölçüm geçmişi profilinde tutulur.",
      },
      {
        q: "Birebir ve grup seanslarını aynı anda yönetebilir miyim?",
        a: "Evet. Birebir seanslar ve grup dersleri aynı takvimde, kendi kontenjanlarıyla birlikte durur.",
      },
      {
        q: "Tek başıma çalışan bir eğitmenim, bana uygun mu?",
        a: "Evet. Üye, paket, program ve ödeme takibi tek eğitmen için de aynı şekilde çalışır. Size uygun paketi görüşmede birlikte belirleriz.",
      },
      {
        q: "Üyenin kaç seansı kaldığını nasıl takip ederim?",
        a: "Kalan seans sayısı üye profilinde görünür. Paket bitmek üzereyken üyeye otomatik SMS veya e-posta gönderilmesini de sağlayabilirsiniz.",
      },
      {
        q: "Kısmi ödemeleri takip edebilir miyim?",
        a: "Ödemeler üye profiline işlenir. Kalan tutarlar ve vadeleri borç listesi raporunda izlenir, böylece hangi üyeden ne kadar alacağınız nettir.",
      },
    ],
  },
  {
    id: "fizyoterapi",
    slug: "fizyoterapi-rehabilitasyon",
    tab: "Fizyoterapi & Rehabilitasyon",
    title: "Seans, program ve ilerleme takibi aynı profilde",
    intro:
      "Rehabilitasyon çalışan bir merkezde danışanın seans geçmişi, egzersiz programı ve ölçümleri seansın kendisi kadar önemli. Vetra bunları danışan profilinde tutar.",
    points: [
      "Seans paketleri ve fizyoterapistli seans takvimi",
      "Merkezin kendi tanımladığı ölçüm alanları ve ölçüm geçmişi",
      "Haftalık egzersiz programı ve danışan notları",
      "Rol bazlı erişim — herkes yalnız kendi alanını görür",
    ],
    screens: ["Randevular · Seans", "Üyeler · Ölçüm geçmişi", "Tanımlamalar · Ölçüm alanları"],
    metaTitle: "Fizyoterapi Merkezi Seans ve Danışan Takip Programı",
    metaDescription:
      "Fizyoterapi ve rehabilitasyon merkezleri için seans takip programı: seans paketleri, ölçüm geçmişi, egzersiz programı ve otomatik seans hatırlatmaları.",
    h1: "Fizyoterapi ve rehabilitasyon merkezleri için seans takip programı",
    lead:
      "Seans paketleri, fizyoterapist takvimleri ve danışanın ilerlemesi ayrı yerlerde tutulunca takip kopuyor. Vetra, merkezin seans operasyonunu ve danışan geçmişini tek panelde birleştirir.",
    fit:
      "Seans paketleriyle çalışan fizyoterapi, rehabilitasyon, manuel terapi ve klinik pilates merkezleri için. Birden fazla fizyoterapistin seanslarını, danışan ilerlemesini ve ödemeleri tek panelde görmek isteyen özel merkezler panelin tüm akışını kullanır.",
    problems: [
      {
        title: "Seans paketi elle sayılıyor",
        text: "20 seanslık bir rehabilitasyon programının kaçıncı seansta olduğu kâğıtta tutulunca eksik ya da fazla seans tartışması çıkıyor.",
      },
      {
        title: "İlerleme kayıtları dağınık",
        text: "Hareket açıklığı ya da ağrı düzeyi gibi değerler farklı dosyalarda tutulunca danışanın gelişimi bütün olarak görülmüyor.",
      },
      {
        title: "Kaçırılan seanslar",
        text: "Hatırlatma yapılmayan danışan seansı unutuyor; boş kalan saat merkez için doğrudan kayıp.",
      },
    ],
    solutions: [
      {
        title: "Seans paketleri ve takvim",
        text: "Seans adedine bağlı paketler tanımlar, her seansı ilgili fizyoterapistle takvime yerleştirirsiniz. Kalan seans sayısı danışan profilinde görünür.",
      },
      {
        title: "Merkezin tanımladığı ölçüm alanları",
        text: "Takip etmek istediğiniz değerleri — örneğin eklem hareket açıklığı veya ağrı skoru — ölçüm alanı olarak siz tanımlarsınız; her ölçüm tarihiyle birlikte geçmişe eklenir.",
      },
      {
        title: "Egzersiz programı ve notlar",
        text: "Danışana haftanın günlerine bölünmüş ev egzersiz programı atar, seans notlarını profiline eklersiniz.",
      },
      {
        title: "Otomatik seans hatırlatması",
        text: "Seans hatırlatma şablonunuz SMS veya e-posta ile danışana kendiliğinden gider; paketi bitmek üzere olanlar da ayrıca uyarılır.",
      },
      {
        title: "Rol bazlı erişim",
        text: "Resepsiyon, fizyoterapist ve yönetici farklı yetkilerle girer. Finans ve tanımlamalar yalnız yöneticiye açıktır.",
      },
    ],
    faq: [
      {
        q: "Danışanın ilerlemesini nasıl takip ederim?",
        a: "Takip etmek istediğiniz değerleri ölçüm alanı olarak tanımlarsınız. Her ölçüm tarihiyle danışan profiline eklenir ve geçmiş birlikte görüntülenir.",
      },
      {
        q: "Seans hatırlatması gönderilebiliyor mu?",
        a: "Evet. Seans hatırlatma, paket bitişi ve üyelik bitişi gibi durumlar için SMS veya e-posta şablonu tanımlarsınız; bildirim kendiliğinden gönderilir.",
      },
      {
        q: "Birden fazla fizyoterapistin takvimini ayrı görebilir miyim?",
        a: "Takvim tüm seansları, her seansın fizyoterapistiyle birlikte gösterir. Her fizyoterapist kendi hesabıyla, rolüne göre yetkilendirilmiş şekilde girer.",
      },
      {
        q: "Vetra bir hastane bilgi sistemi mi?",
        a: "Hayır. Vetra seans, paket, takvim ve ilerleme takibi için bir işletme yönetim panelidir; tanı, reçete veya e-Nabız entegrasyonu içermez.",
      },
      {
        q: "Danışan seansı iptal ederse ne olur?",
        a: "İptal kuralını paket bazında tanımlarsınız. Seanstan kaç saat önce yapılan iptalin paketten düşmeyeceğini belirlersiniz; kural tüm danışanlara aynı uygulanır.",
      },
      {
        q: "Ödemeleri ve kalan tutarları görebilir miyim?",
        a: "Danışan ödemeleri profiline işlenir. Eksik ödemeler borç listesi raporunda tutarıyla, dönemin tahsilat durumu finans raporunda görünür.",
      },
    ],
  },
  {
    id: "fitness",
    slug: "fitness-salonlari",
    tab: "Fitness Salonları",
    title: "Çok eğitmenli salonda üyelik ve tahsilat düzeni",
    intro:
      "Üye sayısı arttıkça sorun ders değil tahsilat olur. Kim ne zaman ödedi, kimin borcu kaldı, hangi üyelik ne zaman bitiyor.",
    points: [
      "Üyelik paketleri ve ödeme takibi",
      "Borç listesi ve tahsilat raporu",
      "Eğitmen hesapları, rol bazlı yetki ve hakediş",
      "Üyelik, dondurma ve pasif üye raporları",
    ],
    screens: ["Finansman · Ödemeler", "Raporlar · Borç listesi", "Raporlar · Üyelikler"],
    metaTitle: "Fitness Salonu Üye Takip ve Tahsilat Programı",
    metaDescription:
      "Spor ve fitness salonları için üye takip programı: üyelik paketleri, ödeme ve borç takibi, dondurma, eğitmen hakedişi, salon marketi ve 10 işletme raporu.",
    h1: "Fitness ve spor salonları için üye takip ve tahsilat programı",
    lead:
      "Yüzlerce üye, onlarca farklı bitiş tarihi, kısmi ödemeler ve dondurulan üyelikler. Vetra, spor salonunun üyelik ve tahsilat düzenini tek panelde kurar.",
    fit:
      "Üyelik satışının ve tahsilatın ağırlıkta olduğu fitness ve spor salonları için. Resepsiyon, eğitmen ve yönetimin farklı yetkilerle aynı paneli kullandığı, grup dersi ve PT hizmetini birlikte sunan salonlar panelin tüm akışını kullanır.",
    problems: [
      {
        title: "Kimin borcu kaldığı bilinmiyor",
        text: "Kısmi ödemeler ve ertelenen taksitler defterde kaybolunca ay sonunda tahsil edilmemiş tutar ancak kasada fark ediliyor.",
      },
      {
        title: "Biten üyelikler sessizce gidiyor",
        text: "Üyeliği biten ve yenilemeyen üyeye kimse ulaşmayınca kaybedilen üye fark edilmiyor bile.",
      },
      {
        title: "Resepsiyon, eğitmen ve yönetim aynı ekranda",
        text: "Herkesin her şeyi görebildiği bir sistem ya da tek bir Excel dosyası, hem hata hem gizlilik riski yaratıyor.",
      },
    ],
    solutions: [
      {
        title: "Ödeme ve borç listesi",
        text: "Her üyenin ödemeleri profiline işlenir. Eksik ödemesi olan üyeler borç listesinde tutarıyla görünür, tahsilat durumu raporda izlenir.",
      },
      {
        title: "Üyelik bitişi ve pasif üye bildirimleri",
        text: "Üyeliği bitmek üzere olan ya da bir süredir gelmeyen üyeye SMS veya e-posta şablonunuz kendiliğinden gider.",
      },
      {
        title: "Dondurma kuralları",
        text: "Paket başına toplam dondurma hakkını gün olarak tanımlarsınız. Dondurulan üyelikler ayrı raporda takip edilir.",
      },
      {
        title: "Salon marketi",
        text: "Su, protein ya da ekipman satışını panelden yapar, stok hareketlerini izlersiniz; stok kritik seviyeye inince uyarı görürsünüz.",
      },
      {
        title: "Roller ve eğitmen hakedişi",
        text: "Resepsiyon, eğitmen ve yönetici farklı yetkilerle girer. Eğitmen ödemesi ders başı, ciro payı veya sabit ücret kuralıyla hesaplanır.",
      },
    ],
    faq: [
      {
        q: "Borçlu üyeleri nasıl görürüm?",
        a: "Eksik ödemesi olan üyeler borç listesi raporunda tutarlarıyla listelenir. Finans raporu da dönemin tahsilat durumunu gösterir.",
      },
      {
        q: "Üyeliği bitenlere hatırlatma gidiyor mu?",
        a: "Üyelik bitişi, paket bitişi, doğum günü ve pasif üye gibi durumlar için SMS veya e-posta şablonu tanımlarsınız; bildirimler kendiliğinden gönderilir.",
      },
      {
        q: "Hangi raporlar var?",
        a: "Üye, üyelik, finans, borç listesi, kapasite, ajanda, rezervasyon, dondurma, eğitmen ve eğitmen hakedişi raporları olmak üzere 10 rapor ekranı bulunur.",
      },
      {
        q: "Turnike veya kartlı geçiş sistemiyle çalışıyor mu?",
        a: "Panel her üye için bir QR kodu üretir. Mevcut turnike veya kart sisteminizle entegrasyon ihtiyacını görüşmede birlikte değerlendiririz.",
      },
      {
        q: "Su, protein gibi ürün satışlarını takip edebilir miyim?",
        a: "Evet. Salon marketinden ürün satışı yapar, stok hareketlerini izlersiniz. Bir ürünün stoğu tanımladığınız kritik seviyeye inince uyarı görürsünüz.",
      },
      {
        q: "Bir süredir gelmeyen üyeleri nasıl yakalarım?",
        a: "Derslere katılım üye profiline işlenir. Bir süredir gelmeyen üyeler için otomatik SMS veya e-posta şablonu tanımlayarak onlara kendiliğinden ulaşabilirsiniz.",
      },
    ],
  },
  {
    id: "dans",
    slug: "dans-sanat-kurslari",
    tab: "Dans & Sanat Kursları",
    title: "Gruplar, haftalık dersler ve ödeme düzeni",
    intro:
      "Dönemlik çalışan kurslarda grup listesi, katılım ve ödeme takibi el yazısından çıkmalı.",
    points: [
      "Branş ve grup dersleri tamamen size ait",
      "Süreli (dönemlik) ya da seanslı paket modeli",
      "Grup bazlı kontenjan ve katılım kaydı",
      "Eğitmen bazlı raporlama ve hakediş",
    ],
    screens: ["Tanımlamalar · Branşlar", "Randevular · Haftalık", "Raporlar · Rezervasyonlar"],
    metaTitle: "Dans ve Sanat Kursu Öğrenci Takip Programı",
    metaDescription:
      "Dans, müzik ve sanat kursları için öğrenci takip programı: branş ve grup dersleri, dönemlik paketler, katılım kaydı, ödeme ve borç takibi, eğitmen raporları.",
    h1: "Dans ve sanat kursları için öğrenci ve ders takip programı",
    lead:
      "Salsa başlangıç grubu, çocuk baleti, akşam gitar kursu… Her grubun kendi saati, eğitmeni ve ödeme dönemi var. Vetra kursunuzun gruplarını, öğrencilerini ve tahsilatını tek panelde yönetir.",
    fit:
      "Dönemlik grup dersleri veren dans okulları, müzik ve sanat atölyeleri ile çocuk ve yetişkin kursları için. Birden fazla branşı ve eğitmeni olan, ödemeleri dönem ya da ders bazında alan kurslar panelin tüm akışını kullanır.",
    problems: [
      {
        title: "Grup listeleri kâğıtta",
        text: "Hangi öğrencinin hangi gruba kayıtlı olduğu, grupların ne kadar dolu olduğu yoklama kâğıtlarından takip ediliyor.",
      },
      {
        title: "Dönem ödemeleri karışıyor",
        text: "Dönem başında alınan ödemeler, taksitler ve eksik kalan tutarlar ayrı bir defterde tutulunca kimin ödemediği gözden kaçıyor.",
      },
      {
        title: "Devamsızlık fark edilmiyor",
        text: "Birkaç haftadır gelmeyen öğrenci, dönem sonunda kaydını yenilemediğinde fark ediliyor.",
      },
    ],
    solutions: [
      {
        title: "Kendi branşlarınız ve grup dersleriniz",
        text: "Dans türlerini, enstrümanları ya da atölyeleri branş olarak siz tanımlarsınız. Her grup dersinin kontenjanı ve eğitmeni belirlidir.",
      },
      {
        title: "Dönemlik ya da seanslı paketler",
        text: "Paketi dönem süresine (gün sayısı), ders adedine ya da ikisine birden bağlarsınız.",
      },
      {
        title: "Haftalık tekrarlayan ders programı",
        text: "Her hafta aynı saatte dönen grupları kalıcı seans olarak bir kez kurarsınız; katılım her dersin üzerine işlenir.",
      },
      {
        title: "Ödeme ve borç takibi",
        text: "Öğrencinin ödemeleri profiline işlenir; eksik ödemeler borç listesinde tutarıyla görünür.",
      },
      {
        title: "Gelmeyen öğrenciye hatırlatma",
        text: "Bir süredir derse katılmayan öğrenciye ve paketi biten öğrenciye SMS veya e-posta şablonunuz kendiliğinden gider.",
      },
    ],
    faq: [
      {
        q: "Farklı branşları ve grupları ayrı yönetebilir miyim?",
        a: "Evet. Branş listesini siz oluşturursunuz; her branşa ayrı grup dersleri, kontenjanlar ve paketler tanımlayabilirsiniz.",
      },
      {
        q: "Dönemlik kurs ücretini nasıl tanımlarım?",
        a: "Süreli paket oluşturup dönem uzunluğunu gün olarak girersiniz. Ders adediyle sınırlamak isterseniz karma paket kullanabilirsiniz.",
      },
      {
        q: "Öğrencinin derse katılımı kaydediliyor mu?",
        a: "Katılım her dersin üzerine işlenir ve öğrenci profilinde birikir. Rezervasyon raporu grupların doluluğunu gösterir.",
      },
      {
        q: "Kayıt sözleşmesi hazırlayabilir miyim?",
        a: "Panelde sözleşme metinlerinizi şablon olarak tanımlayıp saklayabilirsiniz.",
      },
      {
        q: "Eğitmenlere ders başı ödeme yapıyorum, hesaplanır mı?",
        a: "Evet. Eğitmen için ders başı ücret, ciro payı ya da sabit ücret kuralı tanımlarsınız; hakediş raporu dönem sonunda verilen derslere göre tutarı çıkarır.",
      },
      {
        q: "Grup dolunca yeni kayıt alınır mı?",
        a: "Her grup dersinin kontenjanı tanımlıdır. Kontenjan dolduğunda derse yeni katılımcı eklenmez; doluluk takvimde ve kapasite raporunda görünür.",
      },
    ],
  },
];

export const getVertical = (slug: string) => verticals.find((v) => v.slug === slug);
export const verticalHref = (v: Pick<Vertical, "slug">) => `/kimler-icin/${v.slug}`;
