import { Link } from 'react-router-dom';
import { TR } from '../../constants/tr';

export default function Footer() {
  return (
    <footer className="bg-olive-800 text-linen-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="font-serif text-2xl font-bold text-gold-500">
              {TR.siteName}
            </Link>
            <p className="mt-4 text-linen-100/90 max-w-md">
              {TR.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gold-400 mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products"
                  className="text-linen-100/80 hover:text-gold-400 transition-colors"
                >
                  {TR.nav.products}
                </Link>
              </li>
              <li>
                <Link
                  to="/shops"
                  className="text-linen-100/80 hover:text-gold-400 transition-colors"
                >
                  {TR.nav.shops}
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-linen-100/80 hover:text-gold-400 transition-colors"
                >
                  {TR.nav.cart}
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-linen-100/80 hover:text-gold-400 transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gold-400 mb-4">Bilgi</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-linen-100/80 hover:text-gold-400 transition-colors">
                  {TR.footer.about}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-linen-100/80 hover:text-gold-400 transition-colors">
                  {TR.footer.contact}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-linen-100/80 hover:text-gold-400 transition-colors">
                  {TR.footer.terms}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-linen-100/80 hover:text-gold-400 transition-colors">
                  {TR.footer.privacy}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-olive-600 text-center text-linen-100/70">
          <p>
            &copy; {new Date().getFullYear()} {TR.siteName}. {TR.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
