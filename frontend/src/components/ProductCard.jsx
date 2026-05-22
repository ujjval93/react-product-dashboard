import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';
import { ProductContext } from '../utils/Context';

const GOLD = '#B07D4A';

const ProductCard = ({ product }) => {
  const { darkMode } = useDarkMode();
  const { addToCart, toggleWishlist, wishlist } = useContext(ProductContext);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [hovered, setHovered] = useState(false);

  const discount = ((product.id * 7 + 10) % 24) + 10;
  const rating = Number(product.rating?.rate || 4.2).toFixed(1);
  const reviews = product.rating?.count || 150;
  const productPrice = Number(product.price) || 99.99;
  const isWishlisted = wishlist.some((item) => item.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);
    addToCart(product, 1);
    setTimeout(() => setIsAddingToCart(false), 1200);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <Link to={`/detail/${product.id}`} className="block h-full" style={{ textDecoration: 'none' }}>
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className={`group flex h-full flex-col overflow-hidden border transition-all duration-300 ${
          darkMode
            ? 'border-neutral-800 bg-neutral-900 text-white hover:border-neutral-700'
            : 'border-neutral-200 bg-white text-neutral-900 hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-100'
        }`}
        style={{ borderRadius: 2, fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Image area */}
        <div
          className={`relative overflow-hidden ${darkMode ? 'bg-neutral-800' : 'bg-neutral-50'}`}
          style={{ height: 220 }}
        >
          <motion.img
            src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'}
            alt={product.title || 'Product'}
            animate={{ scale: hovered ? 1.04 : 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="h-full w-full object-contain p-5"
          />

          {/* Discount badge */}
          <div
            className="absolute left-3 top-3 px-2 py-0.5 text-xs font-medium text-white"
            style={{ background: GOLD, borderRadius: 1, letterSpacing: '0.04em' }}
          >
            -{discount}%
          </div>

          {/* Wishlist */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={handleToggleWishlist}
            className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center border transition-all duration-200 ${
              isWishlisted
                ? 'bg-rose-500 border-rose-500 text-white'
                : darkMode
                ? 'border-neutral-700 bg-neutral-900/80 text-neutral-400 hover:text-rose-400 hover:border-rose-500/50'
                : 'border-neutral-200 bg-white/90 text-neutral-400 hover:text-rose-500 hover:border-rose-200'
            }`}
            style={{ borderRadius: 1 }}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
          </motion.button>

          {/* Quick view overlay */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="pointer-events-none absolute inset-0 flex items-end justify-center pb-3"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.12) 0%, transparent 60%)' }}
              >
                <span
                  className="text-xs font-medium tracking-widest uppercase text-white px-3 py-1.5"
                  style={{ background: 'rgba(0,0,0,0.55)', borderRadius: 1, letterSpacing: '0.12em' }}
                >
                  View details
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4 gap-2">
          {/* Category */}
          <p
            className="text-xs uppercase tracking-widest"
            style={{ color: GOLD, fontWeight: 400, fontSize: 10, letterSpacing: '0.16em' }}
          >
            {product.category?.charAt(0).toUpperCase() + product.category?.slice(1) || 'Featured'}
          </p>

          {/* Title */}
          <h3
            className={`line-clamp-2 text-sm leading-snug ${darkMode ? 'text-neutral-100' : 'text-neutral-800'}`}
            style={{ fontWeight: 400, fontSize: 13 }}
          >
            {product.title || 'Premium Product'}
          </h3>

          {/* Stars */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  style={{
                    fill: i < Math.floor(Number(rating)) ? '#F59E0B' : 'none',
                    color: i < Math.floor(Number(rating)) ? '#F59E0B' : (darkMode ? '#525252' : '#d4d4d4'),
                  }}
                />
              ))}
            </div>
            <span className={`text-xs ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`} style={{ fontSize: 11 }}>
              {rating} ({reviews})
            </span>
          </div>

          {/* Price row */}
          <div className="mt-auto pt-2 flex items-end justify-between">
            <div>
              <p
                className={`font-medium tracking-tight ${darkMode ? 'text-white' : 'text-neutral-900'}`}
                style={{ fontSize: 16, fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
              >
                ${productPrice.toFixed(2)}
              </p>
              <p className="text-xs line-through" style={{ color: '#a3a3a3', fontSize: 11 }}>
                ${(productPrice * 1.28).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Add to cart */}
          <motion.button
            onClick={handleAddToCart}
            whileTap={{ scale: 0.97 }}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 py-2.5 text-xs font-medium tracking-wide uppercase text-white transition-all duration-300"
            style={{
              background: isAddingToCart ? '#22c55e' : GOLD,
              borderRadius: 1,
              letterSpacing: '0.08em',
              border: 'none',
              cursor: 'pointer',
            }}
            aria-label="Add to cart"
          >
            <ShoppingCart size={13} />
            {isAddingToCart ? '✓ Added' : 'Add to cart'}
          </motion.button>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;