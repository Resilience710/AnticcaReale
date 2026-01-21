import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, Settings, Package, BookOpen, Info } from 'lucide-react';
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
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-olive-800 text-linen-100 sticky top-0 z-50 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-serif text-2xl font-bold text-gold-500">
              {TR.siteName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-linen-200 hover:text-gold-500 transition-colors"
            >
              {TR.nav.home}
            </Link>
            <Link
              to="/products"
              className="text-linen-200 hover:text-gold-500 transition-colors"
            >
              {TR.nav.products}
            </Link>
            <Link
              to="/shops"
              className="text-linen-200 hover:text-gold-500 transition-colors"
            >
              {TR.nav.shops}
            </Link>
            <Link
              to="/blog"
              className="text-linen-200 hover:text-gold-500 transition-colors"
            >
              Blog
            </Link>
            <Link
              to="/about"
              className="text-linen-200 hover:text-gold-500 transition-colors"
            >
              Hakkımızda
            </Link>
          </div>

          {/* Right side - Cart & User */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative text-linen-200 hover:text-gold-500 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-500 text-espresso-950 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-linen-200 hover:text-gold-500 transition-colors"
                >
                  <User className="h-6 w-6" />
                  <span className="hidden md:inline">{userData?.name || 'Kullanıcı'}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-linen-300 rounded-lg shadow-lg py-2 z-50 border border-mist-300">
                    <Link
                      to="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-espresso-900 hover:bg-linen-400"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      {TR.nav.orders}
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-espresso-900 hover:bg-linen-400"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        {TR.nav.adminPanel}
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center w-full px-4 py-2 text-espresso-900 hover:bg-linen-400"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {TR.nav.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-linen-200 hover:text-gold-500 transition-colors"
                >
                  {TR.nav.login}
                </Link>
                <Link
                  to="/register"
                  className="bg-gold-500 text-espresso-950 px-4 py-2 rounded-lg hover:bg-gold-800 hover:text-linen-100 transition-colors font-medium"
                >
                  {TR.nav.register}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-linen-200"
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
          <div className="md:hidden py-4 border-t border-olive-700">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-linen-200 hover:text-gold-500 transition-colors"
              >
                {TR.nav.home}
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="text-linen-200 hover:text-gold-500 transition-colors"
              >
                {TR.nav.products}
              </Link>
              <Link
                to="/shops"
                onClick={() => setMobileMenuOpen(false)}
                className="text-linen-200 hover:text-gold-500 transition-colors"
              >
                {TR.nav.shops}
              </Link>
              <Link
                to="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="text-linen-200 hover:text-gold-500 transition-colors flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Blog
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-linen-200 hover:text-gold-500 transition-colors flex items-center gap-2"
              >
                <Info className="h-4 w-4" />
                Hakkımızda
              </Link>
              {!currentUser && (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-linen-200 hover:text-gold-500 transition-colors"
                  >
                    {TR.nav.login}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-gold-500 text-espresso-950 px-4 py-2 rounded-lg hover:bg-gold-800 hover:text-linen-100 transition-colors font-medium text-center"
                  >
                    {TR.nav.register}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
