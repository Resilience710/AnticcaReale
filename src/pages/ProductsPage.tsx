import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useProducts, useShops } from '../hooks/useFirestore';
import { FilterState } from '../types';
import { TR } from '../constants/tr';
import ProductCard from '../components/product/ProductCard';
import ProductFilters from '../components/product/ProductFilters';
import Loading from '../components/ui/Loading';
import Button from '../components/ui/Button';

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterState>({ sortBy: 'newest' });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const { products, loading } = useProducts(filters);
  const { shops } = useShops();
  
  // Map shopId to shopName
  const shopMap = new Map(shops.map(s => [s.id, s.name]));

  return (
    <div className="min-h-screen bg-linen-300">
      {/* Header */}
      <div className="bg-olive-800 text-linen-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold">{TR.products.title}</h1>
          <p className="mt-2 text-linen-300">Tüm antika ürünlerimizi keşfedin</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <ProductFilters
                filters={filters}
                onFilterChange={setFilters}
                shops={shops}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                onClick={() => setShowMobileFilters(true)}
                className="w-full"
              >
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                {TR.filters.title}
              </Button>
            </div>

            {/* Results count */}
            <div className="mb-6">
              <p className="text-espresso-700">
                {loading ? TR.common.loading : `${products.length} ürün bulundu`}
              </p>
            </div>

            {/* Products Grid */}
            {loading ? (
              <Loading />
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-linen-200 rounded-xl border border-mist-300">
                <p className="text-espresso-800 text-lg">{TR.products.noProducts}</p>
                <p className="text-espresso-600 mt-2">Farklı filtreler deneyebilirsiniz.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    shopName={shopMap.get(product.shopId)}
                  />
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
          onFilterChange={setFilters}
          shops={shops}
          showMobile
          onCloseMobile={() => setShowMobileFilters(false)}
        />
      )}
    </div>
  );
}
