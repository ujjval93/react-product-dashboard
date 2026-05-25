import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import HomePage from './components/HomePage'
import Detail from './components/Detail'
import Create from './components/Create'
import Cart from './components/Cart'
import Wishlist from './components/Wishlist'
import ToastContainer from './components/ToastContainer'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import SellerLogin from './components/SellerLogin.jsx'
import SellerRegister from './components/SellerRegister.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/create' element={<Create />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/seller/register" element={<SellerRegister />} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        </Routes>
        <ToastContainer />
      </div>
    </ThemeProvider>
  )
}

export default App