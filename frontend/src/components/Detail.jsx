import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingCart, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';
import Navbar from './Navbar';
import SkeletonLoader from './SkeletonLoader';
import axios from '../utils/axios';
import { ProductContext } from '../utils/Context';

const detailFeatures = [
  { icon: Truck, label: 'Free Shipping' },
  { icon: Shield, label: '100% Authentic' },
  { icon: RotateCcw, label: 'Easy Returns' },
];

const Detail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useContext(ProductContext);

  const getSingleProduct = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/products/${id}`);
      setProduct(data);
    } catch (error) {
      console.error('Detail load failed', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) getSingleProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleWishlist(product);
  };

  const isWishlisted = product ? wishlist.some((item) => item.id === product.id) : false;

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-white'} py-12`}>
          <div className="max-w-7xl mx-auto px-4">
            <SkeletonLoader count={1} columns={2} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Navbar />
        <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
          <div className="text-center px-4">
            <h1 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Product Not Found
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Back to Products
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  const rating = Number(product.rating?.rate || 4.2).toFixed(1);
  const reviews = product.rating?.count || Math.floor(Math.random() * 500) + 50;

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div>
      <Navbar />
      <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-white'} py-12`}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 mb-8 px-4 py-2 rounded-lg transition-all ${
              darkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
            }`}
          >
            <ArrowLeft size={20} />
            Back to Products
          </motion.button>

          <motion.div variants={containerVariants} initial="initial" animate="animate" className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <motion.div
              variants={itemVariants}
              className={`relative flex items-center justify-center rounded-2xl overflow-hidden p-8 ${
                darkMode ? 'bg-slate-900' : 'bg-slate-50'
              }`}
            >
              <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'}
                alt={product.title}
                className="w-full h-full max-h-96 object-contain"
              />
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="absolute top-8 right-8 rounded-full bg-red-500 px-4 py-2 text-lg font-bold text-white"
              >
                -{Math.floor(Math.random() * 30) + 5}%
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              <span className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                darkMode ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {product.category}
              </span>

              <motion.h1 variants={itemVariants} className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {product.title}
              </motion.h1>

              <motion.div variants={itemVariants} className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className={i < Math.floor(rating) ? 'fill-current' : 'text-slate-300'} />
                  ))}
                </div>
                <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>({reviews} reviews)</span>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center gap-4">
                <span className="text-5xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ${(product.price || 99.99).toFixed(2)}
                </span>
                <span className={`text-xl line-through ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                  ${(product.price * 1.3).toFixed(2)}
                </span>
              </motion.div>

              <motion.p variants={itemVariants} className={`text-lg leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                {product.description}
              </motion.p>

              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 py-6">
                {detailFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.label} className={`rounded-2xl p-4 text-center ${darkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
                      <Icon className={`mx-auto mb-2 h-6 w-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                      <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{feature.label}</p>
                    </div>
                  );
                })}
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Quantity:</span>
                  <div className={`flex items-center rounded-full border px-3 ${darkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-300 bg-slate-50'}`}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-lg font-bold"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className={`w-16 bg-transparent text-center text-lg font-bold outline-none ${darkMode ? 'text-white' : 'text-slate-900'}`}
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-indigo-500"
                  >
                    <span className="inline-flex items-center gap-2 justify-center">
                      <ShoppingCart size={22} /> Add to Cart
                    </span>
                  </button>
                  <button
                    onClick={handleToggleWishlist}
                    className={`rounded-full px-6 py-4 text-lg font-semibold transition ${
                      isWishlisted ? 'bg-rose-500 text-white' : darkMode ? 'bg-slate-900 text-slate-200 hover:bg-slate-800' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2 justify-center">
                      <Heart size={22} fill={isWishlisted ? 'currentColor' : 'none'} />
                      {isWishlisted ? 'Saved' : 'Add to Wishlist'}
                    </span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
