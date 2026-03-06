import React from 'react'
import Home from './components/Home'
import { Link, Route, Routes } from 'react-router-dom'
import Detail from './components/Detail'
import Create from './components/Create'

const App = () => {
  return (
    <div className='h-screen w-screen flex'>
      <Link to="/" className='text-red-300 absolute left-[18%]'>Home</Link>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/create' element={<Create />}/>
        <Route path="/detail/:id" element={<Detail />} />
      </Routes>
    </div>
  )
}

export default App