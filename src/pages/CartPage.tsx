import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, CreditCard, Shield, Lock } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createOrder } from '../hooks/useFirestore';
import { TR } from '../constants/tr';
import Button from '../components/ui/Button';
import { 
  initiateShopierPayment, 
  parseUserName, 
  formatPhoneNumber,
  type CreatePaymentRequest 
} from '../services/shopierService';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentStep, setPaymentStep] = useState<'idle' | 'creating_order' | 'redirecting'>('idle');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price);
  };

  const handleShopierCheckout = async () => {
    if (!currentUser || !userData) {
      navigate('/login?redirect=/cart');
      return;
    }

    if (!userData.name || !userData.email) {
      setError('Lütfen profil bilgilerinizi tamamlayın.');
      return;
    }

    setLoading(true);
    setError('');
    setPaymentStep('creating_order');

    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.images?.[0] || '',
        shopId: item.product.shopId,
        shopName: '',
        quantity: item.quantity,
        price: item.product.price,
      }));

      const orderId = await createOrder({
        userId: currentUser.uid,
        userEmail: userData.email,
        userName: userData.name,
        userPhone: userData.phone,
        userAddress: userData.address,
        items: orderItems,
        totalPrice,
        status: 'Ödeme Bekleniyor',
      });

      console.log('Order created:', orderId);
      setPaymentStep('redirecting');

      const { name, surname } = parseUserName(userData.name);

      const paymentRequest: CreatePaymentRequest = {
        orderId,
        orderAmount: totalPrice,
        currency: 0,
        productName: items.length === 1 
          ? items[0].product.name 
          : `Anticca Sipariş (${items.length} ürün)`,
        buyer: {
          id: currentUser.uid,
          name,
          surname,
          email: userData.email,
          phone: formatPhoneNumber(userData.phone || '5551234567'),
          accountAge: 0,
        },
        address: {
          address: userData.address || 'Adres belirtilmemiş',
          city: 'İstanbul',
          country: 'Turkey',
          postcode: '34000',
        },
      };

      clearCart();
      await initiateShopierPayment(paymentRequest);

    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : TR.common.error);
      setPaymentStep('idle');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-linen-100 flex items-center justify-center">
        <div className="text-center py-16 px-4">
          <ShoppingBag className="h-20 w-20 text-espresso-300 mx-auto mb-6" />
          <h1 className="font-serif text-2xl font-bold text-espresso-800 mb-2">
            {TR.cart.empty}
          </h1>
          <p className="text-espresso-600 mb-6">
            Antika koleksiyonumuzu keşfetmeye başlayın.
          </p>
          <Link to="/products">
            <Button size="lg">
              {TR.cart.continueShopping}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linen-100">
      {/* Header */}
      <div className="bg-olive-800 text-linen-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold">{TR.cart.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm border border-cream-200 overflow-hidden">
              {/* Table Header (Desktop) */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-cream-50 border-b border-cream-200 text-sm font-medium text-navy-600">
                <div className="col-span-6">Ürün</div>
                <div className="col-span-2 text-center">{TR.cart.unitPrice}</div>
                <div className="col-span-2 text-center">{TR.cart.quantity}</div>
                <div className="col-span-2 text-right">{TR.cart.itemTotal}</div>
              </div>

              {/* Items */}
              <div className="divide-y divide-cream-200">
                {items.map((item) => (
                  <div key={item.productId} className="p-4 md:p-6">
                    <div className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
                      {/* Product Info */}
                      <div className="md:col-span-6 flex items-start gap-4 mb-4 md:mb-0">
                        <Link to={`/products/${item.productId}`} className="flex-shrink-0">
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-cream-100">
                            {item.product.images?.[0] ? (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl">
                                🏺
                              </div>
                            )}
                          </div>
                        </Link>
                        <div>
                          <Link
                            to={`/products/${item.productId}`}
                            className="font-medium text-navy-800 hover:text-gold-700 line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-navy-500 mt-1">
                            {item.product.category} • {item.product.era}
                          </p>
                        </div>
                      </div>

                      {/* Unit Price */}
                      <div className="md:col-span-2 hidden md:block text-center text-navy-700">
                        {formatPrice(item.product.price)}
                      </div>

                      {/* Quantity */}
                      <div className="md:col-span-2 flex items-center justify-between md:justify-center gap-4 mb-4 md:mb-0">
                        <span className="md:hidden text-sm text-navy-500">{TR.cart.quantity}:</span>
                        <div className="flex items-center border border-cream-200 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-2 hover:bg-cream-100 transition-colors"
                          >
                            <Minus className="h-4 w-4 text-navy-600" />
                          </button>
                          <span className="px-3 py-1 font-medium text-navy-800 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-2 hover:bg-cream-100 transition-colors disabled:opacity-50"
                          >
                            <Plus className="h-4 w-4 text-navy-600" />
                          </button>
                        </div>
                      </div>

                      {/* Total & Remove */}
                      <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-4">
                        <span className="font-bold text-navy-800">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-navy-400 hover:text-red-600 transition-colors p-1"
                          title={TR.cart.remove}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link to="/products">
                <Button variant="ghost">
                  ← {TR.cart.continueShopping}
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-xl shadow-sm border border-cream-200 p-6 sticky top-24">
              <h2 className="font-serif text-xl font-bold text-navy-800 mb-6">
                Sipariş Özeti
              </h2>

              <div className="space-y-3 text-navy-700">
                <div className="flex justify-between">
                  <span>{TR.cart.subtotal}</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-navy-500">
                  <span>Kargo</span>
                  <span>Hesaplanacak</span>
                </div>
              </div>

              <div className="border-t border-cream-200 my-4 pt-4">
                <div className="flex justify-between text-lg font-bold text-navy-900">
                  <span>{TR.cart.total}</span>
                  <span className="text-gold-700">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {paymentStep !== 'idle' && (
                <div className="bg-gold-50 text-gold-800 text-sm p-3 rounded-lg mb-4 flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gold-600 border-t-transparent"></div>
                  {paymentStep === 'creating_order' && 'Sipariş oluşturuluyor...'}
                  {paymentStep === 'redirecting' && 'Ödeme sayfasına yönlendiriliyorsunuz...'}
                </div>
              )}

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                onClick={handleShopierCheckout}
                loading={loading}
                disabled={loading}
              >
                <CreditCard className="h-5 w-5 mr-2" />
                {loading ? 'İşleniyor...' : 'Shopier ile Öde'}
              </Button>

              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-espresso-500">
                <div className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  <span>256-bit SSL</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  <span>3D Secure</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-linen-200">
                <p className="text-xs text-espresso-500 text-center">
                  Ödeme işlemi güvenli Shopier altyapısı ile gerçekleştirilir.
                  Taksit seçenekleri ödeme sayfasında görüntülenir.
                </p>
              </div>

              {!currentUser && (
                <p className="text-sm text-espresso-500 mt-4 text-center">
                  Ödeme yapmak için{' '}
                  <Link to="/login?redirect=/cart" className="text-gold-700 hover:underline">
                    giriş yapmalısınız
                  </Link>
                  .
                </p>
              )}

              <div className="mt-4 pt-4 border-t border-linen-200">
                <p className="text-xs text-espresso-400 text-center mb-2">Kabul Edilen Kartlar</p>
                <div className="flex justify-center gap-2">
                  <div className="bg-linen-100 px-2 py-1 rounded text-xs font-medium text-espresso-600">VISA</div>
                  <div className="bg-linen-100 px-2 py-1 rounded text-xs font-medium text-espresso-600">Mastercard</div>
                  <div className="bg-linen-100 px-2 py-1 rounded text-xs font-medium text-espresso-600">TROY</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
