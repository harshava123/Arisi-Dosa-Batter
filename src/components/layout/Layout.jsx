import React, { Suspense, lazy } from 'react'
import Header from '../header/Header'
import Footer from '../footer/Footer'
import Routers from '../routers/Routers'
import { BrowserRouter as Router, useLocation } from 'react-router-dom'
import { CartProvider } from '../../context/CartContext'
import ScrollToTop from './ScrollToTop'

const AdminApp = lazy(() => import('../admin/AdminApp'))

function SiteShell() {
    const { pathname } = useLocation()
    if (pathname.startsWith('/admin')) {
        return (
            <Suspense fallback={<div className="grid min-h-screen place-items-center text-muted">Loading…</div>}>
                <AdminApp />
            </Suspense>
        )
    }
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
