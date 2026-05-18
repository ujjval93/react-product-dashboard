import React from 'react';
import { motion } from 'framer-motion';
import { useDarkMode } from '../hooks/useDarkMode';

const SkeletonLoader = ({ count = 6, columns = 5 }) => {
  const { darkMode } = useDarkMode();

  const skeletons = Array.from({ length: count });
  const gridColsClass = {
    5: 'grid-cols-5',
    3: 'grid-cols-3',
    2: 'grid-cols-2',
  }[columns] || 'grid-cols-5';

  const pulseVariants = {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: { duration: 1.5, repeat: Infinity },
    },
  };

  return (
    <div className={`grid gap-6 ${gridColsClass}`}>
      {skeletons.map((_, index) => (
        <motion.div
          key={index}
          variants={pulseVariants}
          animate="animate"
          className={`rounded-xl overflow-hidden ${
            darkMode ? 'bg-gray-800' : 'bg-gray-200'
          }`}
        >
          {/* Image Skeleton */}
          <div className={`h-64 w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />

          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <div className={`h-4 w-3/4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
            
            {/* Rating */}
            <div className={`h-4 w-1/2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
            
            {/* Price */}
            <div className="flex gap-2">
              <div className={`h-4 w-1/3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
              <div className={`h-4 w-1/4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
            </div>

            {/* Button */}
            <div className={`h-10 w-full rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
