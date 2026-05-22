import React from 'react';
import { motion } from 'framer-motion';
import { useDarkMode } from '../hooks/useDarkMode';

const HeroSection = () => {
  const { darkMode } = useDarkMode();

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
  };

  const stats = [
    { num: '10K+', label: 'Curated products' },
    { num: '50K+', label: 'Happy customers' },
    { num: '24/7', label: 'Expert support' },
  ];

  const pills = [
    { icon: '✦', text: 'Verified quality' },
    { icon: '✦', text: 'Top-rated brands' },
    { icon: '✦', text: 'Free returns' },
  ];

  return (
    <motion.section
      variants={containerVariants}
      initial="initial"
      animate="animate"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className={`relative overflow-hidden ${
        darkMode ? 'bg-neutral-950 text-white' : 'bg-stone-50 text-neutral-900'
      }`}
    >
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 min-h-[580px]">

        {/* ── Left Panel ── */}
        <motion.div
          variants={containerVariants}
          className={`flex flex-col justify-center px-10 py-16 lg:px-16 relative z-10 ${
            darkMode ? '' : ''
          }`}
        >
          {/* Eyebrow */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
            <span
              className="block w-7 h-px"
              style={{ background: '#B07D4A' }}
            />
            <span
              className="text-xs font-medium tracking-[0.22em] uppercase"
              style={{ color: '#B07D4A' }}
            >
              New Collection — 2026
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="leading-[1.1] tracking-tight"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2.6rem, 4vw, 3.4rem)',
              fontWeight: 300,
            }}
          >
            Crafted for those<br />
            who demand{' '}
            <em style={{ fontStyle: 'italic', color: '#B07D4A', fontWeight: 300 }}>
              more.
            </em>
          </motion.h1>

          {/* Gold divider */}
          <motion.div
            variants={itemVariants}
            className="mt-4 mb-5"
            style={{ width: 32, height: 1, background: '#B07D4A' }}
          />

          {/* Subtext */}
          <motion.p
            variants={itemVariants}
            className={`text-sm leading-[1.85] max-w-sm font-light mb-9 ${
              darkMode ? 'text-neutral-400' : 'text-neutral-500'
            }`}
          >
            A curated selection of premium products chosen for quality, design, and
            longevity. Every purchase backed by our satisfaction promise.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-6 mb-12"
          >
            <motion.button
              whileHover={{ y: -1, backgroundColor: '#2a2a2a' }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 text-white text-sm tracking-wide px-7 py-3.5"
              style={{
                background: '#1A1A1A',
                border: 'none',
                borderRadius: 2,
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: '0.07em',
                cursor: 'pointer',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              Shop Collection
            </motion.button>

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-1.5 text-sm pb-0.5 ${
                darkMode ? 'text-neutral-400 border-b border-neutral-700' : 'text-neutral-500 border-b border-neutral-300'
              }`}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: darkMode ? '1px solid #404040' : '1px solid #d4d4d4',
                borderRadius: 0,
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: '0.05em',
                cursor: 'pointer',
                padding: '0 0 3px 0',
              }}
            >
              Explore lookbook
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className={`flex gap-0 pt-8 border-t ${
              darkMode ? 'border-neutral-800' : 'border-neutral-200'
            }`}
          >
            {stats.map((stat, i) => (
              <div
                key={stat.num}
                className={`flex-1 ${i < stats.length - 1 ? (darkMode ? 'border-r border-neutral-800 mr-6 pr-6' : 'border-r border-neutral-200 mr-6 pr-6') : ''}`}
              >
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '2rem',
                    fontWeight: 300,
                    lineHeight: 1,
                    margin: 0,
                  }}
                >
                  {stat.num}
                </p>
                <p className={`text-xs mt-1.5 tracking-wide ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Right Panel — Image ── */}
        <motion.div variants={itemVariants} className="relative overflow-hidden">
          {/* Tinted overlay */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background: 'linear-gradient(160deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.38) 100%)',
            }}
          />

          {/* Main image */}
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&h=700&fit=crop"
            alt="Premium timepiece"
            className="w-full h-full object-cover"
            style={{ filter: 'saturate(0.88) contrast(1.04)' }}
          />

          {/* New Arrival stamp — top left */}
          <div
            className="absolute top-6 left-6 z-20 text-white text-xs font-medium tracking-[0.18em] uppercase px-3 py-1.5"
            style={{ background: '#B07D4A', borderRadius: 1 }}
          >
            New arrival
          </div>

          {/* Stock badge — top right */}
          <div
            className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2.5"
            style={{
              background: 'rgba(255,255,255,0.94)',
              border: '0.5px solid rgba(0,0,0,0.08)',
              borderRadius: 2,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: '#22c55e' }}
            />
            <span className="text-xs text-neutral-800" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              In stock · Ships in 2–3 days
            </span>
          </div>

          {/* Feature pills — bottom */}
          <div className="absolute bottom-6 left-6 right-6 z-20 flex gap-2 flex-wrap">
            {pills.map((pill) => (
              <div
                key={pill.text}
                className="flex items-center gap-1.5 px-3.5 py-2"
                style={{
                  background: 'rgba(255,255,255,0.92)',
                  border: '0.5px solid rgba(0,0,0,0.07)',
                  borderRadius: 2,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11.5,
                  color: '#1a1a1a',
                }}
              >
                <span style={{ color: '#B07D4A', fontSize: 9 }}>✦</span>
                {pill.text}
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.section>
  );
};

export default HeroSection;