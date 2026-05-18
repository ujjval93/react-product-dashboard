import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Star } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const priceRanges = [
  { label: 'All', value: [0, Number.POSITIVE_INFINITY] },
  { label: 'Under $25', value: [0, 25] },
  { label: '$25 - $50', value: [25, 50] },
  { label: '$50 - $100', value: [50, 100] },
  { label: '$100+', value: [100, Number.POSITIVE_INFINITY] },
];

const ratingOptions = [4, 3, 2, 1];

const Sidebar = ({
  isOpen,
  onClose,
  categories = [],
  selectedCategory = 'All',
  onCategorySelect,
  selectedPriceRange = 'All',
  onPriceRangeSelect,
  minRating = 0,
  onRatingChange,
  onClearFilters,
}) => {
  const { darkMode } = useDarkMode();

  const activeFilterCount = [
    selectedCategory !== 'All',
    selectedPriceRange !== 'All',
    minRating > 0,
  ].filter(Boolean).length;

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="drawer"
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1, transition: { duration: 0.28, ease: 'easeOut' } }}
            exit={{ x: -320, opacity: 0, transition: { duration: 0.2 } }}
            className={`fixed left-0 top-0 h-full w-80 overflow-y-auto z-50 shadow-2xl ${
              darkMode ? 'bg-slate-900 border-r border-slate-800' : 'bg-white border-r border-slate-200'
            }`}
          >
            <div className="p-6 pb-24">
              {/* Header */}
              <div className="flex items-center justify-between mb-8 pt-4">
                <div className="flex items-center gap-2">
                  <Filter size={18} className={darkMode ? 'text-indigo-400' : 'text-indigo-600'} />
                  <h2 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Filters
                  </h2>
                  {activeFilterCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className={`rounded-full p-1.5 transition ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                >
                  <X size={18} />
                </button>
              </div>

              {/* ── Categories ── */}
              <div className="mb-8">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Category
                  </h3>
                  {selectedCategory !== 'All' && (
                    <button
                      onClick={() => onCategorySelect('All')}
                      className="text-xs font-semibold text-indigo-500 hover:text-indigo-400"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="space-y-1.5">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => onCategorySelect(category)}
                      className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all ${
                        selectedCategory === category
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                          : darkMode
                          ? 'text-slate-300 hover:bg-slate-800'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Price Range ── */}
              <div className="mb-8">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Price Range
                  </h3>
                  {selectedPriceRange !== 'All' && (
                    <button
                      onClick={() => onPriceRangeSelect('All')}
                      className="text-xs font-semibold text-indigo-500 hover:text-indigo-400"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="space-y-1.5">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => onPriceRangeSelect(range.label)}
                      className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all ${
                        selectedPriceRange === range.label
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                          : darkMode
                          ? 'text-slate-300 hover:bg-slate-800'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Min Rating ── */}
              <div className="mb-8">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Min Rating
                  </h3>
                  {minRating > 0 && (
                    <button
                      onClick={() => onRatingChange(0)}
                      className="text-xs font-semibold text-indigo-500 hover:text-indigo-400"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="space-y-1.5">
                  <button
                    onClick={() => onRatingChange(0)}
                    className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all ${
                      minRating === 0
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                        : darkMode
                        ? 'text-slate-300 hover:bg-slate-800'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Any rating
                  </button>
                  {ratingOptions.map((rating) => (
                    <button
                      key={rating}
                      onClick={() => onRatingChange(rating)}
                      className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all flex items-center gap-2 ${
                        minRating === rating
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                          : darkMode
                          ? 'text-slate-300 hover:bg-slate-800'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center gap-0.5">
                        {[...Array(rating)].map((_, i) => (
                          <Star key={i} size={12} className={minRating === rating ? 'fill-white text-white' : 'fill-yellow-400 text-yellow-400'} />
                        ))}
                      </span>
                      <span>& up</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky footer buttons */}
            <div className={`fixed bottom-0 left-0 w-80 p-4 border-t ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex gap-3">
                <button
                  onClick={() => { onClearFilters(); }}
                  className={`flex-1 rounded-full border py-2.5 text-sm font-semibold transition ${
                    darkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Clear all
                </button>
                {/* FIX: Apply just closes the drawer — filters are already applied live */}
                <button
                  onClick={onClose}
                  className="flex-1 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-90"
                >
                  Apply{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;