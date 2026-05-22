import React, { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, ArrowLeft } from 'lucide-react'
import { ProductContext } from '../utils/Context'
import { useNavigate } from 'react-router-dom'
import { nanoid } from 'nanoid'
import Navbar from './Navbar'
import { useDarkMode } from '../hooks/useDarkMode'

const Create = () => {
  const { addProduct } = useContext(ProductContext)
  const { darkMode } = useDarkMode()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    image: '',
    price: '',
    category: '',
    description: '',
  })

  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters'
    }

    if (formData.image.trim().length < 5) {
      newErrors.image = 'Image URL must be at least 5 characters'
    }

    if (formData.category.trim().length < 3) {
      newErrors.category = 'Category must be at least 3 characters'
    }

    if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price'
    }

    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const product = {
      id: nanoid(),
      title: formData.title,
      image: formData.image,
      category: formData.category,
      price: parseFloat(formData.price),
      description: formData.description,
    }

    // Use context's addProduct to save with persistence
    addProduct(product)
    setSubmitted(true)

    setTimeout(() => {
      setFormData({
        title: '',
        image: '',
        price: '',
        category: '',
        description: '',
      })
      setSubmitted(false)
      navigate('/')
    }, 1500)
  }

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  const inputVariants = {
    focus: { scale: 1.02, boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)' },
  }

  return (
    <div>
      <Navbar />

      <div className={`min-h-screen py-12 ${
        darkMode
          ? 'bg-linear-to-br from-gray-950 via-gray-900 to-gray-850'
          : 'bg-linear-to-br from-gray-50 via-white to-blue-50'
      }`}>
        <div className="max-w-2xl mx-auto px-4">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 mb-8 px-4 py-2 rounded-lg transition-all ${
              darkMode
                ? 'bg-gray-800 hover:bg-gray-700 text-white'
                : 'bg-white hover:bg-gray-50 text-gray-900 shadow-sm'
            }`}
          >
            <ArrowLeft size={20} />
            Back
          </motion.button>

          {/* Form Container */}
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className={`rounded-2xl p-8 shadow-xl ${
              darkMode
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-200'
            }`}
          >
            {/* Header */}
            <motion.div
              variants={itemVariants}
              className="mb-8 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-linear-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                <Plus size={24} className="text-white" />
              </div>
              <h1 className={`text-3xl font-bold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Add New Product
              </h1>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                Create and list a new premium product
              </p>
            </motion.div>

            {/* Success Message */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-green-100 border border-green-200 text-green-700 rounded-lg text-center"
              >
                ✓ Product added successfully! Redirecting...
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <motion.div variants={itemVariants}>
                <label className={`block text-sm font-semibold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Product Title *
                </label>
                <motion.input
                  variants={inputVariants}
                  whileFocus="focus"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter product title"
                  className={`w-full px-4 py-3 rounded-lg border transition-all ${
                    errors.title
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500'
                  } ${
                    darkMode
                      ? 'bg-gray-700 text-white placeholder-gray-400'
                      : 'bg-white text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2`}
                />
                {errors.title && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-500"
                  >
                    {errors.title}
                  </motion.p>
                )}
              </motion.div>

              {/* Image URL */}
              <motion.div variants={itemVariants}>
                <label className={`block text-sm font-semibold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Image URL *
                </label>
                <motion.input
                  variants={inputVariants}
                  whileFocus="focus"
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className={`w-full px-4 py-3 rounded-lg border transition-all ${
                    errors.image
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500'
                  } ${
                    darkMode
                      ? 'bg-gray-700 text-white placeholder-gray-400'
                      : 'bg-white text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2`}
                />
                {errors.image && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-500"
                  >
                    {errors.image}
                  </motion.p>
                )}
              </motion.div>

              {/* Price and Category */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Category *
                  </label>
                  <motion.input
                    variants={inputVariants}
                    whileFocus="focus"
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g., Electronics"
                    className={`w-full px-4 py-3 rounded-lg border transition-all ${
                      errors.category
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-indigo-500'
                    } ${
                      darkMode
                        ? 'bg-gray-700 text-white placeholder-gray-400'
                        : 'bg-white text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2`}
                  />
                  {errors.category && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1 text-sm text-red-500"
                    >
                      {errors.category}
                    </motion.p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Price ($) *
                  </label>
                  <motion.input
                    variants={inputVariants}
                    whileFocus="focus"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-3 rounded-lg border transition-all ${
                      errors.price
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-indigo-500'
                    } ${
                      darkMode
                        ? 'bg-gray-700 text-white placeholder-gray-400'
                        : 'bg-white text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2`}
                  />
                  {errors.price && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1 text-sm text-red-500"
                    >
                      {errors.price}
                    </motion.p>
                  )}
                </div>
              </motion.div>

              {/* Description */}
              <motion.div variants={itemVariants}>
                <label className={`block text-sm font-semibold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Description *
                </label>
                <motion.textarea
                  variants={inputVariants}
                  whileFocus="focus"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your product in detail..."
                  rows={6}
                  className={`w-full px-4 py-3 rounded-lg border transition-all resize-none ${
                    errors.description
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500'
                  } ${
                    darkMode
                      ? 'bg-gray-700 text-white placeholder-gray-400'
                      : 'bg-white text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2`}
                />
                {errors.description && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-500"
                  >
                    {errors.description}
                  </motion.p>
                )}
              </motion.div>

              {/* Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex gap-4 pt-6"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitted}
                  className="flex-1 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-500/50 transition-all disabled:opacity-50"
                >
                  <Plus size={20} />
                  {submitted ? 'Adding...' : 'Add Product'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => navigate('/')}
                  className={`flex-1 py-3 rounded-lg font-bold transition-all border-2 ${
                    darkMode
                      ? 'border-gray-600 text-white hover:bg-gray-700'
                      : 'border-gray-300 text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Cancel
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Create