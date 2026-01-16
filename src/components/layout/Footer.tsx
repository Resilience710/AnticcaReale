import { Link } from 'react-router-dom';
import { TR } from '../../constants/tr';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="font-serif text-2xl font-bold text-gold-500">
              {TR.siteName}
            </Link>
            <p className="mt-4 text-cream-300 max-w-md">
              {TR.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-cream-100 mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products"
                  className="text-cream-300 hover:text-gold-500 transition-colors"
                >
                  {TR.nav.products}
                </Link>
              </li>
              <li>
                <Link
                  to="/shops"
                  className="text-cream-300 hover:text-gold-500 transition-colors"
                >
                  {TR.nav.shops}
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-cream-300 hover:text-gold-500 transition-colors"
                >
                  {TR.nav.cart}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-cream-100 mb-4">Bilgi</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-cream-300 hover:text-gold-500 transition-colors">
                  {TR.footer.about}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-cream-300 hover:text-gold-500 transition-colors">
                  {TR.footer.contact}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-cream-300 hover:text-gold-500 transition-colors">
                  {TR.footer.terms}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-cream-300 hover:text-gold-500 transition-colors">
                  {TR.footer.privacy}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-700 text-center text-cream-400">
          <p>
            &copy; {new Date().getFullYear()} {TR.siteName}. {TR.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
