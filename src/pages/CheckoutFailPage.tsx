import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { XCircle, RefreshCcw, HelpCircle, Home, ShoppingCart } from 'lucide-react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Button from '../components/ui/Button';
import type { Order } from '../types';

const ERROR_MESSAGES: Record<string, string> = {
  'payment_failed': 'Ödeme işlemi sırasında bir hata oluştu.',
  'signature_error': 'Ödeme doğrulanamadı. Güvenlik kontrolü başarısız.',
  'validation_error': 'Eksik veya hatalı ödeme bilgisi.',
  'parse_error': 'Ödeme verisi işlenemedi.',
  'internal_error': 'Sunucu hatası oluştu.',
  'cancelled': 'Ödeme iptal edildi.',
  'timeout': 'Ödeme süresi doldu.',
  'insufficient_funds': 'Yetersiz bakiye.',
  'card_declined': 'Kart reddedildi.',
};

export default function CheckoutFailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const orderId = searchParams.get('orderId');
  const errorCode = searchParams.get('error') || 'payment_failed';
  const errorMessage = searchParams.get('message');
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(!!orderId);
  const [retrying, setRetrying] = useState(false);

  const displayError = errorMessage || ERROR_MESSAGES[errorCode] || 'Ödeme işlemi başarısız oldu.';

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          setOrder({ id: orderSnap.id, ...orderSnap.data() } as Order);
        }
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  const handleRetryPayment = async () => {
    if (!orderId || !order) return;
    setRetrying(true);
    
    try {
      navigate('/cart', { 
        state: { retryOrderId: orderId, message: 'Ödemenizi tekrar deneyebilirsiniz.' }
      });
    } finally {
      setRetrying(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!orderId) return;
    
    const confirm = window.confirm('Siparişi iptal etmek istediğinizden emin misiniz?');
    if (!confirm) return;
    
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'İptal Edildi',
        updatedAt: serverTimestamp(),
      });
      
      setOrder(prev => prev ? { ...prev, status: 'İptal Edildi' } : null);
    } catch (err) {
      console.error('Cancel error:', err);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linen-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-espresso-700">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linen-100">
      {/* Error Header */}
      <div className="bg-gradient-to-br from-red-700 to-red-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-14 w-14 text-white" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">
            Ödeme Başarısız
          </h1>
          <p className="text-red-100 text-lg max-w-md mx-auto">
            {displayError}
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 -mt-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-linen-200">
              <div className="bg-red-100 rounded-full p-2">
                <HelpCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-espresso-500">Hata Kodu</p>
                <p className="font-mono text-espresso-900">{errorCode.toUpperCase()}</p>
              </div>
            </div>

            {order && (
              <div className="mb-6">
                <h3 className="font-semibold text-espresso-900 mb-3">Sipariş Bilgileri</h3>
                <div className="bg-linen-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-espresso-600">Sipariş No:</span>
                    <span className="font-mono text-espresso-900">#{order.id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-espresso-600">Ürün Sayısı:</span>
                    <span className="text-espresso-900">{order.items.length} ürün</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-espresso-600">Durum:</span>
                    <span className={`font-medium ${order.status === 'İptal Edildi' ? 'text-red-600' : 'text-gold-700'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-linen-200">
                    <span className="font-medium text-espresso-900">Toplam:</span>
                    <span className="font-bold text-espresso-900">{formatPrice(order.totalPrice)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-semibold text-espresso-900 mb-3">Olası Nedenler</h3>
              <ul className="text-sm text-espresso-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-gold-600 mt-1">•</span>
                  <span>Kart bilgilerinizi kontrol edin (numara, son kullanma tarihi, CVV)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-600 mt-1">•</span>
                  <span>Kartınızda yeterli bakiye/limit olduğundan emin olun</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-600 mt-1">•</span>
                  <span>İnternet güvenli ödeme (3D Secure) için bankanızın onayını verin</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold-600 mt-1">•</span>
                  <span>Farklı bir kart veya ödeme yöntemi deneyin</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              {order && order.status !== 'İptal Edildi' && (
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full"
                  onClick={handleRetryPayment}
                  loading={retrying}
                >
                  <RefreshCcw className="h-5 w-5 mr-2" />
                  Ödemeyi Tekrar Dene
                </Button>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <Link to="/cart" className="block">
                  <Button size="lg" variant="outline" className="w-full">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Sepete Git
                  </Button>
                </Link>
                <Link to="/" className="block">
                  <Button size="lg" variant="ghost" className="w-full">
                    <Home className="h-5 w-5 mr-2" />
                    Ana Sayfa
                  </Button>
                </Link>
              </div>

              {order && order.status !== 'İptal Edildi' && (
                <button
                  onClick={handleCancelOrder}
                  className="w-full text-sm text-red-600 hover:text-red-800 py-2 transition-colors"
                >
                  Siparişi İptal Et
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-olive-50 rounded-xl p-6 text-center">
          <h4 className="font-semibold text-olive-900 mb-2">Yardıma mı ihtiyacınız var?</h4>
          <p className="text-sm text-olive-700 mb-4">
            Ödeme sorununuz devam ediyorsa bizimle iletişime geçin.
          </p>
          <Link to="/contact">
            <Button variant="outline" size="sm">
              <HelpCircle className="h-4 w-4 mr-2" />
              İletişime Geç
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
