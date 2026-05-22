import React from 'react';
import { motion } from 'framer-motion';
import { useDarkMode } from '../hooks/useDarkMode';

const HeroSection = () => {
  const { darkMode } = useDarkMode();

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.18, delayChildren: 0.12 },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={`relative overflow-hidden px-4 pt-16 pb-20 sm:px-6 lg:px-8 ${
        darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Background blobs */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-24 h-56 w-56 rounded-full bg-pink-500/10 blur-3xl" />
      <div className="pointer-events-none absolute left-10 bottom-10 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl grid gap-12 lg:grid-cols-2 items-center">

        {/* Left content */}
        <motion.div variants={containerVariants} className="w-full">
          <motion.p
            variants={itemVariants}
            className={`text-sm uppercase tracking-[0.35em] font-semibold ${
              darkMode ? 'text-indigo-400' : 'text-indigo-600'
            }`}
          >
            Premium Retail
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="mt-5 text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold leading-tight tracking-tight"
          >
            Discover beautifully curated products that feel{' '}
            <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text  premium-selection selection:bg-indigo-600/40 selection:text-white dark:selection:bg-indigo-400/40">
              premium
            </span>
            , modern, and effortless.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className={`mt-6 max-w-xl text-base leading-8 sm:text-lg ${
              darkMode ? 'text-slate-300' : 'text-slate-500'
            }`} 
          >
            Shop from best-in-class brands with elegant packaging, fast shipping,
            and a refined ecommerce experience designed for confident buying.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-indigo-600 to-purple-600 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-indigo-500/25 transition duration-300"
            >
              Shop Now
            </motion.button>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`inline-flex items-center justify-center rounded-full border px-8 py-3.5 text-base font-semibold shadow-sm transition duration-300 ${
                darkMode
                  ? 'border-slate-700 bg-slate-900/90 text-white hover:bg-slate-800'
                  : 'border-slate-200 bg-white/90 text-slate-900 hover:border-indigo-300 hover:bg-indigo-50'
              }`}
            >
              Learn More
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="mt-10 grid grid-cols-3 gap-4"
          >
            {[
              { title: '10K+', subtitle: 'Premium Products' },
              { title: '50K+', subtitle: 'Happy Customers' },
              { title: '24/7', subtitle: 'Support Ready' },
            ].map((item) => (
              <div
                key={item.title}
                className={`rounded-2xl border p-5 ${
                  darkMode
                    ? 'border-slate-800 bg-slate-900/90 shadow-sm'
                    : 'border-slate-300 bg-white shadow-md'
                }`}
              >
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {item.title}
                </p>
                <p className={`mt-1 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {item.subtitle}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right image */}
        <motion.div variants={itemVariants} className="relative mx-auto w-full max-w-lg">
          <div
            className={`relative overflow-hidden rounded-3xl border shadow-2xl shadow-indigo-500/10 ${
              darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200/80 bg-white'
            }`}
          >
            <div className="absolute inset-0 bg-linear-to-br from-indigo-600/10 via-transparent to-purple-600/10 z-10" />
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&h=700&fit=crop"
              alt="Premium watches"
              className="relative h-100 w-full object-cover"
            />
          </div>

          {/* Badge top-left */}
          <div className={`absolute left-5 top-5 z-20 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-xl ${
            darkMode
              ? 'border-slate-700/70 bg-slate-950/90'
              : 'border-slate-300 bg-white'
          }`}>
            <p className="text-sm font-semibold text-indigo-600">Fast Delivery</p>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              2-3 day shipping across the US
            </p>
          </div>

          {/* Badge bottom-right */}
          <div className={`absolute bottom-5 right-5 z-20 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-xl ${
            darkMode
              ? 'border-slate-700/70 bg-slate-950/90'
              : 'border-slate-300 bg-white'
          }`}>
            <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Verified Quality
            </p>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Curated and quality assured
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;