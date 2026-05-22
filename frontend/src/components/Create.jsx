import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { ProductContext } from '../utils/Context';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import Navbar from './Navbar';
import { useDarkMode } from '../hooks/useDarkMode';

const GOLD = '#B07D4A';

const CATEGORIES = [
  'electronics',
  "men's clothing",
  "women's clothing",
  'jewelery',
  'accessories',
  'home & living',
  'beauty',
];

const Create = () => {
  const { addProduct } = useContext(ProductContext);
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    image: '',
    price: '',
    category: '',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const e = {};
    if (formData.title.trim().length < 5) e.title = 'Title must be at least 5 characters';
    if (formData.image.trim().length < 5) e.image = 'Please enter a valid image URL';
    if (formData.category.trim().length < 3) e.category = 'Please select or enter a category';
    if (formData.description.trim().length < 10) e.description = 'Description must be at least 10 characters';
    if (!formData.price || parseFloat(formData.price) <= 0) e.price = 'Please enter a valid price';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    const product = {
      id: nanoid(),
      title: formData.title,
      image: formData.image,
      category: formData.category,
      price: parseFloat(formData.price),
      description: formData.description,
    };

    addProduct(product);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ title: '', image: '', price: '', category: '', description: '' });
      setSubmitted(false);
      navigate('/');
    }, 1600);
  };

  const bg = darkMode ? 'bg-neutral-950' : 'bg-neutral-50';
  const cardBg = darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200';
  const textPrimary = darkMode ? 'text-white' : 'text-neutral-900';
  const textMuted = darkMode ? 'text-neutral-400' : 'text-neutral-500';
  const inputCls = (fieldName) => `w-full px-3.5 py-2.5 text-sm outline-none border transition-all ${
    errors[fieldName]
      ? 'border-rose-400'
      : darkMode
      ? 'border-neutral-700 bg-neutral-800 text-white placeholder-neutral-500 focus:border-amber-700'
      : 'border-neutral-200 bg-white text-neutral-900 placeholder-neutral-400 focus:border-amber-400'
  }`;

  return (
    <div className={`min-h-screen ${bg}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 py-12">

        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className={`flex items-center gap-1.5 text-sm mb-10 transition-colors ${textMuted}`}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <ArrowLeft size={14} />
          Back to products
        </button>

        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">

          {/* Form */}
          <div
            className={`border p-8 ${cardBg}`}
            style={{ borderRadius: 2 }}
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-6 h-px block" style={{ background: GOLD }} />
                <span className="text-xs uppercase tracking-[0.2em]" style={{ color: GOLD, fontSize: 10 }}>New listing</span>
              </div>
              <h1
                className={`text-3xl font-light ${textPrimary}`}
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Add New Product
              </h1>
              <p className={`mt-1 text-sm ${textMuted}`}>Fill in the details to list a product in the store.</p>
            </div>

            {/* Success */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 mb-6 p-4 text-sm text-green-700 bg-green-50 border border-green-200"
                  style={{ borderRadius: 1 }}
                >
                  <CheckCircle size={16} />
                  Product added successfully! Redirecting…
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Title */}
              <div>
                <label className={`block text-xs font-medium uppercase tracking-wide mb-1.5 ${textMuted}`} style={{ letterSpacing: '0.08em' }}>
                  Product title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Premium Leather Watch"
                  className={inputCls('title')}
                  style={{ borderRadius: 1 }}
                />
                {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title}</p>}
              </div>

              {/* Image URL */}
              <div>
                <label className={`block text-xs font-medium uppercase tracking-wide mb-1.5 ${textMuted}`} style={{ letterSpacing: '0.08em' }}>
                  Image URL *
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className={inputCls('image')}
                  style={{ borderRadius: 1 }}
                />
                {errors.image && <p className="mt-1 text-xs text-rose-500">{errors.image}</p>}
              </div>

              {/* Category + Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-medium uppercase tracking-wide mb-1.5 ${textMuted}`} style={{ letterSpacing: '0.08em' }}>
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={inputCls('category')}
                    style={{ borderRadius: 1, appearance: 'none' }}
                  >
                    <option value="">Select…</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-xs text-rose-500">{errors.category}</p>}
                </div>

                <div>
                  <label className={`block text-xs font-medium uppercase tracking-wide mb-1.5 ${textMuted}`} style={{ letterSpacing: '0.08em' }}>
                    Price (USD) *
                  </label>
                  <div className="relative">
                    <span
                      className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm ${textMuted}`}
                    >$</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={inputCls('price') + ' pl-7'}
                      style={{ borderRadius: 1 }}
                    />
                  </div>
                  {errors.price && <p className="mt-1 text-xs text-rose-500">{errors.price}</p>}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={`block text-xs font-medium uppercase tracking-wide mb-1.5 ${textMuted}`} style={{ letterSpacing: '0.08em' }}>
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your product in detail…"
                  rows={5}
                  className={inputCls('description') + ' resize-none'}
                  style={{ borderRadius: 1 }}
                />
                {errors.description && <p className="mt-1 text-xs text-rose-500">{errors.description}</p>}
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitted}
                  className="flex-1 py-3 text-sm font-medium text-white uppercase tracking-widest transition-opacity disabled:opacity-60"
                  style={{ background: GOLD, border: 'none', borderRadius: 1, cursor: 'pointer', letterSpacing: '0.1em' }}
                >
                  {submitted ? 'Adding…' : 'List product'}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => navigate('/')}
                  className={`px-6 py-3 text-sm font-medium border transition-colors ${
                    darkMode
                      ? 'border-neutral-700 text-neutral-300 hover:bg-neutral-800'
                      : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                  style={{ borderRadius: 1 }}
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </div>

          {/* Live preview */}
          <div className="hidden lg:block">
            <p className={`text-xs uppercase tracking-widest mb-4 ${textMuted}`} style={{ letterSpacing: '0.14em' }}>
              Preview
            </p>
            <div
              className={`border overflow-hidden ${cardBg}`}
              style={{ borderRadius: 2 }}
            >
              <div
                className={`flex items-center justify-center ${darkMode ? 'bg-neutral-800' : 'bg-neutral-50'}`}
                style={{ height: 180 }}
              >
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="h-full w-full object-contain p-5"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <span className={`text-xs ${textMuted}`}>Image preview</span>
                )}
              </div>

              <div className="p-4">
                <p className="text-xs uppercase mb-1" style={{ color: GOLD, letterSpacing: '0.14em', fontSize: 10 }}>
                  {formData.category || 'Category'}
                </p>
                <h3
                  className={`text-sm line-clamp-2 mb-2 ${textPrimary}`}
                  style={{ fontSize: 13, fontWeight: 400 }}
                >
                  {formData.title || 'Product title will appear here'}
                </h3>
                <p
                  className="font-medium"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: GOLD }}
                >
                  {formData.price ? `$${parseFloat(formData.price).toFixed(2)}` : '$0.00'}
                </p>
              </div>
            </div>

            <p className={`mt-3 text-xs ${textMuted}`}>
              Preview updates as you type.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;