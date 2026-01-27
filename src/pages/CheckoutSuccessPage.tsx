import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, Truck, Clock, ArrowRight, Home } from 'lucide-react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Button from '../components/ui/Button';
import type { Order } from '../types';

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const paymentId = searchParams.get('paymentId');
  const installment = searchParams.get('installment');
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderUpdated, setOrderUpdated] = useState(false);

  useEffect(() => {
    async function fetchAndUpdateOrder() {
      if (!orderId) {
        setError('Sipariş bulunamadı');
        setLoading(false);
        return;
      }

      try {
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
          setError('Sipariş bulunamadı');
          setLoading(false);
          return;
        }

        const orderData = { id: orderSnap.id, ...orderSnap.data() } as Order;
        setOrder(orderData);

        // Update order status if still pending
        if (orderData.status === 'Ödeme Bekleniyor' && !orderUpdated) {
          try {
            await updateDoc(orderRef, {
              status: 'Ödendi',
              shopierTransactionId: paymentId || '',
              updatedAt: serverTimestamp(),
            });
            
            setOrder(prev => prev ? { ...prev, status: 'Ödendi' } : null);
            setOrderUpdated(true);
          } catch (updateError) {
            console.error('Failed to update order status:', updateError);
          }
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Sipariş bilgileri alınamadı');
      } finally {
        setLoading(false);
      }
    }

    fetchAndUpdateOrder();
  }, [orderId, paymentId, orderUpdated]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price);
  };

  const formatDate = (date: Date | unknown) => {
    const d = (date as { toDate?: () => Date })?.toDate?.() || date || new Date();
    return new Intl.DateTimeFormat('tr-TR', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date(d as Date));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linen-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-espresso-700">Sipariş bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-linen-100 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Package className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-espresso-900 mb-2">
            {error || 'Sipariş bulunamadı'}
          </h1>
          <p className="text-espresso-600 mb-6">
            Lütfen siparişleriniz sayfasından kontrol edin.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/orders">
              <Button variant="primary">Siparişlerim</Button>
            </Link>
            <Link to="/">
              <Button variant="outline">
                <Home className="h-4 w-4 mr-2" />
                Ana Sayfa
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linen-100">
      {/* Success Header */}
      <div className="bg-gradient-to-br from-olive-800 to-olive-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="h-14 w-14 text-white" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">
            Ödemeniz Başarıyla Alındı!
          </h1>
          <p className="text-linen-200 text-lg">
            Siparişiniz için teşekkür ederiz.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 -mt-8">
        {/* Order Summary Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-linen-50 px-6 py-4 border-b border-linen-200">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="text-sm text-espresso-500">Sipariş Numarası</p>
                <p className="font-mono text-lg font-bold text-espresso-900">
                  #{order.id.slice(-8).toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-espresso-500">Sipariş Tarihi</p>
                <p className="text-espresso-800">{formatDate(order.createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-6 bg-gradient-to-r from-gold-50 to-linen-50">
            <div className="flex items-center gap-4">
              <div className="bg-gold-500 rounded-full p-3">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-espresso-900">
                  Sipariş Durumu: <span className="text-gold-700">{order.status}</span>
                </p>
                <p className="text-sm text-espresso-600">
                  Siparişiniz hazırlanmak üzere satıcıya iletildi.
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4">
            <h3 className="font-semibold text-espresso-900 mb-4">Sipariş Detayları</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 py-3 border-b border-linen-100 last:border-0">
                  <div className="w-16 h-16 bg-linen-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🏺</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-espresso-900 line-clamp-1">{item.productName}</p>
                    <p className="text-sm text-espresso-500">{item.quantity} adet × {formatPrice(item.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-espresso-900">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 py-4 bg-espresso-900 text-white">
            <div className="flex justify-between items-center">
              <span className="text-lg">Toplam Tutar</span>
              <span className="text-2xl font-bold text-gold-400">{formatPrice(order.totalPrice)}</span>
            </div>
            {installment && parseInt(installment) > 0 && (
              <p className="text-sm text-linen-300 mt-1">{installment} taksit ile ödendi</p>
            )}
          </div>
        </div>

        {paymentId && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex items-center gap-3 text-sm text-espresso-600">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Ödeme Referans No: <code className="bg-linen-100 px-2 py-1 rounded">{paymentId}</code></span>
            </div>
          </div>
        )}

        {order.userAddress && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-olive-600 mt-1" />
              <div>
                <h4 className="font-semibold text-espresso-900 mb-1">Teslimat Adresi</h4>
                <p className="text-espresso-600">{order.userName}</p>
                <p className="text-espresso-600">{order.userAddress}</p>
                {order.userPhone && <p className="text-espresso-500 mt-1">{order.userPhone}</p>}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/orders">
            <Button size="lg" variant="primary">
              <Package className="h-5 w-5 mr-2" />
              Siparişlerimi Görüntüle
            </Button>
          </Link>
          <Link to="/products">
            <Button size="lg" variant="outline">
              Alışverişe Devam Et
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-espresso-500">
          <p>
            Sorularınız için{' '}
            <Link to="/contact" className="text-gold-700 hover:underline">iletişim sayfamızı</Link>{' '}
            ziyaret edebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}
