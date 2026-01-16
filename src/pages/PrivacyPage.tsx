import { TR } from '../constants/tr';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-linen-300">
      {/* Header */}
      <div className="bg-olive-800 text-linen-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Gizlilik Politikası</h1>
          <p className="text-xl text-linen-300">
            Son güncelleme: Ocak 2024
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-linen-200 rounded-xl shadow-sm border border-mist-300 p-8 md:p-12">
          <div className="prose prose-lg max-w-none text-espresso-800">
            
            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">1. Giriş</h2>
              <p>
                {TR.siteName} ("Şirket", "biz") olarak, gizliliğinize saygı duyuyor ve kişisel verilerinizin 
                korunmasını önemsiyoruz. Bu Gizlilik Politikası, kişisel verilerinizin nasıl toplandığını, 
                kullanıldığını, saklandığını ve korunduğunu açıklamaktadır.
              </p>
              <p>
                6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu sıfatıyla 
                hareket etmekteyiz.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">2. Toplanan Kişisel Veriler</h2>
              <p>Hizmetlerimizi sunabilmek için aşağıdaki kişisel verileri toplayabiliriz:</p>
              
              <h3 className="text-lg font-semibold text-espresso-900 mt-4 mb-2">2.1 Kimlik Bilgileri</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Ad ve soyad</li>
                <li>T.C. kimlik numarası (fatura için)</li>
                <li>Doğum tarihi</li>
              </ul>

              <h3 className="text-lg font-semibold text-espresso-900 mt-4 mb-2">2.2 İletişim Bilgileri</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>E-posta adresi</li>
                <li>Telefon numarası</li>
                <li>Teslimat ve fatura adresi</li>
              </ul>

              <h3 className="text-lg font-semibold text-espresso-900 mt-4 mb-2">2.3 İşlem Bilgileri</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Sipariş geçmişi</li>
                <li>Ödeme bilgileri (kart bilgileri tarafımızda saklanmaz)</li>
                <li>Müşteri hizmetleri yazışmaları</li>
              </ul>

              <h3 className="text-lg font-semibold text-espresso-900 mt-4 mb-2">2.4 Teknik Bilgiler</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>IP adresi</li>
                <li>Tarayıcı türü ve sürümü</li>
                <li>Cihaz bilgileri</li>
                <li>Çerezler ve benzeri teknolojiler</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">3. Verilerin Kullanım Amaçları</h2>
              <p>Kişisel verilerinizi aşağıdaki amaçlarla kullanmaktayız:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Siparişlerinizi işleme almak ve teslim etmek</li>
                <li>Hesabınızı yönetmek ve güvenliğini sağlamak</li>
                <li>Müşteri hizmetleri desteği sunmak</li>
                <li>Yasal yükümlülüklerimizi yerine getirmek</li>
                <li>Hizmetlerimizi geliştirmek ve kişiselleştirmek</li>
                <li>İzniniz dahilinde pazarlama iletişimleri göndermek</li>
                <li>Dolandırıcılığı önlemek ve tespit etmek</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">4. Verilerin Paylaşılması</h2>
              <p>Kişisel verileriniz aşağıdaki taraflarla paylaşılabilir:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Kargo şirketleri:</strong> Teslimat için gerekli bilgiler</li>
                <li><strong>Ödeme hizmet sağlayıcıları:</strong> Güvenli ödeme işlemleri için</li>
                <li><strong>Satıcı dükkanlar:</strong> Sipariş hazırlığı ve teslimi için</li>
                <li><strong>Yasal merciler:</strong> Yasal zorunluluk halinde</li>
                <li><strong>İş ortakları:</strong> Hizmet sunumu için (gizlilik sözleşmesi kapsamında)</li>
              </ul>
              <p className="mt-4">
                Kişisel verilerinizi hiçbir koşulda üçüncü taraflara satmıyoruz.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">5. Veri Güvenliği</h2>
              <p>Kişisel verilerinizi korumak için aşağıdaki önlemleri alıyoruz:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>SSL şifreleme ile güvenli veri iletimi</li>
                <li>Güvenli sunucularda veri depolama</li>
                <li>Erişim kontrolü ve yetkilendirme sistemleri</li>
                <li>Düzenli güvenlik denetimleri</li>
                <li>Çalışan eğitimi ve gizlilik sözleşmeleri</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">6. Çerezler (Cookies)</h2>
              <p>
                Sitemizde kullanıcı deneyimini iyileştirmek için çerezler kullanılmaktadır.
              </p>
              <h3 className="text-lg font-semibold text-espresso-900 mt-4 mb-2">Kullandığımız Çerez Türleri:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Zorunlu çerezler:</strong> Sitenin çalışması için gerekli</li>
                <li><strong>İşlevsel çerezler:</strong> Tercihlerinizi hatırlamak için</li>
                <li><strong>Analitik çerezler:</strong> Site kullanımını analiz etmek için</li>
                <li><strong>Pazarlama çerezleri:</strong> Kişiselleştirilmiş reklamlar için</li>
              </ul>
              <p className="mt-4">
                Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz. Ancak bu durumda 
                bazı site özellikleri düzgün çalışmayabilir.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">7. Veri Saklama Süresi</h2>
              <p>
                Kişisel verileriniz, işleme amaçları için gerekli olan süre boyunca veya yasal 
                yükümlülüklerimiz kapsamında saklanır.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Hesap bilgileri: Hesap aktif olduğu sürece</li>
                <li>Sipariş bilgileri: 10 yıl (yasal zorunluluk)</li>
                <li>Pazarlama izinleri: İzin geri çekilene kadar</li>
                <li>Çerez verileri: 1 yıl</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">8. Haklarınız (KVKK Madde 11)</h2>
              <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>İşlenmişse buna ilişkin bilgi talep etme</li>
                <li>İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
                <li>Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme</li>
                <li>Silinmesini veya yok edilmesini isteme</li>
                <li>Otomatik sistemler vasıtasıyla analiz edilmesi sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
                <li>Kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">9. Politika Güncellemeleri</h2>
              <p>
                Bu Gizlilik Politikası'nı zaman zaman güncelleyebiliriz. Önemli değişikliklerde 
                sizi e-posta veya site üzerinden bilgilendireceğiz. Güncel politikayı düzenli 
                olarak kontrol etmenizi öneririz.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">10. İletişim</h2>
              <p>
                Gizlilik politikamız veya kişisel verilerinizle ilgili sorularınız için:
              </p>
              <ul className="list-none space-y-1 mt-4">
                <li><strong>Veri Sorumlusu:</strong> {TR.siteName}</li>
                <li><strong>E-posta:</strong> kvkk@anticca.com</li>
                <li><strong>Telefon:</strong> +90 (212) 555 00 42</li>
                <li><strong>Adres:</strong> Çukurcuma Mah., Antikacılar Sok. No: 42, Beyoğlu/İstanbul</li>
              </ul>
              <p className="mt-4">
                KVKK kapsamındaki başvurularınızı yazılı olarak veya kayıtlı elektronik posta (KEP) 
                adresimiz üzerinden iletebilirsiniz.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
