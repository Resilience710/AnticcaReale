import { Store, Shield, Truck, Award } from 'lucide-react';
import { TR } from '../constants/tr';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-navy-900 text-cream-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Hakkımızda</h1>
          <p className="text-xl text-cream-300">
            {TR.siteName} — {TR.tagline}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-navy-800 mb-6">Biz Kimiz?</h2>
            <p className="text-navy-700 leading-relaxed mb-4">
              Anticca, İstanbul'un köklü antika geleneğini dijital dünyaya taşıyan öncü bir platformdur. 
              2024 yılında kurulan şirketimiz, Türkiye'nin en seçkin antikacılarını ve antika meraklılarını 
              bir araya getirme vizyonuyla yola çıkmıştır.
            </p>
            <p className="text-navy-700 leading-relaxed mb-4">
              Misyonumuz, yüzyıllık zanaat geleneğini ve tarihi eserleri koruyarak gelecek nesillere 
              aktarmak, aynı zamanda antika koleksiyonerliğini herkes için erişilebilir kılmaktır.
            </p>
            <p className="text-navy-700 leading-relaxed">
              Platformumuzda yer alan her ürün, uzman ekibimiz tarafından titizlikle incelenir ve 
              orijinalliği doğrulanır. Müşterilerimize sadece ürün değil, aynı zamanda her eserin 
              ardındaki hikayeyi de sunuyoruz.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-navy-800 mb-6">Değerlerimiz</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-cream-200">
                <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-gold-700" />
                </div>
                <h3 className="font-semibold text-navy-800 text-lg mb-2">Güvenilirlik</h3>
                <p className="text-navy-600">
                  Tüm ürünlerimizin orijinalliğini garanti ediyor, şeffaf ve dürüst bir alışveriş 
                  deneyimi sunuyoruz.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-cream-200">
                <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-gold-700" />
                </div>
                <h3 className="font-semibold text-navy-800 text-lg mb-2">Kalite</h3>
                <p className="text-navy-600">
                  Sadece en kaliteli ve değerli antika eserleri platformumuza kabul ediyoruz.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-cream-200">
                <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center mb-4">
                  <Store className="h-6 w-6 text-gold-700" />
                </div>
                <h3 className="font-semibold text-navy-800 text-lg mb-2">Gelenek</h3>
                <p className="text-navy-600">
                  İstanbul'un yüzyıllık antikacılık geleneğini yaşatıyor ve destekliyoruz.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-cream-200">
                <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-gold-700" />
                </div>
                <h3 className="font-semibold text-navy-800 text-lg mb-2">Özenli Hizmet</h3>
                <p className="text-navy-600">
                  Her ürün özel olarak paketlenir ve sigortalı kargo ile güvenle teslim edilir.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-navy-800 mb-6">Hikayemiz</h2>
            <p className="text-navy-700 leading-relaxed mb-4">
              Anticca'nın hikayesi, kurucumuzun Çukurcuma ve Horhor'daki antikacı dükkânlarında 
              geçirdiği çocukluk yıllarına dayanır. O dönemde her dükkânın kendine özgü bir ruhu, 
              her eserin anlatılmayı bekleyen bir hikayesi vardı.
            </p>
            <p className="text-navy-700 leading-relaxed mb-4">
              Yıllar içinde dijitalleşen dünyada, bu eşsiz deneyimin kaybolmaması gerektiğine 
              inandık. Anticca, geleneksel antikacılığın sıcaklığını ve güvenilirliğini, modern 
              teknolojinin kolaylığıyla birleştirmek için doğdu.
            </p>
            <p className="text-navy-700 leading-relaxed">
              Bugün, İstanbul'un dört bir yanından seçkin antikacıları platformumuzda ağırlıyor 
              ve Türkiye genelindeki antika tutkunlarına hizmet veriyoruz.
            </p>
          </section>

          <section className="bg-navy-900 text-cream-100 p-8 rounded-xl">
            <h2 className="font-serif text-2xl font-bold mb-4">Rakamlarla Anticca</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-gold-500">50+</p>
                <p className="text-cream-300">Antika Dükkanı</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gold-500">1000+</p>
                <p className="text-cream-300">Ürün</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gold-500">5000+</p>
                <p className="text-cream-300">Mutlu Müşteri</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gold-500">81</p>
                <p className="text-cream-300">İl'e Teslimat</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
