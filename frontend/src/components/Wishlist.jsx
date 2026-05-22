import React, { useContext } from 'react'
import Navbar from './Navbar'
import { ShoppingCart } from 'lucide-react'
import { useDarkMode } from '../hooks/useDarkMode'
import { ProductContext } from '../utils/Context'

const Wishlist = () => {
  const { darkMode } = useDarkMode()
  const { wishlist, toggleWishlist, addToCart } = useContext(ProductContext)

  if (!wishlist || wishlist.length === 0) {
    return (
      <div>
        <Navbar />
        <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-950' : 'bg-white'} py-12`}>
          <div className="text-center px-4">
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Your wishlist is empty</h2>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Add items to your wishlist and they'll appear here.</p>
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
          <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Wishlist</h1>

          <div className="grid gap-6">
            {wishlist.map((item) => (
              <div key={item.id} className={`flex items-center gap-4 rounded-2xl border p-4 ${darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'}`}>
                <img src={item.image} alt={item.title} className="h-20 w-20 object-contain rounded-xl bg-white/80 p-2" />
                <div className="flex-1">
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.category}</p>
                  <p className={`mt-2 font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>${Number(item.price).toFixed(2)}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => addToCart(item, 1)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white shadow-md transition ${darkMode ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gradient-to-r from-indigo-600 to-purple-600'}`}
                    aria-label="Add to cart"
                  >
                    <ShoppingCart size={16} />
                    <span>Add to cart</span>
                  </button>
                  <button
                    onClick={() => toggleWishlist(item)}
                    className="text-sm text-rose-500"
                  >Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Wishlist
