import React from 'react'
import Header from '../header/Header'
import Footer from '../footer/Footer'
import Routers from '../routers/Routers'
import { BrowserRouter as Router, useLocation } from 'react-router-dom'
import { CartProvider } from '../../context/CartContext'
import ScrollToTop from './ScrollToTop'
import AdminApp from '../admin/AdminApp'

function SiteShell() {
    const { pathname } = useLocation()
    if (pathname.startsWith('/admin')) return <AdminApp />
    return (
        <>
            <Header />
            <main>
                <Routers />
            </main>
            <Footer />
        </>
    )
}

function Layout() {
    return (
        <CartProvider>
            <Router>
                <ScrollToTop />
                <SiteShell />
            </Router>
        </CartProvider>
    )
}

export default Layout
