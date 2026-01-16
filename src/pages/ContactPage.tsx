import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setLoading(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-linen-300">
      {/* Header */}
      <div className="bg-olive-800 text-linen-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">İletişim</h1>
          <p className="text-xl text-linen-300">
            Sorularınız için bize ulaşın
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-6">
              Bize Ulaşın
            </h2>
            <p className="text-espresso-700 mb-8">
              Antika alım satım, dükkan başvuruları veya genel sorularınız için 
              aşağıdaki kanallardan bize ulaşabilirsiniz.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-gold-800" />
                </div>
                <div>
                  <h3 className="font-semibold text-espresso-900 mb-1">Adres</h3>
                  <p className="text-espresso-700">
                    Çukurcuma Mahallesi, Antikacılar Sokak No: 42<br />
                    Beyoğlu, İstanbul 34425
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-gold-800" />
                </div>
                <div>
                  <h3 className="font-semibold text-espresso-900 mb-1">Telefon</h3>
                  <p className="text-espresso-700">
                    +90 (212) 555 00 42<br />
                    +90 (532) 555 00 42 (WhatsApp)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-gold-800" />
                </div>
                <div>
                  <h3 className="font-semibold text-espresso-900 mb-1">E-posta</h3>
                  <p className="text-espresso-700">
                    info@anticca.com<br />
                    destek@anticca.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-gold-800" />
                </div>
                <div>
                  <h3 className="font-semibold text-espresso-900 mb-1">Çalışma Saatleri</h3>
                  <p className="text-espresso-700">
                    Pazartesi - Cumartesi: 10:00 - 19:00<br />
                    Pazar: 12:00 - 18:00
                  </p>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mt-8 bg-olive-100 rounded-xl h-64 flex items-center justify-center">
              <div className="text-center text-olive-600">
                <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Harita</p>
                <p className="text-sm">Çukurcuma, Beyoğlu</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-linen-200 rounded-xl shadow-sm border border-mist-300 p-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-6">
                Mesaj Gönderin
              </h2>

              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-espresso-900 mb-2">
                    Mesajınız Alındı!
                  </h3>
                  <p className="text-espresso-700 mb-6">
                    En kısa sürede size dönüş yapacağız.
                  </p>
                  <Button onClick={() => setSubmitted(false)} variant="outline">
                    Yeni Mesaj Gönder
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Adınız Soyadınız"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Ahmet Yılmaz"
                  />

                  <Input
                    label="E-posta Adresiniz"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="ornek@email.com"
                  />

                  <Input
                    label="Konu"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    placeholder="Mesajınızın konusu"
                  />

                  <div>
                    <label className="block text-sm font-medium text-espresso-800 mb-1">
                      Mesajınız
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={5}
                      placeholder="Mesajınızı buraya yazın..."
                      className="w-full px-4 py-2.5 rounded-lg border border-mist-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 bg-linen-100"
                    />
                  </div>

                  <Button type="submit" className="w-full" loading={loading}>
                    <Send className="h-5 w-5 mr-2" />
                    Gönder
                  </Button>
                </form>
              )}
            </div>

            {/* FAQ */}
            <div className="mt-8 bg-linen-200 rounded-xl p-6 border border-mist-300">
              <h3 className="font-semibold text-espresso-900 mb-4">Sık Sorulan Sorular</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium text-espresso-800">Ürün iadesi yapabilir miyim?</p>
                  <p className="text-espresso-700">Evet, 14 gün içinde iade hakkınız bulunmaktadır.</p>
                </div>
                <div>
                  <p className="font-medium text-espresso-800">Kargo ücreti ne kadar?</p>
                  <p className="text-espresso-700">500 TL üzeri siparişlerde kargo ücretsizdir.</p>
                </div>
                <div>
                  <p className="font-medium text-espresso-800">Dükkanımı nasıl ekleyebilirim?</p>
                  <p className="text-espresso-700">Bizimle iletişime geçerek başvuru yapabilirsiniz.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
