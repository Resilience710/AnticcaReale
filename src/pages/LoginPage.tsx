import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { TR } from '../constants/tr';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(redirect);
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError(TR.auth.loginError);
      } else if (err.code === 'auth/user-not-found') {
        setError('Bu e-posta adresiyle kayıtlı bir hesap bulunamadı.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin.');
      } else {
        setError(TR.auth.loginError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="font-serif text-4xl font-bold text-gold-600">
              {TR.siteName}
            </span>
          </Link>
          <h1 className="mt-4 text-2xl font-semibold text-navy-800">
            {TR.auth.login}
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-cream-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">
                {TR.auth.email}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-navy-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 bg-white"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">
                {TR.auth.password}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-navy-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 bg-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              {TR.auth.login}
            </Button>
          </form>

          {/* Register Link */}
          <p className="mt-6 text-center text-navy-600">
            {TR.auth.noAccount}{' '}
            <Link
              to={`/register${redirect !== '/' ? `?redirect=${redirect}` : ''}`}
              className="text-gold-700 hover:text-gold-600 font-medium"
            >
              {TR.auth.register}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
