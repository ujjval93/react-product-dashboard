import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AuthPage = ({ mode, role = 'user', onSubmit, title, subtitle, alternateText, alternateLink, alternateLabel }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

const handleSubmit = async (event) => {
  event.preventDefault();
  setLoading(true);
  setError('');

  try {
    await onSubmit({ ...formData, role });
    // Small delay to let auth:login event propagate and currentUser update
    await new Promise((resolve) => setTimeout(resolve, 100));
    navigate('/');
  } catch (err) {
    setError(err.message || 'Something went wrong');
  } finally {
    setLoading(false);
  }
};

  const isLogin = mode === 'login';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-10 py-20">
        <button
          onClick={() => navigate('/')}
          className="mb-10 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900 dark:text-slate-400"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <ArrowLeft size={16} />
          Back to home
        </button>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-sm border border-slate-200 bg-white p-10 dark:border-neutral-800 dark:bg-neutral-950">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.24em] text-amber-700">{role === 'seller' ? 'Seller portal' : 'Customer portal'}</p>
              <h1 className="mt-3 text-3xl font-light tracking-tight text-slate-900 dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{title}</h1>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 mb-2">Full name</label>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-amber-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 mb-2">{isLogin ? 'Email or username' : 'Username'}</label>
                <input
                  name={isLogin ? 'username' : 'username'}
                  value={formData.username}
                  onChange={handleChange}
                  placeholder={isLogin ? 'Email or username' : 'Username'}
                  className="w-full rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-amber-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 mb-2">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@example.com"
                    className="w-full rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-amber-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 mb-2">Password</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-amber-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                />
              </div>

              {error && <p className="text-sm text-rose-500">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-sm bg-amber-700 py-3 text-sm font-medium uppercase tracking-[0.14em] text-white transition-opacity disabled:opacity-60"
              >
                {loading ? 'Working…' : isLogin ? 'Sign in' : 'Create account'}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
              {alternateText}{' '}
              <Link to={alternateLink} className="font-semibold text-amber-700 hover:text-amber-900">
                {alternateLabel}
              </Link>
            </p>
          </div>

          <div className="rounded-sm border border-slate-200 bg-slate-50 p-10 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-800 dark:text-slate-300">Why {role === 'seller' ? 'sell with Prestige' : 'join Prestige'}</p>
            <h2 className="mt-4 text-2xl font-light text-slate-900 dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {role === 'seller' ? 'Create listings and manage your products' : 'Shop premium, discover unique products'}
            </h2>
            <ul className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <li>• Secure authentication with cookies and JWT.</li>
              <li>• Persistent account state after refresh.</li>
              <li>• Full product, cart, wishlist, and order support.</li>
              {role === 'seller' && <li>• Seller-only dashboard, create, edit and delete products.</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
