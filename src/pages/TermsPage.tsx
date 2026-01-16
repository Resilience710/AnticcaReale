import { TR } from '../constants/tr';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-linen-300">
      {/* Header */}
      <div className="bg-olive-800 text-linen-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Kullanım Şartları</h1>
          <p className="text-xl text-linen-300">
            Son güncelleme: Ocak 2024
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-linen-200 rounded-xl shadow-sm border border-mist-300 p-8 md:p-12">
          <div className="prose prose-lg max-w-none text-espresso-800">
            
            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">1. Genel Hükümler</h2>
              <p>
                Bu web sitesini ("Site") kullanarak, aşağıdaki kullanım şartlarını kabul etmiş sayılırsınız. 
                {TR.siteName} ("Şirket", "biz"), bu şartları önceden haber vermeksizin değiştirme hakkını saklı tutar.
              </p>
              <p>
                Site üzerinden sunulan hizmetlerden yararlanabilmek için 18 yaşını doldurmuş olmanız gerekmektedir.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">2. Hesap Oluşturma ve Güvenlik</h2>
              <p>
                Site üzerinden alışveriş yapabilmek için hesap oluşturmanız gerekmektedir. Hesap bilgilerinizin 
                doğruluğundan ve güncelliğinden siz sorumlusunuz.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Hesap bilgilerinizi üçüncü şahıslarla paylaşmayınız.</li>
                <li>Şifrenizi düzenli olarak değiştiriniz.</li>
                <li>Hesabınızda şüpheli bir aktivite fark ederseniz derhal bize bildirin.</li>
                <li>Hesabınız üzerinden gerçekleştirilen tüm işlemlerden siz sorumlusunuz.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">3. Ürünler ve Fiyatlandırma</h2>
              <p>
                Site üzerinde sergilenen tüm ürünler, platformumuzda kayıtlı antika dükkanları tarafından 
                satışa sunulmaktadır.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ürün fiyatları Türk Lirası (TRY) cinsindendir ve KDV dahildir.</li>
                <li>Fiyatlar önceden haber verilmeksizin değiştirilebilir.</li>
                <li>Ürün görselleri temsilidir, gerçek ürün farklılık gösterebilir.</li>
                <li>Stok durumu anlık olarak güncellenmeye çalışılmaktadır.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">4. Sipariş ve Ödeme</h2>
              <p>
                Sipariş vermek, satış sözleşmesi için bağlayıcı bir teklif anlamına gelir.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ödemeler Shopier altyapısı üzerinden güvenli şekilde alınmaktadır.</li>
                <li>Kredi kartı, banka kartı ve havale/EFT ile ödeme yapılabilir.</li>
                <li>Siparişiniz, ödeme onayı alındıktan sonra işleme alınır.</li>
                <li>Sipariş onayı e-posta adresinize gönderilecektir.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">5. Kargo ve Teslimat</h2>
              <p>
                Ürünler, özenle paketlenerek anlaşmalı kargo firmaları aracılığıyla gönderilir.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Teslimat süresi İstanbul içi 1-3, İstanbul dışı 3-7 iş günüdür.</li>
                <li>Kargo ücreti sipariş tutarına ve teslimat adresine göre değişir.</li>
                <li>500 TL üzeri siparişlerde Türkiye geneli kargo ücretsizdir.</li>
                <li>Tüm gönderiler sigortalıdır.</li>
                <li>Teslimat sırasında ürünü kontrol ediniz, hasarlı ürünü teslim almayınız.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">6. İade ve Değişim</h2>
              <p>
                Tüketicinin Korunması Hakkında Kanun kapsamında cayma hakkınız bulunmaktadır.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ürünü teslim aldıktan sonra 14 gün içinde iade edebilirsiniz.</li>
                <li>İade edilecek ürün kullanılmamış ve orijinal ambalajında olmalıdır.</li>
                <li>İade kargo ücreti alıcıya aittir.</li>
                <li>İade işlemi için önce müşteri hizmetlerimizle iletişime geçiniz.</li>
                <li>İade onayından sonra 14 iş günü içinde ödemeniz iade edilir.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">7. Fikri Mülkiyet Hakları</h2>
              <p>
                Site üzerindeki tüm içerik (metin, grafik, logo, görsel, ses, video vb.) {TR.siteName}'ya 
                veya lisans verenlerine aittir ve telif hakları ile korunmaktadır.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>İçerikleri izinsiz kopyalamak, dağıtmak veya değiştirmek yasaktır.</li>
                <li>Ticari amaçla kullanım için yazılı izin gereklidir.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">8. Sorumluluk Sınırlaması</h2>
              <p>
                {TR.siteName}, aşağıdaki durumlardan kaynaklanan zararlardan sorumlu tutulamaz:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Mücbir sebepler (doğal afet, savaş, grev vb.)</li>
                <li>İnternet bağlantı sorunları</li>
                <li>Üçüncü taraf hizmet sağlayıcılarından kaynaklanan aksaklıklar</li>
                <li>Kullanıcı hatasından kaynaklanan sorunlar</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">9. Uyuşmazlık Çözümü</h2>
              <p>
                Bu şartlardan doğan uyuşmazlıklarda İstanbul Mahkemeleri ve İcra Daireleri yetkilidir. 
                Türkiye Cumhuriyeti kanunları uygulanır.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">10. İletişim</h2>
              <p>
                Kullanım şartları hakkında sorularınız için bizimle iletişime geçebilirsiniz:
              </p>
              <ul className="list-none space-y-1 mt-4">
                <li><strong>E-posta:</strong> hukuk@anticca.com</li>
                <li><strong>Telefon:</strong> +90 (212) 555 00 42</li>
                <li><strong>Adres:</strong> Çukurcuma Mah., Antikacılar Sok. No: 42, Beyoğlu/İstanbul</li>
              </ul>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
