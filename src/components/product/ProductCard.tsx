import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { TR } from '../../constants/tr';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  shopName?: string;
}

export default function ProductCard({ product, shopName }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0 && !added) {
      addToCart(product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-linen-200 rounded-lg sm:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-mist-300 flex flex-col"
    >
      {/* Image - Fixed aspect ratio for CLS prevention */}
      <div className="relative aspect-square overflow-hidden bg-linen-300">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-mist-400">
            <span className="text-4xl sm:text-6xl">🏺</span>
          </div>
        )}
        
        {/* Stock badge */}
        {product.stock <= 0 && (
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-600 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-medium">
            {TR.products.outOfStock}
          </div>
        )}
        
        {/* Category badge - hidden on very small screens */}
        <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-olive-800/90 text-linen-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-medium">
          {product.category}
        </div>

        {/* Mobile: Quick add overlay */}
        {product.stock > 0 && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 md:opacity-0 md:group-hover:opacity-100 
                       bg-gold-500 hover:bg-gold-400 text-espresso-900 
                       p-1.5 sm:p-2.5 rounded-full shadow-lg transition-all duration-200 
                       min-h-[36px] min-w-[36px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center
                       active:scale-95"
            aria-label="Sepete ekle"
          >
            {added ? (
              <Check className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
        )}
      </div>

      {/* Content - Compact on mobile */}
      <div className="p-2 sm:p-3 lg:p-4 flex-1 flex flex-col">
        <h3 className="font-serif text-sm sm:text-base lg:text-lg font-semibold text-espresso-900 line-clamp-2 group-hover:text-gold-700 transition-colors leading-tight">
          {product.name}
        </h3>
        
        {/* Shop name - hidden on mobile for space */}
        {shopName && (
          <p className="hidden sm:block text-xs sm:text-sm text-espresso-600 mt-1 truncate">{shopName}</p>
        )}
        
        {/* Era badge - smaller on mobile */}
        <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
          <span className="text-[10px] sm:text-xs text-espresso-600 bg-linen-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded truncate max-w-full">
            {product.era}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-auto pt-2 sm:pt-3">
          <span className="text-sm sm:text-lg lg:text-xl font-bold text-gold-700">
            {formatPrice(product.price)}
          </span>
          
          {/* Desktop: Text button */}
          <span className="hidden lg:inline-flex text-sm text-espresso-600 group-hover:text-gold-700 transition-colors">
            Detaylar →
          </span>
        </div>
      </div>
    </Link>
  );
}
