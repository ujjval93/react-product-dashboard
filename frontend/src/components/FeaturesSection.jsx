import React from 'react';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, RotateCcw, Award } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const GOLD = '#B07D4A';

const features = [
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Hand-picked products from globally trusted brands, verified before every listing.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Free 2–3 day shipping on all orders over $50, tracked from door to door.',
  },
  {
    icon: ShieldCheck,
    title: 'Guaranteed Authentic',
    description: 'Every product is quality-checked and backed by our authenticity guarantee.',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '30-day hassle-free returns. No questions asked, full refund every time.',
  },
];

const FeaturesSection = () => {
  const { darkMode } = useDarkMode();

  return (
    <section
      className={`py-20 border-t ${darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-100'}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-6 h-px" style={{ background: GOLD }} />
            <span
              className="text-xs uppercase tracking-[0.2em] font-medium"
              style={{ color: GOLD }}
            >
              Why Prestige
            </span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl font-light tracking-tight ${darkMode ? 'text-white' : 'text-neutral-900'}`}
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Built around your experience
          </h2>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className={`flex flex-col gap-4 p-8 border-r last:border-r-0 border-b sm:border-b-0 ${
                  darkMode ? 'border-neutral-800' : 'border-neutral-100'
                }`}
              >
                {/* Icon */}
                <div
                  className="flex h-10 w-10 items-center justify-center"
                  style={{ background: darkMode ? 'rgba(176,125,74,0.1)' : 'rgba(176,125,74,0.08)', borderRadius: 2 }}
                >
                  <Icon size={20} style={{ color: GOLD }} />
                </div>

                {/* Divider */}
                <div className="w-8 h-px" style={{ background: GOLD, opacity: 0.5 }} />

                {/* Text */}
                <div>
                  <h3
                    className={`text-base font-medium mb-2 ${darkMode ? 'text-white' : 'text-neutral-900'}`}
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18 }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
                    style={{ fontSize: 13 }}
                  >
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;