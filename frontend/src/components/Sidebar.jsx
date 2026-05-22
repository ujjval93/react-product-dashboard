import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, Star } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const GOLD = '#B07D4A';

const priceRanges = [
  { label: 'All', value: [0, Number.POSITIVE_INFINITY] },
  { label: 'Under $25', value: [0, 25] },
  { label: '$25 – $50', value: [25, 50] },
  { label: '$50 – $100', value: [50, 100] },
  { label: '$100+', value: [100, Number.POSITIVE_INFINITY] },
];

const ratingOptions = [4, 3, 2, 1];

const SectionLabel = ({ children, onClear, showClear, darkMode }) => (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-2.5">
      <span className="block w-3 h-px" style={{ background: GOLD }} />
      <span
        className="text-xs uppercase font-medium"
        style={{
          color: darkMode ? '#737373' : '#a3a3a3',
          letterSpacing: '0.16em',
          fontSize: 10,
        }}
      >
        {children}
      </span>
    </div>
    {showClear && (
      <button
        onClick={onClear}
        className="text-xs transition-colors"
        style={{ color: GOLD, background: 'none', border: 'none', cursor: 'pointer' }}
      >
        Clear
      </button>
    )}
  </div>
);

const FilterButton = ({ active, onClick, children, darkMode }) => (
  <button
    onClick={onClick}
    className="w-full text-left text-sm transition-all flex items-center justify-between px-3 py-2.5"
    style={{
      borderRadius: 1,
      background: active
        ? darkMode ? 'rgba(176,125,74,0.12)' : 'rgba(176,125,74,0.08)'
        : 'transparent',
      color: active ? GOLD : darkMode ? '#d4d4d4' : '#525252',
      border: active ? `1px solid rgba(176,125,74,0.3)` : '1px solid transparent',
      cursor: 'pointer',
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: active ? 500 : 400,
    }}
  >
    {children}
    {active && (
      <span
        className="flex h-1.5 w-1.5 rounded-full flex-shrink-0"
        style={{ background: GOLD }}
      />
    )}
  </button>
);

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

  const bg = darkMode ? 'bg-neutral-900' : 'bg-white';
  const border = darkMode ? 'border-neutral-800' : 'border-neutral-200';
  const divider = darkMode ? 'border-neutral-800' : 'border-neutral-100';

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
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="drawer"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ x: -300, opacity: 0, transition: { duration: 0.2 } }}
            className={`fixed left-0 top-0 h-full w-72 flex flex-col z-50 border-r ${bg} ${border}`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-5 border-b flex-shrink-0 ${divider}`}>
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal size={15} style={{ color: GOLD }} />
                <span
                  className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-neutral-900'}`}
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17 }}
                >
                  Refine
                </span>
                {activeFilterCount > 0 && (
                  <span
                    className="flex h-4.5 w-4.5 items-center justify-center text-white text-[10px] font-semibold px-1.5 py-0.5"
                    style={{ background: GOLD, borderRadius: 1, fontSize: 10 }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className={`flex h-7 w-7 items-center justify-center transition-colors ${
                  darkMode ? 'text-neutral-500 hover:text-neutral-300' : 'text-neutral-400 hover:text-neutral-700'
                }`}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">

              {/* ── Categories ── */}
              <div>
                <SectionLabel
                  darkMode={darkMode}
                  showClear={selectedCategory !== 'All'}
                  onClear={() => onCategorySelect('All')}
                >
                  Category
                </SectionLabel>
                <div className="space-y-0.5">
                  {categories.map((category) => (
                    <FilterButton
                      key={category}
                      active={selectedCategory === category}
                      onClick={() => onCategorySelect(category)}
                      darkMode={darkMode}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </FilterButton>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className={`border-t ${divider}`} />

              {/* ── Price Range ── */}
              <div>
                <SectionLabel
                  darkMode={darkMode}
                  showClear={selectedPriceRange !== 'All'}
                  onClear={() => onPriceRangeSelect('All')}
                >
                  Price range
                </SectionLabel>
                <div className="space-y-0.5">
                  {priceRanges.map((range) => (
                    <FilterButton
                      key={range.label}
                      active={selectedPriceRange === range.label}
                      onClick={() => onPriceRangeSelect(range.label)}
                      darkMode={darkMode}
                    >
                      {range.label}
                    </FilterButton>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className={`border-t ${divider}`} />

              {/* ── Min Rating ── */}
              <div>
                <SectionLabel
                  darkMode={darkMode}
                  showClear={minRating > 0}
                  onClear={() => onRatingChange(0)}
                >
                  Min rating
                </SectionLabel>
                <div className="space-y-0.5">
                  <FilterButton
                    active={minRating === 0}
                    onClick={() => onRatingChange(0)}
                    darkMode={darkMode}
                  >
                    Any rating
                  </FilterButton>
                  {ratingOptions.map((rating) => (
                    <FilterButton
                      key={rating}
                      active={minRating === rating}
                      onClick={() => onRatingChange(rating)}
                      darkMode={darkMode}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="flex items-center gap-0.5">
                          {[...Array(rating)].map((_, i) => (
                            <Star
                              key={i}
                              size={11}
                              style={{
                                fill: '#F59E0B',
                                color: '#F59E0B',
                              }}
                            />
                          ))}
                        </span>
                        <span>& up</span>
                      </span>
                    </FilterButton>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky footer */}
            <div className={`flex-shrink-0 px-6 py-4 border-t ${divider} ${bg}`}>
              <div className="flex gap-2.5">
                <button
                  onClick={() => { onClearFilters(); }}
                  className={`flex-1 py-2.5 text-xs font-medium uppercase tracking-widest border transition-colors ${
                    darkMode
                      ? 'border-neutral-700 text-neutral-400 hover:text-neutral-200 hover:border-neutral-600'
                      : 'border-neutral-200 text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                  style={{ borderRadius: 1, background: 'none', cursor: 'pointer', letterSpacing: '0.1em' }}
                >
                  Clear all
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 text-xs font-medium uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                  style={{
                    background: GOLD,
                    border: 'none',
                    borderRadius: 1,
                    cursor: 'pointer',
                    letterSpacing: '0.1em',
                  }}
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