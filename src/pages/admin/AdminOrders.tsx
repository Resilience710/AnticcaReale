import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useAllOrders, updateOrderStatus } from '../../hooks/useFirestore';
import { Order, ORDER_STATUSES, OrderStatus } from '../../types';
import { TR } from '../../constants/tr';
import Select from '../../components/ui/Select';
import Loading from '../../components/ui/Loading';

const statusColors: Record<string, string> = {
  'Ödeme Bekleniyor': 'bg-yellow-100 text-yellow-800',
  'Ödendi': 'bg-blue-100 text-blue-800',
  'Hazırlanıyor': 'bg-purple-100 text-purple-800',
  'Kargolandı': 'bg-indigo-100 text-indigo-800',
  'Teslim Edildi': 'bg-green-100 text-green-800',
  'İptal Edildi': 'bg-red-100 text-red-800',
};

export default function AdminOrders() {
  const { orders, loading, refetch } = useAllOrders();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      await refetch();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Durum güncellenirken hata oluştu.');
    } finally {
      setUpdatingId(null);
    }
  };

  const statusOptions = ORDER_STATUSES.map((status) => ({
    value: status,
    label: status,
  }));

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-navy-800 mb-6">
        {TR.admin.orders}
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-cream-200 p-8 text-center text-navy-500">
          Henüz sipariş bulunmuyor.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm border border-cream-200 overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-4 md:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-2">
                      <div>
                        <p className="text-sm text-navy-500">
                          {TR.orders.orderNumber}:{' '}
                          <span className="font-mono font-bold text-navy-800">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                        </p>
                        <p className="text-sm text-navy-400 mt-1">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-navy-400">Müşteri</p>
                        <p className="font-medium text-navy-800">{order.userName}</p>
                        <p className="text-sm text-navy-500">{order.userEmail}</p>
                        {order.userPhone && (
                          <p className="text-sm text-navy-500">{order.userPhone}</p>
                        )}
                      </div>
                      {order.userAddress && (
                        <div>
                          <p className="text-xs text-navy-400">Adres</p>
                          <p className="text-sm text-navy-600">{order.userAddress}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-navy-400">Toplam</p>
                        <p className="font-bold text-lg text-gold-700">
                          {formatPrice(order.totalPrice)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-full sm:w-48">
                      <Select
                        options={statusOptions}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        disabled={updatingId === order.id}
                      />
                    </div>
                    
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="flex items-center gap-2 text-navy-600 hover:text-navy-800 transition-colors"
                    >
                      {expandedOrder === order.id ? (
                        <>
                          Gizle <ChevronUp className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Detaylar <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Current Status Badge */}
                <div className="mt-4">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      statusColors[order.status] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {order.status}
                  </span>
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
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-cream-100 flex-shrink-0">
                          {item.productImage ? (
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">
                              🏺
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-navy-800 truncate">
                            {item.productName}
                          </p>
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

                  {order.shopierTransactionId && (
                    <div className="mt-4 pt-4 border-t border-cream-200">
                      <p className="text-sm text-navy-500">
                        Shopier İşlem ID:{' '}
                        <span className="font-mono text-navy-700">
                          {order.shopierTransactionId}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
