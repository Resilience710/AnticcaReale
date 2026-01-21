import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, Settings, Package, BookOpen, Info, Home, Store, Grid3X3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { TR } from '../../constants/tr';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { currentUser, userData, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close menus when clicking outside
  const closeMenus = () => {
    setUserMenuOpen(false);
  };

  return (
    <header className="bg-olive-800 text-linen-100 sticky top-0 z-50 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 min-h-[44px] min-w-[44px]">
            <span className="font-serif text-xl sm:text-2xl font-bold text-gold-500">
              {TR.siteName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link
              to="/"
              className="text-linen-100 hover:text-gold-500 transition-colors py-2"
            >
              {TR.nav.home}
            </Link>
            <Link
              to="/products"
              className="text-linen-100 hover:text-gold-500 transition-colors py-2"
            >
              {TR.nav.products}
            </Link>
            <Link
              to="/shops"
              className="text-linen-100 hover:text-gold-500 transition-colors py-2"
            >
              {TR.nav.shops}
            </Link>
            <Link
              to="/blog"
              className="text-linen-100 hover:text-gold-500 transition-colors py-2"
            >
              Blog
            </Link>
            <Link
              to="/about"
              className="text-linen-100 hover:text-gold-500 transition-colors py-2"
            >
              Hakkımızda
            </Link>
          </div>

          {/* Right side - Cart & User */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Cart - Always visible */}
            <Link
              to="/cart"
              className="relative text-linen-100 hover:text-gold-500 transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={`Sepet (${totalItems} ürün)`}
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-espresso-950 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* User Menu - Desktop */}
            {currentUser ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-linen-100 hover:text-gold-500 transition-colors p-2 min-h-[44px]"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <User className="h-6 w-6" />
                  <span className="hidden lg:inline max-w-[100px] truncate">{userData?.name || 'Kullanıcı'}</span>
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={closeMenus} />
                    <div className="absolute right-0 mt-2 w-56 bg-linen-100 rounded-xl shadow-xl py-2 z-50 border border-mist-300">
                      <div className="px-4 py-2 border-b border-mist-300">
                        <p className="font-medium text-espresso-900 truncate">{userData?.name}</p>
                        <p className="text-sm text-espresso-600 truncate">{userData?.email}</p>
                      </div>
                      <Link
                        to="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center px-4 py-3 text-espresso-800 hover:bg-linen-200 transition-colors"
                      >
                        <Package className="h-5 w-5 mr-3 text-espresso-600" />
                        {TR.nav.orders}
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center px-4 py-3 text-espresso-800 hover:bg-linen-200 transition-colors"
                        >
                          <Settings className="h-5 w-5 mr-3 text-espresso-600" />
                          {TR.nav.adminPanel}
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center w-full px-4 py-3 text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        {TR.nav.logout}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-linen-100 hover:text-gold-500 transition-colors py-2 px-3"
                >
                  {TR.nav.login}
                </Link>
                <Link
                  to="/register"
                  className="bg-gold-500 text-espresso-950 px-4 py-2 rounded-lg hover:bg-gold-400 transition-colors font-medium"
                >
                  {TR.nav.register}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-linen-100 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={mobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-olive-600 animate-in slide-in-from-top duration-200">
            {/* User info (if logged in) */}
            {currentUser && (
              <div className="px-2 py-3 mb-3 bg-olive-700/50 rounded-lg">
                <p className="font-medium text-linen-100">{userData?.name || 'Kullanıcı'}</p>
                <p className="text-sm text-linen-100/70 truncate">{userData?.email}</p>
              </div>
            )}

            {/* Navigation Links */}
            <div className="space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-linen-100 hover:bg-olive-700 rounded-lg transition-colors min-h-[48px]"
              >
                <Home className="h-5 w-5 text-gold-500" />
                {TR.nav.home}
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-linen-100 hover:bg-olive-700 rounded-lg transition-colors min-h-[48px]"
              >
                <Grid3X3 className="h-5 w-5 text-gold-500" />
                {TR.nav.products}
              </Link>
              <Link
                to="/shops"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-linen-100 hover:bg-olive-700 rounded-lg transition-colors min-h-[48px]"
              >
                <Store className="h-5 w-5 text-gold-500" />
                {TR.nav.shops}
              </Link>
              <Link
                to="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-linen-100 hover:bg-olive-700 rounded-lg transition-colors min-h-[48px]"
              >
                <BookOpen className="h-5 w-5 text-gold-500" />
                Blog
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-linen-100 hover:bg-olive-700 rounded-lg transition-colors min-h-[48px]"
              >
                <Info className="h-5 w-5 text-gold-500" />
                Hakkımızda
              </Link>
            </div>

            {/* User Actions */}
            {currentUser ? (
              <div className="mt-4 pt-4 border-t border-olive-600 space-y-1">
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 text-linen-100 hover:bg-olive-700 rounded-lg transition-colors min-h-[48px]"
                >
                  <Package className="h-5 w-5 text-gold-500" />
                  {TR.nav.orders}
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 text-linen-100 hover:bg-olive-700 rounded-lg transition-colors min-h-[48px]"
                  >
                    <Settings className="h-5 w-5 text-gold-500" />
                    {TR.nav.adminPanel}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors min-h-[48px]"
                >
                  <LogOut className="h-5 w-5" />
                  {TR.nav.logout}
                </button>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-olive-600 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-3 text-linen-100 border border-linen-100/30 rounded-lg hover:bg-olive-700 transition-colors min-h-[48px]"
                >
                  {TR.nav.login}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-gold-500 text-espresso-950 px-4 py-3 rounded-lg hover:bg-gold-400 transition-colors font-medium min-h-[48px]"
                >
                  {TR.nav.register}
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
