import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Heart, ArrowLeft } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';
import { ProductContext } from '../utils/Context';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const GOLD = '#B07D4A';

const Wishlist = () => {
  const { darkMode } = useDarkMode();
  const { wishlist, toggleWishlist, addToCart } = useContext(ProductContext);
  const navigate = useNavigate();

  const bg = darkMode ? 'bg-neutral-950' : 'bg-neutral-50';
  const cardBg = darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200';
  const textPrimary = darkMode ? 'text-white' : 'text-neutral-900';
  const textMuted = darkMode ? 'text-neutral-400' : 'text-neutral-500';

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className={`min-h-screen ${bg}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div
            className="flex h-16 w-16 items-center justify-center mb-5"
            style={{ background: darkMode ? 'rgba(176,125,74,0.1)' : 'rgba(176,125,74,0.08)', borderRadius: 2 }}
          >
            <Heart size={28} style={{ color: GOLD }} />
          </div>
          <h2
            className={`text-2xl mb-2 font-light ${textPrimary}`}
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Your wishlist is empty
          </h2>
          <p className={`text-sm mb-8 ${textMuted}`}>Save items you love and come back anytime.</p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white"
            style={{ background: GOLD, borderRadius: 1, border: 'none', cursor: 'pointer' }}
          >
            <ArrowLeft size={15} />
            Browse products
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bg}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-1.5 text-sm transition-colors ${textMuted}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <ArrowLeft size={15} />
            Continue shopping
          </button>
          <span className={`text-xs ${textMuted}`}>·</span>
          <div className="flex items-center gap-2">
            <span className="w-4 h-px inline-block" style={{ background: GOLD }} />
            <h1
              className={`text-2xl font-light ${textPrimary}`}
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Wishlist
            </h1>
          </div>
          <span className={`text-sm ${textMuted}`}>({wishlist.length} {wishlist.length === 1 ? 'item' : 'items'})</span>
        </div>

        {/* Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence initial={false}>
            {wishlist.map((item, index) => (
              <motion.div
                key={item._id || item.id || `wishlist-${index}`}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.22 }}
                className={`flex flex-col border overflow-hidden ${cardBg}`}
                style={{ borderRadius: 2 }}
              >
                {/* Image */}
                <div
                  className={`flex items-center justify-center ${darkMode ? 'bg-neutral-800' : 'bg-neutral-50'}`}
                  style={{ height: 180 }}
                >
                  <img
                    src={item.images?.[0] || item.image || '/placeholder.jpg'}
                    alt={item.title}
                    className="h-full w-full object-contain p-5"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 p-4">
                  <p
                    className="text-xs uppercase"
                    style={{ color: GOLD, letterSpacing: '0.14em', fontSize: 10 }}
                  >
                    {item.category}
                  </p>
                  <h3
                    className={`text-sm line-clamp-2 ${textPrimary}`}
                    style={{ fontSize: 13, fontWeight: 400 }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="font-medium"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: GOLD }}
                  >
                    ${Number(item.price).toFixed(2)}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 mt-1">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => addToCart(item, 1)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-white uppercase tracking-wide"
                      style={{ background: GOLD, borderRadius: 1, border: 'none', cursor: 'pointer', letterSpacing: '0.07em' }}
                    >
                      <ShoppingCart size={13} />
                      Add to cart
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={() => toggleWishlist(item)}
                      className={`flex h-9 w-9 items-center justify-center border transition-colors ${
                        darkMode
                          ? 'border-neutral-700 text-neutral-400 hover:text-rose-400 hover:border-rose-500/50'
                          : 'border-neutral-200 text-neutral-400 hover:text-rose-500 hover:border-rose-200'
                      }`}
                      style={{ borderRadius: 1 }}
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={13} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;