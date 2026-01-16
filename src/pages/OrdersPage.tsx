import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Package, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../hooks/useFirestore';
import { TR } from '../constants/tr';
import Loading from '../components/ui/Loading';
import Button from '../components/ui/Button';

const statusColors: Record<string, string> = {
  'Ödeme Bekleniyor': 'bg-yellow-100 text-yellow-800',
  'Ödendi': 'bg-blue-100 text-blue-800',
  'Hazırlanıyor': 'bg-purple-100 text-purple-800',
  'Kargolandı': 'bg-indigo-100 text-indigo-800',
  'Teslim Edildi': 'bg-green-100 text-green-800',
  'İptal Edildi': 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const { currentUser } = useAuth();
  const { orders, loading } = useOrders(currentUser?.uid);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [searchParams]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price);
  };

  const formatDate = (date: any) => {
    if (!date) return '-';
    const d = date.toDate ? date.toDate() : new Date(date);
    return new Intl.DateTimeFormat('tr-TR', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(d);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center py-16 px-4">
          <Package className="h-20 w-20 text-navy-300 mx-auto mb-6" />
          <h1 className="font-serif text-2xl font-bold text-navy-800 mb-2">
            {TR.errors.unauthorized}
          </h1>
          <p className="text-navy-600 mb-6">
            Siparişlerinizi görüntülemek için giriş yapın.
          </p>
          <Link to="/login?redirect=/orders">
            <Button size="lg">{TR.auth.login}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-navy-900 text-cream-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold">{TR.orders.title}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-800">Siparişiniz alındı!</p>
              <p className="text-sm text-green-700">
                Ödeme işlemi tamamlandıktan sonra siparişiniz hazırlanmaya başlayacak.
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <Loading />
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-cream-200">
            <Package className="h-16 w-16 text-navy-300 mx-auto mb-4" />
            <p className="text-navy-600 text-lg">{TR.orders.empty}</p>
            <Link to="/products" className="inline-block mt-4">
              <Button>{TR.cart.continueShopping}</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm border border-cream-200 overflow-hidden"
              >
                {/* Order Header */}
                <div
                  className="p-4 md:p-6 cursor-pointer hover:bg-cream-50 transition-colors"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-sm text-navy-500">
                        {TR.orders.orderNumber}:{' '}
                        <span className="font-mono font-medium text-navy-700">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                      </p>
                      <p className="text-sm text-navy-400 mt-1">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          statusColors[order.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="font-bold text-navy-800">
                        {formatPrice(order.totalPrice)}
                      </span>
                      {expandedOrder === order.id ? (
                        <ChevronUp className="h-5 w-5 text-navy-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-navy-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Details (Expanded) */}
                {expandedOrder === order.id && (
                  <div className="border-t border-cream-200 p-4 md:p-6 bg-cream-50">
                    <h4 className="font-medium text-navy-700 mb-4">{TR.orders.items}</h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 bg-white p-3 rounded-lg"
                        >
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-cream-100 flex-shrink-0">
                            {item.productImage ? (
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xl">
                                🏺
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/products/${item.productId}`}
                              className="font-medium text-navy-800 hover:text-gold-700 truncate block"
                            >
                              {item.productName}
                            </Link>
                            <p className="text-sm text-navy-500">
                              {item.quantity} adet × {formatPrice(item.price)}
                            </p>
                          </div>
                          <div className="font-medium text-navy-800">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-cream-200 flex justify-between">
                      <span className="font-medium text-navy-700">{TR.orders.total}</span>
                      <span className="font-bold text-lg text-gold-700">
                        {formatPrice(order.totalPrice)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
