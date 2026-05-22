import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { ProductContext } from '../utils/Context'
import Navbar from './Navbar'
import { useDarkMode } from '../hooks/useDarkMode'

const Cart = () => {
  const { darkMode } = useDarkMode()
  const { cart, removeFromCart, updateCartQuantity, clearCart, cartTotal } = useContext(ProductContext)

  if (!cart || cart.length === 0) {
    return (
      <div>
        <Navbar />
        <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-950' : 'bg-white'} py-12`}>
          <div className="text-center px-4">
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Your cart is empty</h2>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Add items to the cart and they'll appear here.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className={`min-h-screen py-12 ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="max-w-5xl mx-auto px-4">
          <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Your Cart</h1>

          <div className="grid gap-6">
            {cart.map((item) => (
              <div key={item.id} className={`flex items-center gap-4 rounded-2xl border p-4 ${darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'}`}>
                <img src={item.image} alt={item.title} className="h-20 w-20 object-contain rounded-xl bg-white/80 p-2" />
                <div className="flex-1">
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.category}</p>
                  <p className={`mt-2 font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>${Number(item.price).toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className={`px-3 py-1 rounded-lg border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-800/90' : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50'}`}
                    aria-label="Decrease quantity"
                  >-</button>
                  <div className={`px-3 py-1 rounded-lg ${darkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`}>{item.quantity}</div>
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className={`px-3 py-1 rounded-lg border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-800/90' : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50'}`}
                    aria-label="Increase quantity"
                  >+</button>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => removeFromCart(item.id)} className="text-sm text-rose-500">Remove</button>
                  <div className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>${(Number(item.price) * item.quantity).toFixed(2)}</div>
                </div>
              </div>
            ))}

            <div className={`flex items-center justify-between rounded-2xl p-4 ${darkMode ? 'bg-slate-900/80' : 'bg-white border-slate-200'}`}>
              <div>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total</p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>${cartTotal.toFixed(2)}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => clearCart()} className="px-4 py-2 rounded-lg bg-rose-500 text-white">Clear Cart</button>
                <button className="px-4 py-2 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 text-white">Checkout</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
