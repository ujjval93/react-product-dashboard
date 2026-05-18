import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Zap, Globe } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const FeaturesSection = () => {
  const { darkMode } = useDarkMode();

  const features = [
    {
      icon: TrendingUp,
      title: 'Premium Quality',
      description: 'Hand-picked products from trusted brands',
    },
    {
      icon: Award,
      title: 'Best Prices',
      description: 'Guaranteed lowest prices with price match',
    },
    {
      icon: Zap,
      title: 'Fast Shipping',
      description: 'Free shipping on orders over $50',
    },
    {
      icon: Globe,
      title: 'Global Selection',
      description: 'Shop from thousands of worldwide sellers',
    },
  ];

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className={`py-16 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          variants={itemVariants}
          className={`text-4xl font-bold text-center mb-12 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Why Choose Prestige?
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className={`p-8 rounded-2xl text-center transition-all duration-300 ${
                  darkMode
                    ? 'bg-gray-800 hover:shadow-lg hover:shadow-indigo-500/20'
                    : 'bg-white hover:shadow-lg hover:shadow-indigo-500/10'
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="w-16 h-16 mx-auto mb-4 bg-linear-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center"
                >
                  <Icon size={28} className="text-white" />
                </motion.div>
                <h3 className={`text-lg font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeaturesSection;
