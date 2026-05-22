import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ShoppingCart, Heart, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';
import { ProductContext } from '../utils/Context';

const navItems = [
  { label: 'Products', to: '/' },
  { label: 'Create', to: '/create' },
  { label: 'Contact', to: '#contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode, toggleTheme } = useDarkMode();
  const { totalCartItems, totalWishlistItems } = useContext(ProductContext);
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } }}
      className={`sticky top-0 z-50 border-b backdrop-blur-2xl transition-colors duration-300 ${
        darkMode
          ? 'bg-slate-950/90 border-slate-800/70'
          : 'bg-white/90 border-slate-200'
      } shadow-sm`}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

        {/* Logo + nav links */}
        <div className="flex min-w-0 items-center gap-6">
          <NavLink to="/" className={`flex items-center gap-3 text-lg font-semibold tracking-tight transition ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/20">
              <span className="text-lg font-black text-white">P</span>
            </div>
            <span className="text-xl font-bold">Prestige</span>
          </NavLink>

          <div className="hidden xl:flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : darkMode
                      ? 'text-slate-300 hover:text-indigo-400'
                      : 'text-slate-700 hover:text-indigo-600'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Search hint (desktop) */}
        <div className="hidden lg:flex flex-1 items-center justify-center px-4">
          <div className={`flex w-full max-w-xl items-center gap-3 rounded-full border px-4 py-2 shadow-sm transition-colors duration-300 ${
            darkMode ? 'border-slate-800 bg-slate-950/80 text-white' : 'border-slate-200 bg-white text-slate-700'
          }`}>
            <span className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Search premium products on the homepage
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`rounded-full p-2 border transition-colors duration-200 ${
              darkMode
                ? 'border-slate-800 bg-slate-950 text-amber-300 hover:bg-slate-900'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          {/* Wishlist */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/wishlist')}
            className={`relative rounded-full p-2 border transition-colors duration-200 ${
              darkMode
                ? 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900 hover:text-rose-400'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-500'
            }`}
          >
            <Heart size={20} />
            {totalWishlistItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm">
                {totalWishlistItems}
              </span>
            )}
          </motion.button>

          {/* Cart */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/cart')}
            className="relative rounded-full p-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-shadow"
          >
            <ShoppingCart size={20} />
            {totalCartItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                {totalCartItems}
              </span>
            )}
          </motion.button>

          {/* Mobile menu toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className={`rounded-full p-2 border transition-colors duration-200 xl:hidden ${
              darkMode ? 'border-slate-800 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-700'
            }`}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm xl:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`absolute left-0 top-0 h-full w-72 overflow-hidden rounded-r-3xl border-r p-6 shadow-2xl ${
                darkMode ? 'border-slate-800 bg-slate-950/95' : 'border-slate-200 bg-white/95'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Menu</p>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`rounded-full p-1.5 ${darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : darkMode
                          ? 'text-slate-300 hover:bg-slate-900'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-6 space-y-2">
                <button
                  onClick={() => { navigate('/wishlist'); setIsOpen(false); }}
                  className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                    darkMode ? 'bg-slate-900 text-slate-100 hover:bg-slate-800' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  ❤️ Wishlist {totalWishlistItems > 0 && `(${totalWishlistItems})`}
                </button>
                <button
                  onClick={() => { navigate('/cart'); setIsOpen(false); }}
                  className="w-full rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 px-4 py-3 text-left text-sm font-semibold text-white hover:opacity-90"
                >
                  🛒 Cart {totalCartItems > 0 && `(${totalCartItems})`}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;