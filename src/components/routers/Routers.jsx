import React, { Suspense, lazy } from 'react'
import Home from '../pages/Home'
import Products from '../pages/Products'
import Contact from '../pages/Contact'
import Cart from '../pages/Cart'
import Story from '../pages/Story'
import Recipes from '../pages/Recipes'
import { Routes, Route } from 'react-router-dom'

const Order = lazy(() => import('../pages/Order'))

function Routers() {
  return (
    <div>
      <Suspense fallback={<div className="py-32 text-center text-muted">Loading…</div>}>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/products' element={<Products />} />
            <Route path='/story' element={<Story />} />
            <Route path='/recipes' element={<Recipes />} />
            <Route path='/order' element={<Order />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/cart' element={<Cart />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default Routers
