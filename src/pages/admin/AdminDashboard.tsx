import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, Package, ShoppingCart, TrendingUp, ArrowRight } from 'lucide-react';
import { collection, query, getDocs, orderBy, limit, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { TR } from '../../constants/tr';
import Loading from '../../components/ui/Loading';

interface DashboardStats {
  totalShops: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
}

interface RecentOrder {
  id: string;
  userName: string;
  totalPrice: number;
  status: string;
  createdAt: any;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalShops: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Get shops count
        const shopsSnap = await getDocs(collection(db, 'shops'));
        const totalShops = shopsSnap.size;

        // Get products count
        const productsSnap = await getDocs(collection(db, 'products'));
        const totalProducts = productsSnap.size;

        // Get orders count
        const ordersSnap = await getDocs(collection(db, 'orders'));
        const totalOrders = ordersSnap.size;

        // Get pending orders count
        const pendingQuery = query(
          collection(db, 'orders'),
          where('status', 'in', ['Ödeme Bekleniyor', 'Ödendi', 'Hazırlanıyor'])
        );
        const pendingSnap = await getDocs(pendingQuery);
        const pendingOrders = pendingSnap.size;

        setStats({ totalShops, totalProducts, totalOrders, pendingOrders });

        // Get recent orders
        const recentQuery = query(
          collection(db, 'orders'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const recentSnap = await getDocs(recentQuery);
        const orders = recentSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as RecentOrder[];
        setRecentOrders(orders);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price);
  };

  const formatDate = (date: any) => {
    if (!date) return '-';
    const d = date.toDate ? date.toDate() : new Date(date);
    return new Intl.DateTimeFormat('tr-TR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(d);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-navy-800 mb-8">
        {TR.admin.dashboard}
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-cream-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Store className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-navy-500">{TR.admin.totalShops}</p>
              <p className="text-2xl font-bold text-navy-800">{stats.totalShops}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-cream-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-navy-500">{TR.admin.totalProducts}</p>
              <p className="text-2xl font-bold text-navy-800">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-cream-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-navy-500">{TR.admin.totalOrders}</p>
              <p className="text-2xl font-bold text-navy-800">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-cream-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-navy-500">Bekleyen Siparişler</p>
              <p className="text-2xl font-bold text-navy-800">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-cream-200">
        <div className="p-6 border-b border-cream-200 flex items-center justify-between">
          <h2 className="font-semibold text-navy-800">{TR.admin.recentOrders}</h2>
          <Link
            to="/admin/orders"
            className="text-gold-700 hover:text-gold-600 text-sm font-medium flex items-center gap-1"
          >
            Tümünü Gör
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-6 text-center text-navy-500">
            Henüz sipariş bulunmuyor.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">
                    Sipariş No
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">
                    Müşteri
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">
                    Tutar
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">
                    Tarih
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-cream-50">
                    <td className="px-6 py-4 text-sm font-mono text-navy-700">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm text-navy-700">
                      {order.userName}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-navy-800">
                      {formatPrice(order.totalPrice)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-navy-500">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
