import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Store, Package, ShoppingCart, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { TR } from '../../constants/tr';
import Loading from '../../components/ui/Loading';

const navItems = [
  { path: '/admin', label: TR.admin.dashboard, icon: LayoutDashboard, exact: true },
  { path: '/admin/shops', label: TR.admin.shops, icon: Store },
  { path: '/admin/products', label: TR.admin.products, icon: Package },
  { path: '/admin/orders', label: TR.admin.orders, icon: ShoppingCart },
];

export default function AdminLayout() {
  const { currentUser, userData, loading, logout, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!currentUser || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-navy-900 text-cream-100 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-navy-700">
          <Link to="/" className="font-serif text-2xl font-bold text-gold-500">
            {TR.siteName}
          </Link>
          <p className="text-sm text-cream-400 mt-1">{TR.admin.title}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gold-600 text-navy-900'
                    : 'text-cream-300 hover:bg-navy-800'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-navy-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gold-600 flex items-center justify-center text-navy-900 font-bold">
              {userData?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="font-medium text-cream-100">{userData?.name}</p>
              <p className="text-xs text-cream-400">Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-cream-300 hover:text-cream-100 transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            {TR.nav.logout}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-navy-900 text-cream-100 z-40">
        <div className="flex items-center justify-between p-4">
          <Link to="/admin" className="font-serif text-xl font-bold text-gold-500">
            {TR.siteName} Admin
          </Link>
        </div>
        <nav className="flex overflow-x-auto border-t border-navy-700 px-2">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'border-gold-500 text-gold-500'
                    : 'border-transparent text-cream-300'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:p-8 p-4 pt-28 md:pt-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
