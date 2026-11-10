import React from 'react'
import Header from '../header/Header'
import Footer from '../footer/Footer'
import Routers from '../routers/Routers'
import { BrowserRouter as Router } from 'react-router-dom'
import { CartProvider } from '../../context/CartContext'
import ScrollToTop from './ScrollToTop'
function Layout() {
    return (
        <CartProvider>
            <Router>
                <ScrollToTop />
                <Header />
                <main>
                    <Routers />
                </main>
                <Footer />
            </Router>
        </CartProvider>
    )
}

export default Layout
