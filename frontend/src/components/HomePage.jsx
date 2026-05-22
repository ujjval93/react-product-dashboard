import React, { useContext, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Search, ChevronDown, Mail, ArrowRight } from 'lucide-react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ProductCard from './ProductCard';
import SkeletonLoader from './SkeletonLoader';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import { ProductContext } from '../utils/Context';
import { useDarkMode } from '../hooks/useDarkMode';

const GOLD = '#B07D4A';

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

const SOCIAL = [
  { label: 'TW', href: '#' },
  { label: 'FB', href: '#' },
  { label: 'IG', href: '#' },
  { label: 'LI', href: '#' },
];

const FOOTER_LINKS = {
  Explore: ['Products', 'Categories', 'Brands', 'Gift Cards'],
  Support: ['Contact Us', 'FAQ', 'Returns', 'Shipping Policy'],
  Company: ['About Us', 'Careers', 'Press', 'Sustainability'],
};

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
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) => p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q),
      );
    }

    const range =
      priceRanges.find((r) => r.label === selectedPriceRange)?.value || [0, Infinity];
    filtered = filtered.filter((p) => {
      const price = Number(p.price) || 0;
      return price >= range[0] && price <= range[1];
    });

    if (minRating > 0) {
      filtered = filtered.filter((p) => Number(p.rating?.rate || 0) >= minRating);
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

  const activeFilterCount = [
    selectedCategory !== 'All',
    selectedPriceRange !== 'All',
    minRating > 0,
  ].filter(Boolean).length;

  const bg = darkMode ? 'bg-neutral-950' : 'bg-neutral-50';
  const textPrimary = darkMode ? 'text-white' : 'text-neutral-900';
  const textMuted = darkMode ? 'text-neutral-400' : 'text-neutral-500';
  const cardBorder = darkMode ? 'border-neutral-800' : 'border-neutral-200';

  return (
    <div
      className={`min-h-screen ${bg} ${textPrimary}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Navbar />
      <HeroSection />

      {/* ── Products Section ── */}
      <section className={`py-20 ${bg}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="block w-6 h-px" style={{ background: GOLD }} />
              <span
                className="text-xs uppercase font-medium"
                style={{ color: GOLD, letterSpacing: '0.2em', fontSize: 10 }}
              >
                Featured Collection
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2
                className={`text-3xl sm:text-4xl font-light tracking-tight ${textPrimary}`}
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Elegant products for modern living
              </h2>
              <p className={`text-sm max-w-sm ${textMuted}`} style={{ fontSize: 13 }}>
                {products.length} premium items across {categories.length - 1} categories
              </p>
            </div>
          </motion.div>

          {/* Filter & search bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8 px-4 py-3.5 border ${cardBorder} ${darkMode ? 'bg-neutral-900' : 'bg-white'}`}
            style={{ borderRadius: 2 }}
          >
            {/* Left: filter + search */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs uppercase tracking-widest border transition-colors ${
                  activeFilterCount > 0
                    ? 'text-white border-transparent'
                    : darkMode
                    ? `border-neutral-700 ${textMuted} hover:border-neutral-500`
                    : `border-neutral-200 ${textMuted} hover:border-neutral-400`
                }`}
                style={{
                  background: activeFilterCount > 0 ? GOLD : 'transparent',
                  borderRadius: 1,
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <SlidersHorizontal size={13} />
                Filters{activeFilterCount > 0 ? ` · ${activeFilterCount}` : ''}
              </button>

              <div
                className={`flex items-center gap-2 border px-3 py-2 transition-colors ${
                  darkMode ? 'border-neutral-700 bg-transparent' : 'border-neutral-200 bg-transparent'
                }`}
                style={{ borderRadius: 1, minWidth: 200 }}
              >
                <Search size={13} className={textMuted} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products…"
                  className={`w-full bg-transparent text-xs outline-none ${textMuted}`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className={`text-xs ${textMuted} hover:${textPrimary}`}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Right: count + sort */}
            <div className="flex items-center gap-4">
              <span className={`text-xs ${textMuted}`}>
                {visibleProducts.length} of {products.length} items
              </span>
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className={`appearance-none text-xs pr-7 pl-3 py-2 border transition-colors ${
                    darkMode
                      ? `border-neutral-700 bg-neutral-900 ${textPrimary}`
                      : `border-neutral-200 bg-white ${textPrimary}`
                  }`}
                  style={{ borderRadius: 1, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}
                >
                  {sortOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${textMuted}`}
                />
              </div>
            </div>
          </motion.div>

          {/* Active filter chips */}
          {(selectedCategory !== 'All' || selectedPriceRange !== 'All' || minRating > 0) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {selectedCategory !== 'All' && (
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs border transition-colors"
                  style={{
                    background: darkMode ? 'rgba(176,125,74,0.1)' : 'rgba(176,125,74,0.07)',
                    border: 'none',
                    borderRadius: 1,
                    color: GOLD,
                    cursor: 'pointer',
                  }}
                >
                  {selectedCategory} ×
                </button>
              )}
              {selectedPriceRange !== 'All' && (
                <button
                  onClick={() => setSelectedPriceRange('All')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs"
                  style={{
                    background: darkMode ? 'rgba(176,125,74,0.1)' : 'rgba(176,125,74,0.07)',
                    border: 'none',
                    borderRadius: 1,
                    color: GOLD,
                    cursor: 'pointer',
                  }}
                >
                  {selectedPriceRange} ×
                </button>
              )}
              {minRating > 0 && (
                <button
                  onClick={() => setMinRating(0)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs"
                  style={{
                    background: darkMode ? 'rgba(176,125,74,0.1)' : 'rgba(176,125,74,0.07)',
                    border: 'none',
                    borderRadius: 1,
                    color: GOLD,
                    cursor: 'pointer',
                  }}
                >
                  {minRating}★ & up ×
                </button>
              )}
              <button
                onClick={handleClearFilters}
                className={`px-3 py-1.5 text-xs ${textMuted} hover:${textPrimary}`}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Clear all
              </button>
            </motion.div>
          )}

          {/* Products grid */}
          {loading ? (
            <SkeletonLoader count={10} columns={5} />
          ) : visibleProducts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
            >
              {visibleProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.4) }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* Empty state */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mt-4 border border-dashed p-14 text-center ${cardBorder}`}
              style={{ borderRadius: 2 }}
            >
              <div
                className="w-10 h-10 mx-auto mb-4 flex items-center justify-center"
                style={{ background: darkMode ? 'rgba(176,125,74,0.1)' : 'rgba(176,125,74,0.08)', borderRadius: 1 }}
              >
                <Search size={18} style={{ color: GOLD }} />
              </div>
              <p className={`text-base font-light mb-1 ${textPrimary}`} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20 }}>
                No products found
              </p>
              <p className={`text-xs mb-6 ${textMuted}`}>
                Try adjusting your search, category, or price range.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-6 py-2.5 text-xs font-medium text-white uppercase tracking-widest"
                style={{ background: GOLD, border: 'none', borderRadius: 1, cursor: 'pointer', letterSpacing: '0.1em' }}
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <FeaturesSection />

      {/* ── Footer ── */}
      <footer
        className={`${darkMode ? 'bg-neutral-900 text-neutral-300' : 'bg-neutral-950 text-neutral-300'}`}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-16 pb-10">

          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1.4fr]">

            {/* Brand column */}
            <div className="space-y-5">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 items-center justify-center text-white text-sm"
                  style={{ background: GOLD, borderRadius: 1, fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 500 }}
                >
                  P
                </div>
                <span
                  className="text-xl text-white"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
                >
                  Prestige
                </span>
              </div>

              <p className="text-sm leading-7 text-neutral-500 max-w-xs" style={{ fontSize: 13 }}>
                A curated ecommerce experience built for discerning shoppers who value quality, design, and authenticity.
              </p>

              {/* Social */}
              <div className="flex items-center gap-2">
                {SOCIAL.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex h-8 w-8 items-center justify-center text-xs font-medium text-neutral-400 border border-neutral-800 transition-colors hover:border-neutral-600 hover:text-white"
                    style={{ borderRadius: 1 }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <div key={heading}>
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-4 h-px" style={{ background: GOLD }} />
                  <h4
                    className="text-xs uppercase font-medium text-white"
                    style={{ letterSpacing: '0.14em', fontSize: 10 }}
                  >
                    {heading}
                  </h4>
                </div>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-xs text-neutral-500 hover:text-neutral-200 transition-colors"
                        style={{ fontSize: 13 }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <span className="w-4 h-px" style={{ background: GOLD }} />
                <h4
                  className="text-xs uppercase font-medium text-white"
                  style={{ letterSpacing: '0.14em', fontSize: 10 }}
                >
                  Newsletter
                </h4>
              </div>
              <p className="text-xs text-neutral-500 mb-5 leading-relaxed" style={{ fontSize: 13 }}>
                Early access to new arrivals, exclusive drops, and members-only offers.
              </p>
              <div
                className="flex items-center border border-neutral-800 overflow-hidden"
                style={{ borderRadius: 1 }}
              >
                <div className="flex-1 flex items-center gap-2 px-3 py-2.5">
                  <Mail size={13} className="text-neutral-600 flex-shrink-0" />
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full bg-transparent text-xs outline-none text-neutral-300 placeholder-neutral-600"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>
                <button
                  className="flex items-center justify-center h-full px-3 py-2.5 text-white flex-shrink-0 transition-opacity hover:opacity-80"
                  style={{ background: GOLD, border: 'none', cursor: 'pointer' }}
                  aria-label="Subscribe"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className={`mt-12 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}>
            <p className="text-xs text-neutral-600">
              © {new Date().getFullYear()} Prestige. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              {['Privacy Policy', 'Terms', 'Cookies'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
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