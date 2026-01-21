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
      className="group bg-linen-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-mist-300 flex flex-col"
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
            <span className="text-6xl">🏺</span>
          </div>
        )}
        
        {/* Stock badge */}
        {product.stock <= 0 && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
            {TR.products.outOfStock}
          </div>
        )}
        
        {/* Category badge */}
        <div className="absolute top-2 left-2 bg-olive-800/90 text-linen-100 px-2 py-1 rounded text-xs font-medium">
          {product.category}
        </div>

        {/* Mobile: Quick add overlay (always visible on touch) */}
        {product.stock > 0 && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 md:opacity-0 md:group-hover:opacity-100 
                       bg-gold-500 hover:bg-gold-400 text-espresso-900 
                       p-2.5 rounded-full shadow-lg transition-all duration-200 
                       min-h-[44px] min-w-[44px] flex items-center justify-center
                       active:scale-95"
            aria-label="Sepete ekle"
          >
            {added ? (
              <Check className="h-5 w-5" />
            ) : (
              <ShoppingCart className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-serif text-base sm:text-lg font-semibold text-espresso-900 line-clamp-2 group-hover:text-gold-700 transition-colors">
          {product.name}
        </h3>
        
        {shopName && (
          <p className="text-sm text-espresso-600 mt-1 truncate">{shopName}</p>
        )}
        
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-espresso-600 bg-linen-300 px-2 py-1 rounded">
            {product.era}
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3">
          <span className="text-lg sm:text-xl font-bold text-gold-700">
            {formatPrice(product.price)}
          </span>
          
          {/* Desktop: Text button */}
          <span className="hidden sm:inline-flex text-sm text-espresso-600 group-hover:text-gold-700 transition-colors">
            Detaylar →
          </span>
        </div>
      </div>
    </Link>
  );
}
