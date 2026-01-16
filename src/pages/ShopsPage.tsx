import { useShops } from '../hooks/useFirestore';
import { TR } from '../constants/tr';
import ShopCard from '../components/shop/ShopCard';
import Loading from '../components/ui/Loading';

export default function ShopsPage() {
  const { shops, loading } = useShops();

  return (
    <div className="min-h-screen bg-linen-300">
      {/* Header */}
      <div className="bg-olive-800 text-linen-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold">{TR.shops.title}</h1>
          <p className="mt-2 text-linen-300">İstanbul'un en seçkin antika dükkanları</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {loading ? (
          <Loading />
        ) : shops.length === 0 ? (
          <div className="text-center py-16 bg-linen-200 rounded-xl border border-mist-300">
            <p className="text-espresso-700 text-lg">{TR.shops.noShops}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
