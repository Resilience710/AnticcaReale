import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { TR } from '../../constants/tr';
import Button from '../ui/Button';

interface ProductCardProps {
  product: Product;
  shopName?: string;
}

export default function ProductCard({ product, shopName }: ProductCardProps) {
  const { addToCart } = useCart();
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart(product, 1);
    }
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-linen-300 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-mist-300"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-linen-200">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
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
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-serif text-lg font-semibold text-espresso-900 line-clamp-1 group-hover:text-gold-800 transition-colors">
          {product.name}
        </h3>
        
        {shopName && (
          <p className="text-sm text-espresso-600 mt-1">{shopName}</p>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-espresso-600 bg-linen-200 px-2 py-1 rounded">
            {product.era}
          </span>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-gold-800">
            {formatPrice(product.price)}
          </span>
          
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
