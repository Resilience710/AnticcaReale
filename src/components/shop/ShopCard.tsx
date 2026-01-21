import { Link } from 'react-router-dom';
import { MapPin, Phone, ArrowRight } from 'lucide-react';
import { Shop } from '../../types';
import { TR } from '../../constants/tr';

interface ShopCardProps {
  shop: Shop;
}

export default function ShopCard({ shop }: ShopCardProps) {
  return (
    <Link
      to={`/shops/${shop.id}`}
      className="group bg-linen-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-mist-300 flex flex-col min-h-[280px]"
    >
      {/* Logo / Header - Fixed aspect ratio */}
      <div className="relative aspect-[16/10] bg-gradient-to-br from-olive-700 to-olive-800 overflow-hidden">
        {shop.logoUrl ? (
          <img
            src={shop.logoUrl}
            alt={shop.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-50">🏛️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-olive-800/80 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-white line-clamp-1 drop-shadow-lg">
            {shop.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-espresso-700 text-sm line-clamp-2 mb-3">
          {shop.description}
        </p>

        <div className="space-y-2 text-sm text-espresso-600">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-gold-600" />
            <span className="line-clamp-1">
              {shop.district}, {shop.city}
            </span>
          </div>
          {shop.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 flex-shrink-0 text-gold-600" />
              <span>{shop.phone}</span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-mist-300">
          <span className="inline-flex items-center text-sm font-medium text-gold-700 group-hover:text-gold-600 transition-colors min-h-[44px] py-2">
            {TR.shops.viewProducts}
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
