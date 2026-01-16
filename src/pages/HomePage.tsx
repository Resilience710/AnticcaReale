import { Link } from 'react-router-dom';
import { ArrowRight, Store, Package, Truck } from 'lucide-react';
import { useProducts, useShops } from '../hooks/useFirestore';
import { TR } from '../constants/tr';
import ProductCard from '../components/product/ProductCard';
import ShopCard from '../components/shop/ShopCard';
import Loading from '../components/ui/Loading';
import Button from '../components/ui/Button';

export default function HomePage() {
  const { products, loading: productsLoading } = useProducts({ sortBy: 'newest' }, 8);
  const { shops, loading: shopsLoading } = useShops();

  const featuredShops = shops.slice(0, 4);
  
  // Map shopId to shopName for products
  const shopMap = new Map(shops.map(s => [s.id, s.name]));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-navy-900 text-cream-100 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/95 to-navy-900/80" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-gold-500">{TR.siteName}</span>
              <br />
              <span className="text-cream-100">{TR.tagline}</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-cream-300 leading-relaxed">
              {TR.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg" variant="primary">
                  {TR.nav.products}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/shops">
                <Button size="lg" variant="outline" className="border-cream-300 text-cream-100 hover:bg-cream-100 hover:text-navy-900">
                  {TR.nav.shops}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="h-7 w-7 text-gold-700" />
              </div>
              <h3 className="font-semibold text-navy-800 text-lg">Güvenilir Dükkanlar</h3>
              <p className="mt-2 text-navy-600">İstanbul'un en seçkin antikacıları tek çatı altında</p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-7 w-7 text-gold-700" />
              </div>
              <h3 className="font-semibold text-navy-800 text-lg">Özenli Paketleme</h3>
              <p className="mt-2 text-navy-600">Tüm ürünler sigortalı ve özenle paketlenerek gönderilir</p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-7 w-7 text-gold-700" />
              </div>
              <h3 className="font-semibold text-navy-800 text-lg">Güvenli Teslimat</h3>
              <p className="mt-2 text-navy-600">Türkiye'nin her yerine güvenli kargo seçenekleri</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-3xl font-bold text-navy-800">
                {TR.products.featured}
              </h2>
              <p className="mt-2 text-navy-600">En son eklenen nadide parçalar</p>
            </div>
            <Link to="/products">
              <Button variant="ghost">
                Tümünü Gör
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {productsLoading ? (
            <Loading />
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-cream-100 rounded-xl">
              <p className="text-navy-600">{TR.products.noProducts}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </section>

      {/* Featured Shops */}
      <section className="py-16 lg:py-24 bg-navy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-3xl font-bold text-navy-800">
                {TR.shops.featured}
              </h2>
              <p className="mt-2 text-navy-600">İstanbul'un köklü antika dükkanları</p>
            </div>
            <Link to="/shops">
              <Button variant="ghost">
                Tümünü Gör
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {shopsLoading ? (
            <Loading />
          ) : featuredShops.length === 0 ? (
            <div className="text-center py-12 bg-cream-100 rounded-xl">
              <p className="text-navy-600">{TR.shops.noShops}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredShops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-navy-800 to-navy-900 text-cream-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Tarihi Eserinizi Bulun
          </h2>
          <p className="text-lg text-cream-300 mb-8 max-w-2xl mx-auto">
            Osmanlı'dan Cumhuriyet dönemine, Art Deco'dan Barok'a kadar geniş bir koleksiyon sizi bekliyor.
          </p>
          <Link to="/products">
            <Button size="lg" variant="primary">
              Koleksiyonu Keşfedin
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
