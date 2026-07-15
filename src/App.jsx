import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import './App.css'

/* Route-level code splitting.
   Each page is its own async chunk, so the initial load only ships the landing
   route (Deals) + shared chrome instead of all 14 pages. React.lazy + Suspense
   streams the rest on navigation. The landing route is imported statically
   because it is the most common entry point and its LCP shouldn't wait on a
   second network round-trip. */
import Deals from './pages/Deals'

const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'))
const Signin = lazy(() => import('./pages/Signin'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const Orders = lazy(() => import('./pages/Orders'))
const TrackOrder = lazy(() => import('./pages/TrackOrder'))
const About = lazy(() => import('./pages/About'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))

/* Reset scroll to the top on every route change, so each page
   opens at its hero instead of keeping the previous scroll position.
   Skips the reset when a route was entered with location.state.scrollTo,
   so the landing route can honor a cross-page anchor jump instead. */
function ScrollToTop() {
  const { pathname, state } = useLocation()
  useEffect(() => {
    if (state && state.scrollTo) return
    window.scrollTo(0, 0)
  }, [pathname, state])
  return null
}

/* Minimal, brand-toned fallback shown while a route chunk loads.
   Deliberately empty of layout so it never causes a visible flash on
   fast connections; the dark background matches the app shell. */
function RouteFallback() {
  return <div className="route-fallback" role="status" aria-live="polite" aria-label="Loading" />
}

/* Some routes (auth screens) intentionally render without the site chrome
   — no header, no default main padding — for a focused, distraction-free UI. */
const CHROMELESS_ROUTES = new Set(['/signin', '/forgot-password', '/reset-password'])

function App() {
  const { pathname } = useLocation()
  const chromeless = CHROMELESS_ROUTES.has(pathname)

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <ScrollToTop />
      {!chromeless && <Header />}
      <main id="main-content" className={`main ${chromeless ? 'main--bare' : ''}`}>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Deals />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="*" element={<Deals />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}

export default App
