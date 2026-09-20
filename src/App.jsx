import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProductListing from './pages/ProductListing.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Checkout from './pages/Checkout.jsx'
import Admin from './pages/Admin.jsx'
import Reels from './pages/Reels.jsx'
import Settings from './pages/Settings.jsx'
import Blog from './pages/Blog.jsx'
import About from './pages/About.jsx'
import Community from './pages/Community.jsx'
import TermsOfUse from './pages/TermsOfUse.jsx'
import DataNotice from './pages/DataNotice.jsx'
import WebsiteCookies from './pages/WebsiteCookies.jsx'
import Support from './pages/Support.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { ThemeProvider } from './ThemeContext.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/community" element={<Community />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/privacy-policy" element={<DataNotice />} />
          <Route path="/cookie-policy" element={<WebsiteCookies />} />
          <Route path="/support" element={<Support />} />

          {/* Authenticated Customer, Creator & Admin Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['customer', 'creator', 'admin']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['customer', 'creator', 'admin']}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Dedicated Administrator Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App