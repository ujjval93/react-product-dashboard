import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingCart, Star, Truck, ShieldCheck, RotateCcw, Package } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';
import Navbar from './Navbar';
import SkeletonLoader from './SkeletonLoader';
import axios from '../utils/axios';
import { ProductContext } from '../utils/Context';

const GOLD = '#B07D4A';

const badges = [
  { icon: Truck, label: 'Free Shipping', sub: 'Orders over $50' },
  { icon: ShieldCheck, label: '100% Authentic', sub: 'Verified product' },
  { icon: RotateCcw, label: 'Easy Returns', sub: '30-day policy' },
  { icon: Package, label: 'Secure Packing', sub: 'Damage-free delivery' },
];

const Detail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { id } = useParams();
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist, products } = useContext(ProductContext);

  const getSingleProduct = async () => {
    setLoading(true);
    try {
      const contextProduct = products.find((p) => String(p.id) === String(id));
      if (contextProduct) { setProduct(contextProduct); setLoading(false); return; }
      const { data } = await axios.get(`/products/${id}`);
      setProduct(data);
    } catch (error) {
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) getSingleProduct(); }, [id, products]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const isWishlisted = product ? wishlist.some((item) => item.id === product.id) : false;
  const discount = product ? ((product.id * 7 + 10) % 24) + 10 : 15;
  const rating = Number(product?.rating?.rate || 4.2).toFixed(1);
  const reviews = product?.rating?.count || 120;

  const bg = darkMode ? 'bg-neutral-950' : 'bg-neutral-50';
  const textPrimary = darkMode ? 'text-white' : 'text-neutral-900';
  const textMuted = darkMode ? 'text-neutral-400' : 'text-neutral-500';
  const cardBg = darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200';
  const divider = darkMode ? 'border-neutral-800' : 'border-neutral-100';

  if (loading) {
    return (
      <div className={`min-h-screen ${bg}`}>
        <Navbar />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12">
          <SkeletonLoader count={1} columns={2} />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`min-h-screen ${bg} flex items-center justify-center`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Navbar />
        <div className="text-center">
          <h1 className={`text-2xl font-light mb-4 ${textPrimary}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Product not found
          </h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 text-sm text-white"
            style={{ background: GOLD, border: 'none', borderRadius: 1, cursor: 'pointer' }}
          >
            Back to products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bg}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12">

        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className={`flex items-center gap-1.5 text-sm mb-10 transition-colors ${textMuted}`}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <ArrowLeft size={14} />
          Back to products
        </button>

        {/* Main grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-10 lg:grid-cols-2"
        >
          {/* Left — Image */}
          <div className="relative">
            <div
              className={`relative flex items-center justify-center overflow-hidden border ${cardBg}`}
              style={{ borderRadius: 2, minHeight: 420 }}
            >
              <motion.img
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={product.image}
                alt={product.title}
                className="w-full max-h-96 object-contain p-10"
              />
              {/* Discount badge */}
              <div
                className="absolute top-5 right-5 px-2.5 py-1 text-xs font-medium text-white"
                style={{ background: GOLD, borderRadius: 1, letterSpacing: '0.06em' }}
              >
                -{discount}% OFF
              </div>
            </div>

            {/* Thumbnails placeholder (same image shown 3x for UX completeness) */}
            <div className="flex gap-2 mt-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 flex items-center justify-center border cursor-pointer transition-colors ${
                    i === 0 ? (darkMode ? 'border-amber-700' : 'border-amber-400') : cardBg
                  }`}
                  style={{ height: 60, borderRadius: 1 }}
                >
                  <img src={product.image} alt="" className="h-full w-full object-contain p-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Right — Info */}
          <div className="flex flex-col gap-5">
            {/* Category + title */}
            <div>
              <p
                className="text-xs uppercase mb-2"
                style={{ color: GOLD, letterSpacing: '0.18em', fontSize: 10 }}
              >
                {product.category}
              </p>
              <h1
                className={`text-3xl sm:text-4xl font-light leading-tight ${textPrimary}`}
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
              >
                {product.title}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    style={{
                      fill: i < Math.floor(Number(rating)) ? '#F59E0B' : 'none',
                      color: i < Math.floor(Number(rating)) ? '#F59E0B' : (darkMode ? '#525252' : '#d4d4d4'),
                    }}
                  />
                ))}
              </div>
              <span className={`text-sm ${textMuted}`}>{rating} · {reviews} reviews</span>
            </div>

            {/* Price */}
            <div className={`flex items-baseline gap-3 pb-5 border-b ${divider}`}>
              <span
                className="text-4xl font-light"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: GOLD }}
              >
                ${(product.price || 99.99).toFixed(2)}
              </span>
              <span className={`text-lg line-through ${textMuted}`}>
                ${(product.price * (1 + discount / 100)).toFixed(2)}
              </span>
              <span className="text-sm text-green-500 font-medium">
                Save {discount}%
              </span>
            </div>

            {/* Description */}
            <p className={`text-sm leading-relaxed ${textMuted}`} style={{ fontSize: 13 }}>
              {product.description}
            </p>

            {/* Quantity + actions */}
            <div className={`pt-4 border-t ${divider}`}>
              <div className="flex items-center gap-4 mb-5">
                <span className={`text-xs uppercase tracking-widest ${textMuted}`} style={{ letterSpacing: '0.1em' }}>
                  Qty
                </span>
                <div
                  className={`flex items-center border ${darkMode ? 'border-neutral-700' : 'border-neutral-200'}`}
                  style={{ borderRadius: 1 }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={`w-9 h-9 flex items-center justify-center text-lg font-light transition-colors ${darkMode ? 'hover:bg-neutral-800 text-neutral-300' : 'hover:bg-neutral-50 text-neutral-600'}`}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                  >−</button>
                  <span
                    className={`w-10 text-center text-sm font-medium border-x ${textPrimary} ${darkMode ? 'border-neutral-700' : 'border-neutral-200'}`}
                    style={{ lineHeight: '36px' }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className={`w-9 h-9 flex items-center justify-center text-lg font-light transition-colors ${darkMode ? 'hover:bg-neutral-800 text-neutral-300' : 'hover:bg-neutral-50 text-neutral-600'}`}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                  >+</button>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium text-white uppercase tracking-widest transition-colors"
                  style={{
                    background: addedToCart ? '#22c55e' : GOLD,
                    border: 'none',
                    borderRadius: 1,
                    cursor: 'pointer',
                    letterSpacing: '0.1em',
                  }}
                >
                  <ShoppingCart size={15} />
                  {addedToCart ? '✓ Added to cart' : 'Add to cart'}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => toggleWishlist(product)}
                  className={`flex h-12 w-12 items-center justify-center border transition-colors ${
                    isWishlisted
                      ? 'bg-rose-500 border-rose-500 text-white'
                      : darkMode
                      ? 'border-neutral-700 text-neutral-400 hover:text-rose-400 hover:border-rose-500/50'
                      : 'border-neutral-200 text-neutral-400 hover:text-rose-500 hover:border-rose-200'
                  }`}
                  style={{ borderRadius: 1 }}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart size={17} fill={isWishlisted ? 'currentColor' : 'none'} />
                </motion.button>
              </div>
            </div>

            {/* Feature badges */}
            <div className={`grid grid-cols-2 gap-2 pt-4 border-t ${divider}`}>
              {badges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.label}
                    className={`flex items-center gap-3 p-3 border ${darkMode ? 'border-neutral-800' : 'border-neutral-100'}`}
                    style={{ borderRadius: 1 }}
                  >
                    <Icon size={16} style={{ color: GOLD, flexShrink: 0 }} />
                    <div>
                      <p className={`text-xs font-medium ${textPrimary}`}>{badge.label}</p>
                      <p className={`text-xs ${textMuted}`}>{badge.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Detail;