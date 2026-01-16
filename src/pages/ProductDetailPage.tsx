import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Store, ChevronLeft, ChevronRight, Minus, Plus, Check } from 'lucide-react';
import { useDocument, useProducts } from '../hooks/useFirestore';
import { Product, Shop } from '../types';
import { useCart } from '../contexts/CartContext';
import { TR } from '../constants/tr';
import ProductCard from '../components/product/ProductCard';
import Loading from '../components/ui/Loading';
import Button from '../components/ui/Button';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const { data: product, loading: productLoading } = useDocument<Product>('products', id);
  const { data: shop } = useDocument<Shop>('shops', product?.shopId);
  const { products: relatedProducts } = useProducts(
    product ? { shopId: product.shopId, sortBy: 'newest' } : { sortBy: 'newest' },
    4
  );
  const { addToCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price);
  };

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addToCart(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handlePrevImage = () => {
    if (product?.images) {
      setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    }
  };

  const handleNextImage = () => {
    if (product?.images) {
      setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    }
  };

  if (productLoading) {
    return <Loading fullScreen />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy-800">{TR.errors.notFound}</h1>
          <Link to="/products" className="mt-4 inline-block">
            <Button>{TR.cart.continueShopping}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const filteredRelated = relatedProducts.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-navy-500 hover:text-navy-700">
              {TR.nav.home}
            </Link>
            <span className="text-navy-300">/</span>
            <Link to="/products" className="text-navy-500 hover:text-navy-700">
              {TR.nav.products}
            </Link>
            <span className="text-navy-300">/</span>
            <span className="text-navy-800 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-xl overflow-hidden border border-cream-200">
              {product.images && product.images.length > 0 ? (
                <>
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                      >
                        <ChevronLeft className="h-6 w-6 text-navy-800" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                      >
                        <ChevronRight className="h-6 w-6 text-navy-800" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-cream-400">
                  <span className="text-9xl">🏺</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-gold-500'
                        : 'border-cream-200 hover:border-gold-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-navy-100 text-navy-700 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
                <span className="bg-cream-200 text-navy-600 px-3 py-1 rounded-full text-sm">
                  {product.era}
                </span>
              </div>
              <h1 className="font-serif text-3xl lg:text-4xl font-bold text-navy-900">
                {product.name}
              </h1>
            </div>

            <div className="text-3xl font-bold text-gold-700">
              {formatPrice(product.price)}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-green-700 font-medium">
                    {TR.products.inStock} ({product.stock} adet)
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <span className="text-red-700 font-medium">{TR.products.outOfStock}</span>
                </>
              )}
            </div>

            {/* Shop Info */}
            {shop && (
              <Link
                to={`/shops/${shop.id}`}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-cream-200 hover:border-gold-300 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-navy-100 flex items-center justify-center">
                  {shop.logoUrl ? (
                    <img
                      src={shop.logoUrl}
                      alt={shop.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Store className="h-6 w-6 text-navy-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-navy-800">{shop.name}</p>
                  <p className="text-sm text-navy-500">
                    {shop.district}, {shop.city}
                  </p>
                </div>
              </Link>
            )}

            {/* Quantity & Add to Cart */}
            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-navy-700 font-medium">{TR.cart.quantity}:</span>
                  <div className="flex items-center border border-cream-200 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-cream-100 transition-colors"
                    >
                      <Minus className="h-5 w-5 text-navy-600" />
                    </button>
                    <span className="px-4 py-2 font-medium text-navy-800 min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-2 hover:bg-cream-100 transition-colors"
                    >
                      <Plus className="h-5 w-5 text-navy-600" />
                    </button>
                  </div>
                </div>

                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={addedToCart}
                  className="w-full"
                >
                  {addedToCart ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Sepete Eklendi
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      {TR.products.addToCart}
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Description */}
            <div className="pt-6 border-t border-cream-200">
              <h2 className="font-semibold text-navy-800 mb-3">Ürün Açıklaması</h2>
              <p className="text-navy-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {filteredRelated.length > 0 && (
          <div className="mt-16 pt-12 border-t border-cream-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl font-bold text-navy-800">
                {TR.products.viewShopProducts}
              </h2>
              {shop && (
                <Link to={`/shops/${shop.id}`}>
                  <Button variant="ghost">
                    Tümünü Gör
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredRelated.map((p) => (
                <ProductCard key={p.id} product={p} shopName={shop?.name} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
