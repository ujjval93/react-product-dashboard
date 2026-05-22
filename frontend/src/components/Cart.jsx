import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { ProductContext } from '../utils/Context';
import Navbar from './Navbar';
import { useDarkMode } from '../hooks/useDarkMode';
import { useNavigate } from 'react-router-dom';

const GOLD = '#B07D4A';

const Cart = () => {
  const { darkMode } = useDarkMode();
  const { cart, removeFromCart, updateCartQuantity, clearCart, cartTotal } = useContext(ProductContext);
  const navigate = useNavigate();

  const shipping = cartTotal > 50 ? 0 : 5.99;
  const tax = cartTotal * 0.08;
  const orderTotal = cartTotal + shipping + tax;

  const bg = darkMode ? 'bg-neutral-950' : 'bg-neutral-50';
  const cardBg = darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200';
  const textPrimary = darkMode ? 'text-white' : 'text-neutral-900';
  const textMuted = darkMode ? 'text-neutral-400' : 'text-neutral-500';
  const divider = darkMode ? 'border-neutral-800' : 'border-neutral-100';

  if (!cart || cart.length === 0) {
    return (
      <div className={`min-h-screen ${bg}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div
            className="flex h-16 w-16 items-center justify-center mb-5"
            style={{ background: darkMode ? 'rgba(176,125,74,0.1)' : 'rgba(176,125,74,0.08)', borderRadius: 2 }}
          >
            <ShoppingBag size={28} style={{ color: GOLD }} />
          </div>
          <h2
            className={`text-2xl mb-2 font-light ${textPrimary}`}
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Your cart is empty
          </h2>
          <p className={`text-sm mb-8 ${textMuted}`}>Add some premium items to get started.</p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white"
            style={{ background: GOLD, borderRadius: 1, border: 'none', cursor: 'pointer' }}
          >
            <ArrowLeft size={15} />
            Continue shopping
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
            className={`flex items-center gap-1.5 text-sm transition-colors ${textMuted} hover:${textPrimary}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <ArrowLeft size={15} />
            Continue shopping
          </button>
          <span className={`text-xs ${textMuted}`}>·</span>
          <div className="flex items-center gap-2">
            <span className="w-4 h-px" style={{ background: GOLD, display: 'inline-block' }} />
            <h1
              className={`text-2xl font-light ${textPrimary}`}
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Your Cart
            </h1>
          </div>
          <span className={`text-sm ${textMuted}`}>({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">

          {/* Items list */}
          <div className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex items-center gap-5 border p-4 ${cardBg}`}
                  style={{ borderRadius: 2 }}
                >
                  {/* Image */}
                  <div
                    className={`flex-shrink-0 flex items-center justify-center ${darkMode ? 'bg-neutral-800' : 'bg-neutral-50'}`}
                    style={{ width: 80, height: 80, borderRadius: 1 }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs uppercase tracking-widest mb-0.5`}
                      style={{ color: GOLD, fontSize: 10, letterSpacing: '0.14em' }}
                    >
                      {item.category}
                    </p>
                    <h3
                      className={`text-sm font-normal line-clamp-2 ${textPrimary}`}
                      style={{ fontSize: 13 }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="mt-1 font-medium"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: GOLD }}
                    >
                      ${Number(item.price).toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className={`flex items-center border ${darkMode ? 'border-neutral-700' : 'border-neutral-200'}`} style={{ borderRadius: 1 }}>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className={`w-8 h-8 flex items-center justify-center text-lg font-light transition-colors ${darkMode ? 'text-neutral-300 hover:bg-neutral-800' : 'text-neutral-600 hover:bg-neutral-50'}`}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    <span
                      className={`w-8 text-center text-sm font-medium border-x ${textPrimary} ${darkMode ? 'border-neutral-700' : 'border-neutral-200'}`}
                      style={{ lineHeight: '32px' }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className={`w-8 h-8 flex items-center justify-center text-lg font-light transition-colors ${darkMode ? 'text-neutral-300 hover:bg-neutral-800' : 'text-neutral-600 hover:bg-neutral-50'}`}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal + remove */}
                  <div className="flex flex-col items-end gap-2 ml-2">
                    <span
                      className={`font-medium ${textPrimary}`}
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17 }}
                    >
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-600 transition-colors"
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <Trash2 size={12} />
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Clear cart */}
            <div className="flex justify-end mt-1">
              <button
                onClick={clearCart}
                className={`text-xs transition-colors ${textMuted} hover:text-rose-500`}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Clear all items
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div
              className={`border p-6 sticky top-24 ${cardBg}`}
              style={{ borderRadius: 2 }}
            >
              <h2
                className={`text-lg font-light mb-5 pb-4 border-b ${textPrimary} ${divider}`}
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Order Summary
              </h2>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className={textMuted}>Subtotal</span>
                  <span className={textPrimary}>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={textMuted}>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-500' : textPrimary}>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className={`text-xs ${textMuted}`}>
                    Add ${(50 - cartTotal).toFixed(2)} more for free shipping
                  </p>
                )}
                <div className="flex justify-between">
                  <span className={textMuted}>Tax (8%)</span>
                  <span className={textPrimary}>${tax.toFixed(2)}</span>
                </div>

                <div className={`border-t pt-3 mt-1 flex justify-between font-medium ${divider}`}>
                  <span
                    className={textPrimary}
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17 }}
                  >
                    Total
                  </span>
                  <span
                    className={textPrimary}
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17 }}
                  >
                    ${orderTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                className="mt-6 w-full py-3.5 text-sm font-medium tracking-widest uppercase text-white transition-opacity hover:opacity-90"
                style={{ background: GOLD, border: 'none', borderRadius: 1, cursor: 'pointer', letterSpacing: '0.1em' }}
              >
                Proceed to Checkout
              </motion.button>

              <p className={`mt-3 text-center text-xs ${textMuted}`}>
                Secure payment · SSL encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;