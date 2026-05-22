import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Context from './utils/Context'
import { ThemeProvider } from './contexts/ThemeContext'
import HomePage from './components/HomePage'
import Detail from './components/Detail'
import Create from './components/Create'
import Cart from './components/Cart'
import Wishlist from './components/Wishlist'
import ToastContainer from './components/ToastContainer'

// ToastContainer reads notifications from context itself — no need to pass props
const App = () => {
  return (
    <Context>
      <ThemeProvider>
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/create' element={<Create />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
          <ToastContainer />
        </div>
      </ThemeProvider>
    </Context>
  )
}

export default App