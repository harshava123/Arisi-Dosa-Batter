import React from 'react'
import Home from '../pages/Home'
import Products from '../pages/Products'
import Contact from '../pages/Contact'
import Cart from '../pages/Cart'
import Story from '../pages/Story'
import Recipes from '../pages/Recipes'
import Order from '../pages/Order'
import Admin from '../pages/Admin'
import { Routes, Route } from 'react-router-dom'
function Routers() {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/products' element={<Products />} />
            <Route path='/story' element={<Story />} />
            <Route path='/recipes' element={<Recipes />} />
            <Route path='/order' element={<Order />} />
            <Route path='/admin' element={<Admin />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/cart' element={<Cart />} />
        </Routes>
    </div>
  )
}

export default Routers
