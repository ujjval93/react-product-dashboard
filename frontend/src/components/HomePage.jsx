import React, { useContext, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, Mail } from 'lucide-react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ProductCard from './ProductCard';
import SkeletonLoader from './SkeletonLoader';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import { ProductContext } from '../utils/Context';
import { useDarkMode } from '../hooks/useDarkMode';

const priceRanges = [
  { label: 'All', value: [0, Number.POSITIVE_INFINITY] },
  { label: 'Under $25', value: [0, 25] },
  { label: '$25 - $50', value: [25, 50] },
  { label: '$50 - $100', value: [50, 100] },
  { label: '$100+', value: [100, Number.POSITIVE_INFINITY] },
];

const sortOptions = [
  'Latest',
  'Top Rated',
  'Price: Low to High',
  'Price: High to Low',
  'Best Sellers',
];

const HomePage = () => {
  const { products, loading: productsLoading, categories } = useContext(ProductContext);
  const { darkMode } = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [sortOption, setSortOption] = useState('Latest');

  useEffect(() => {
    if (!productsLoading) {
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [productsLoading]);

  const visibleProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((product) =>
        product.title?.toLowerCase().includes(query) || product.description?.toLowerCase().includes(query),
      );
    }

    const range = priceRanges.find((rangeOption) => rangeOption.label === selectedPriceRange)?.value || [0, Number.POSITIVE_INFINITY];
    filtered = filtered.filter((product) => {
      const price = Number(product.price) || 0;
      return price >= range[0] && price <= range[1];
    });

    if (minRating > 0) {
      filtered = filtered.filter((product) => Number(product.rating?.rate || 0) >= minRating);
    }

    switch (sortOption) {
      case 'Price: Low to High':
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'Price: High to Low':
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'Top Rated':
        filtered.sort((a, b) => Number(b.rating?.rate || 0) - Number(a.rating?.rate || 0));
        break;
      case 'Best Sellers':
        filtered.sort((a, b) => Number(b.rating?.count || 0) - Number(a.rating?.count || 0));
        break;
      default:
        filtered.sort((a, b) => b.id - a.id);
    }

    return filtered;
  }, [products, selectedCategory, searchQuery, selectedPriceRange, minRating, sortOption]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPriceRange('All');
    setMinRating(0);
    setSortOption('Latest');
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <Navbar />
      <HeroSection />

      <section className={`py-16 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-sm uppercase tracking-[0.35em] text-indigo-500">Featured Collection</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Elegant products for modern lifestyles
            </h2>
            <p className={`mt-3 max-w-2xl text-base leading-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Browse premium items with refined details, smooth interactions, and production-ready polish.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 flex flex-col gap-4 rounded-3xl border px-5 py-5 shadow-sm transition-all duration-300 sm:flex-row sm:items-center sm:justify-between lg:px-7 lg:py-6"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500"
              >
                <Filter size={18} />
                Filters
              </button>

              <div className={`flex items-center rounded-full border px-4 py-2 shadow-sm transition ${
                darkMode ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'
              }`}>
                <Search size={18} className={darkMode ? 'text-slate-500' : 'text-slate-400'} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search premium goods"
                  className="ml-3 w-full bg-transparent text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Showing {visibleProducts.length} of {products.length} products
                </span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className={`rounded-full border px-4 py-3 text-sm transition ${
                    darkMode ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'
                  }`}
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {loading ? (
            <SkeletonLoader count={10} columns={5} />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid gap-8 grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
            >
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          )}

          {visibleProducts.length === 0 && !loading && (
            <div className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
              <p className="text-lg font-semibold text-slate-900 dark:text-white">No products match your filters.</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Try adjusting search, category, or price range.</p>
              <button
                onClick={handleClearFilters}
                className="mt-6 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      <FeaturesSection />

      <footer className={`${darkMode ? 'bg-slate-950 text-slate-300' : 'bg-slate-900 text-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white">Prestige</h3>
              <p className="max-w-md text-sm leading-7 text-slate-400">
                A premium ecommerce experience with polished interactions, elegant typography, and beautiful visual polish for modern brands.
              </p>
              <div className="flex items-center gap-3">
                {['Twitter', 'Facebook', 'Instagram', 'LinkedIn'].map((name) => (
                  <span key={name} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-slate-200 transition hover:bg-white/20">
                    {name.charAt(0)}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-base font-semibold text-white">Explore</h4>
              <ul className="mt-6 space-y-3 text-sm text-slate-400">
                <li>Products</li>
                <li>Categories</li>
                <li>Brands</li>
                <li>Gift Cards</li>
              </ul>
            </div>

            <div>
              <h4 className="text-base font-semibold text-white">Support</h4>
              <ul className="mt-6 space-y-3 text-sm text-slate-400">
                <li>Contact Us</li>
                <li>FAQ</li>
                <li>Returns</li>
                <li>Shipping</li>
              </ul>
            </div>

            <div className="rounded-4xl border border-white/10 bg-white/5 p-6">
              <h4 className="text-base font-semibold text-white">Subscribe</h4>
              <p className="mt-3 text-sm text-slate-400">
                Join our newsletter for early access to new drops and exclusive promotions.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <div className="flex flex-1 items-center gap-2 rounded-full border border-white/10 bg-slate-950/80 px-4 py-3">
                  <Mail size={18} className="text-slate-300" />
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                  />
                </div>
                <button className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-8 text-sm text-slate-500">
            <p>© 2024 Prestige. Crafted for premium ecommerce experiences.</p>
          </div>
        </div>
      </footer>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        selectedPriceRange={selectedPriceRange}
        onPriceRangeSelect={setSelectedPriceRange}
        minRating={minRating}
        onRatingChange={setMinRating}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
};

export default HomePage;
