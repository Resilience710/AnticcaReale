import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, SlidersHorizontal } from 'lucide-react';
import { useDocument, useProducts } from '../hooks/useFirestore';
import { Shop, FilterState } from '../types';
import { TR } from '../constants/tr';
import ProductCard from '../components/product/ProductCard';
import ProductFilters from '../components/product/ProductFilters';
import Loading from '../components/ui/Loading';
import Button from '../components/ui/Button';

export default function ShopDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [filters, setFilters] = useState<FilterState>({ 
    sortBy: 'newest',
    shopId: id 
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const { data: shop, loading: shopLoading } = useDocument<Shop>('shops', id);
  const { products, loading: productsLoading } = useProducts(filters);

  if (shopLoading) {
    return <Loading fullScreen />;
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy-800">{TR.errors.notFound}</h1>
          <Link to="/shops" className="mt-4 inline-block">
            <Button>{TR.common.back}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Shop Header */}
      <div className="bg-navy-900 text-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Logo */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
              {shop.logoUrl ? (
                <img
                  src={shop.logoUrl}
                  alt={shop.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-5xl">🏛️</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="font-serif text-3xl md:text-4xl font-bold">{shop.name}</h1>
              <p className="mt-2 text-cream-300 max-w-2xl">{shop.description}</p>
              
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-cream-300">
                  <MapPin className="h-4 w-4 text-gold-500" />
                  <span>{shop.address}, {shop.district}, {shop.city}</span>
                </div>
                {shop.phone && (
                  <div className="flex items-center gap-2 text-cream-300">
                    <Phone className="h-4 w-4 text-gold-500" />
                    <span>{shop.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-bold text-navy-800">
            {TR.shops.allProducts}
          </h2>
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMobileFilters(true)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              {TR.filters.title}
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters (without shop filter) */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <ProductFilters
                filters={filters}
                onFilterChange={(newFilters) => setFilters({ ...newFilters, shopId: id })}
                shops={[]} // Empty to hide shop filter
              />
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            <p className="text-navy-600 mb-6">
              {productsLoading ? TR.common.loading : `${products.length} ürün bulundu`}
            </p>

            {productsLoading ? (
              <Loading />
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-cream-200">
                <p className="text-navy-600 text-lg">{TR.products.noProducts}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} shopName={shop.name} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      {showMobileFilters && (
        <ProductFilters
          filters={filters}
          onFilterChange={(newFilters) => setFilters({ ...newFilters, shopId: id })}
          shops={[]}
          showMobile
          onCloseMobile={() => setShowMobileFilters(false)}
        />
      )}
    </div>
  );
}
