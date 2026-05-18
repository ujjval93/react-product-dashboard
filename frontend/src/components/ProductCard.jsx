import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';
import { ProductContext } from '../utils/Context';

const ProductCard = ({ product }) => {
  const { darkMode } = useDarkMode();
  const { addToCart, toggleWishlist, wishlist } = useContext(ProductContext);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Stable discount per product (based on id, not random on each render)
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
    <Link to={`/detail/${product.id}`} className="block h-full">
      <motion.div
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`group flex h-full flex-col overflow-hidden rounded-3xl border shadow-sm transition-all duration-300 ${
          darkMode
            ? 'border-slate-800 bg-slate-950 text-white hover:shadow-2xl hover:shadow-slate-950/40'
            : 'border-slate-200 bg-white text-slate-900 hover:shadow-2xl hover:shadow-slate-200/80'
        }`}
      >
        {/* Image */}
        <div className={`relative overflow-hidden ${darkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
          <img
            src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'}
            alt={product.title || 'Product'}
            className="h-56 w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />

          {/* Discount badge */}
          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-900 shadow-sm backdrop-blur-sm dark:bg-slate-950/90 dark:text-white">
            -{discount}%
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 active:scale-90 ${
              isWishlisted
                ? 'border-transparent bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : darkMode
                ? 'border-slate-700 bg-slate-900/90 text-slate-400 hover:border-rose-500/50 hover:text-rose-400'
                : 'border-white bg-white/90 text-slate-500 hover:border-rose-200 hover:text-rose-500'
            }`}
          >
            <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>

          {/* Hover overlay */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/0 opacity-0 transition duration-300 group-hover:bg-slate-950/10 group-hover:opacity-100">
            <span className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-slate-900 shadow-lg backdrop-blur-sm dark:bg-slate-900/85 dark:text-white">
              Quick view
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          {/* Category */}
          <p className={`text-xs font-medium uppercase tracking-wide ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
            {product.category?.charAt(0).toUpperCase() + product.category?.slice(1) || 'Featured'}
          </p>

          {/* Title */}
          <h3 className={`line-clamp-2 text-sm font-semibold leading-snug ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {product.title || 'Premium Product'}
          </h3>

          {/* Stars */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={i < Math.floor(Number(rating)) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 dark:text-slate-600'}
                />
              ))}
            </div>
            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {rating} · {reviews}
            </span>
          </div>

          {/* Price row */}
          <div className="mt-auto flex items-end justify-between gap-2 pt-1">
            <div>
              <p className={`text-lg font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                ${productPrice.toFixed(2)}
              </p>
              <p className="text-xs text-slate-400 line-through">
                ${(productPrice * 1.28).toFixed(2)}
              </p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${darkMode ? 'bg-indigo-500/10 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>
              Premium
            </span>
          </div>

          {/* Add to cart */}
          <motion.button
            onClick={handleAddToCart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={`mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 ${
              isAddingToCart
                ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30'
                : 'bg-linear-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/30'
            }`}
          >
            <ShoppingCart size={16} />
            {isAddingToCart ? '✓ Added!' : 'Add to cart'}
          </motion.button>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;