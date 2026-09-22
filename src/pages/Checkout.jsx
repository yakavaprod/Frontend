import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import {
  FaArrowLeft,
  FaLock,
  FaCheckCircle,
  FaMobileAlt,
  FaCopy,
  FaShieldAlt,
  FaBolt,
  FaTag,
  FaPhoneAlt,
  FaShoppingCart,
} from 'react-icons/fa'
import SimpleHeader from '../components/SimpleHeader.jsx'
import Footer from '../components/Footer.jsx'
import api from '../api.js'
import './Checkout.css'

export default function Checkout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { product, quantity = 1 } = location.state || {}

  const [processing, setProcessing] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState(null)
  const [copiedUssd, setCopiedUssd] = useState(false)

  // Promo code support
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoDiscount, setPromoDiscount] = useState(0) // percent
  const [promoError, setPromoError] = useState('')

  // Prefill user details if logged in
  const loggedInUser = JSON.parse(sessionStorage.getItem('user') || 'null')

  const [formData, setFormData] = useState({
    fullName: loggedInUser?.name || '',
    email: loggedInUser?.email || '',
    phone: loggedInUser?.phone || '',
    country: loggedInUser?.country || 'Rwanda',
    state: '',
    zip: '',
  })

  useEffect(() => {
    if (loggedInUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || loggedInUser.name || '',
        email: prev.email || loggedInUser.email || '',
        phone: prev.phone || loggedInUser.phone || '',
        country: prev.country || loggedInUser.country || 'Rwanda',
      }))
    }
  }, [])

  if (!product) {
    return (
      <div className="checkout-page">
        <SimpleHeader showBack={true} title="Checkout" />
        <main className="checkout-empty-state">
          <div className="empty-card glass-panel">
            <div className="empty-icon-wrap">
              <FaShoppingCart />
            </div>
            <h2>No Product Selected for Checkout</h2>
            <p>
              Your cart is currently empty or your session expired. Explore our collection of premium courses, presets, and digital tools.
            </p>
            <div className="empty-actions">
              <Link to="/products" className="yk-btn yk-btn-primary">
                <FaArrowLeft /> Browse Marketplace
              </Link>
              <Link to="/" className="yk-btn yk-btn-ghost">
                Back to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const baseDiscountedPrice = product.price * (1 - (product.discount || 0) / 100)
  const effectivePrice = promoApplied
    ? baseDiscountedPrice * (1 - promoDiscount / 100)
    : baseDiscountedPrice

  const totalAmount = effectivePrice * (quantity || 1)
  const momoAmount = Math.max(0, totalAmount).toFixed(2)
  const momoMerchantNumber = '0798653349'
  const momoUssdCode = `*182*1*1*${momoMerchantNumber}*${momoAmount}#`

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleApplyPromo = async (e) => {
    e.preventDefault()
    setPromoError('')
    const code = promoCode.trim().toUpperCase()
    if (!code) return

    try {
      const { data } = await api.post('/coupons/validate', {
        code,
        productId: product._id,
      })

      setPromoApplied(true)
      setPromoDiscount(data.discountPercent)
      setPromoError('')
    } catch (requestError) {
      setPromoApplied(false)
      setPromoDiscount(0)
      setPromoError(requestError.response?.data?.error || 'Invalid or expired coupon code for this product.')
    }
  }

  const handleCopyUssd = () => {
    navigator.clipboard.writeText(momoUssdCode)
    setCopiedUssd(true)
    setTimeout(() => setCopiedUssd(false), 2500)
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    setError('')
    setProcessing(true)
    try {
      const { data } = await api.post('/orders', {
        items: [{ productId: product._id, quantity: quantity || 1 }],
        promoCode: promoApplied ? promoCode.trim().toUpperCase() : '',
        billing: formData,
      })
      setOrder(data)
      // Attempt opening dialer on mobile devices
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        window.location.href = `tel:${encodeURIComponent(momoUssdCode)}`
      }
      setCompleted(true)
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        navigate('/login', { state: { from: location } })
        return
      }
      setError(requestError.response?.data?.error || 'Unable to place your order right now.')
    } finally {
      setProcessing(false)
    }
  }

  if (completed && order) {
    return (
      <div className="checkout-page">
        <SimpleHeader showBack={false} title="Order Confirmed" />
        <main className="checkout-success-wrap">
          <div className="success-card glass-panel">
            <div className="success-badge-glow">
              <FaCheckCircle className="success-badge-icon" />
            </div>

            <span className="eyebrow" style={{ color: 'var(--accent-emerald)' }}>Order Received</span>
            <h1 className="success-heading">Thank You For Your Order!</h1>
            <p className="success-sub">
              Your order has been initiated. Complete the prompt on your phone or dial the MoMo code below to finalize payment.
            </p>

            <div className="ussd-highlight-box">
              <span className="ussd-label">MTN MoMo Quick Dial Code</span>
              <div className="ussd-code-row">
                <code className="ussd-text">{momoUssdCode}</code>
                <button
                  type="button"
                  onClick={handleCopyUssd}
                  className="yk-btn yk-btn-secondary ussd-copy-btn"
                >
                  <FaCopy /> {copiedUssd ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <small className="ussd-hint">Dial code from your registered MTN SIM card and enter your MoMo PIN.</small>
            </div>

            <div className="order-summary-box">
              <div className="order-row">
                <span>Order Reference:</span>
                <strong className="order-ref">{order.orderNumber}</strong>
              </div>
              <div className="order-row">
                <span>Purchased Item:</span>
                <strong>{product.title}</strong>
              </div>
              <div className="order-row">
                <span>Quantity:</span>
                <strong>{quantity || 1}</strong>
              </div>
              <div className="order-row">
                <span>Total Amount:</span>
                <strong className="order-total-rwf">RWF {Number(order.total || totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
              </div>
              <div className="order-row">
                <span>Payment Method:</span>
                <span className="momo-pill">MTN Mobile Money</span>
              </div>
            </div>

            <div className="next-steps-card">
              <h3>What Happens Next?</h3>
              <ul>
                <li>
                  <FaCheckCircle className="step-icon" />
                  <span>Accept the MoMo prompt on your phone or dial the USSD code.</span>
                </li>
                <li>
                  <FaCheckCircle className="step-icon" />
                  <span>Digital access to <strong>{product.title}</strong> is immediately attached to your Library.</span>
                </li>
                <li>
                  <FaCheckCircle className="step-icon" />
                  <span>A copy of your receipt has been recorded for your account.</span>
                </li>
              </ul>
            </div>

            <div className="success-actions">
              <button onClick={() => navigate('/dashboard')} className="yk-btn yk-btn-primary">
                Open My Dashboard & Shelf
              </button>
              <button onClick={() => navigate('/products')} className="yk-btn yk-btn-ghost">
                Browse Marketplace
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <SimpleHeader showBack={true} title="Secure Checkout" />

      <main className="checkout-main-content">
        <div className="wrap">
          {/* Checkout Steps Header */}
          <div className="checkout-steps-bar">
            <div className="step-item step-completed">
              <span className="step-num"><FaCheckCircle /></span>
              <span className="step-text">1. Selection</span>
            </div>
            <div className="step-divider" />
            <div className="step-item step-active">
              <span className="step-num">2</span>
              <span className="step-text">2. Customer & Payment</span>
            </div>
            <div className="step-divider" />
            <div className="step-item">
              <span className="step-num">3</span>
              <span className="step-text">3. Instant Access</span>
            </div>
          </div>

          <div className="checkout-grid">
            {/* Left Column: Forms */}
            <div className="checkout-form-column">
              {/* Customer Contact */}
              <section className="checkout-section glass-panel">
                <div className="section-header-row">
                  <h2 className="section-title-sm">1. Customer Information</h2>
                  <span className="section-badge">Encrypted</span>
                </div>

                <form id="checkout-form" onSubmit={handlePayment}>
                  <div className="form-grid-2">
                    <div className="form-field full-width">
                      <label className="yk-label" htmlFor="fullName">Full Name</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        className="yk-input"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Eric Bizimana"
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label className="yk-label" htmlFor="email">Delivery Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="yk-input"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@domain.com"
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label className="yk-label" htmlFor="phone">Phone Number (MTN MoMo)</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="yk-input"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="078 / 079..."
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label className="yk-label" htmlFor="country">Country</label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        className="yk-input"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Rwanda"
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label className="yk-label" htmlFor="state">City / District</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        className="yk-input"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Kigali"
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="payment-method-block">
                    <div className="section-header-row" style={{ marginTop: '2rem' }}>
                      <h2 className="section-title-sm">2. Payment Method</h2>
                      <span className="payment-security-tag"><FaLock /> Instant Verification</span>
                    </div>

                    <div className="payment-cards-selector">
                      <label className="payment-method-card payment-method-card--active">
                        <input type="radio" name="paymentMethod" defaultChecked readOnly />
                        <div className="method-indicator" />
                        <div className="method-details">
                          <div className="method-title-row">
                            <span className="method-name">MTN Mobile Money (MoMo)</span>
                            <span className="momo-chip">Recommended in RW</span>
                          </div>
                          <p className="method-desc">Pay instantly using your MTN phone number via standard USSD prompt.</p>
                        </div>
                        <FaMobileAlt className="method-icon" />
                      </label>
                    </div>

                    {/* MoMo Action Details */}
                    <div className="momo-instructions-card">
                      <div className="momo-header">
                        <span className="momo-tag">MTN MoMo Direct</span>
                        <span className="momo-merchant">Merchant ID: {momoMerchantNumber}</span>
                      </div>

                      <p className="momo-text">
                        Clicking <strong>&ldquo;Complete Payment & Access&rdquo;</strong> will register your order and open your phone dialer with this exact code:
                      </p>

                      <div className="ussd-interactive-bar">
                        <code className="ussd-pill">{momoUssdCode}</code>
                        <div className="ussd-btn-group">
                          <button
                            type="button"
                            onClick={handleCopyUssd}
                            className="yk-btn yk-btn-secondary yk-btn-sm"
                          >
                            <FaCopy /> {copiedUssd ? 'Copied!' : 'Copy'}
                          </button>
                          <a
                            href={`tel:${encodeURIComponent(momoUssdCode)}`}
                            className="yk-btn yk-btn-primary yk-btn-sm"
                          >
                            <FaPhoneAlt /> Call Code
                          </a>
                        </div>
                      </div>

                      <div className="momo-steps-list">
                        <div className="mini-step">
                          <span className="mini-step-num">1</span>
                          <span>Submit order or dial code above</span>
                        </div>
                        <div className="mini-step">
                          <span className="mini-step-num">2</span>
                          <span>Input your MoMo secret PIN</span>
                        </div>
                        <div className="mini-step">
                          <span className="mini-step-num">3</span>
                          <span>Confirmation SMS received instantly</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions Checkbox */}
                  <div className="checkout-terms-row">
                    <label className="checkbox-container">
                      <input type="checkbox" id="terms" required defaultChecked />
                      <span className="checkmark" />
                      <span className="terms-label-text">
                        I agree to YA KAVA&rsquo;s <Link to="/blog" target="_blank">Terms of Service</Link> and acknowledge instant digital delivery.
                      </span>
                    </label>
                  </div>

                  {error && (
                    <div role="alert" className="checkout-error-banner">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="yk-btn yk-btn-primary checkout-submit-btn"
                    disabled={processing}
                  >
                    <FaBolt />
                    {processing ? 'Processing Order...' : `Complete Payment • RWF ${momoAmount}`}
                  </button>

                  <div className="security-guarantee-row">
                    <div className="guarantee-item">
                      <FaShieldAlt /> 256-Bit SSL Encryption
                    </div>
                    <div className="guarantee-item">
                      <FaCheckCircle /> Instant Digital Access
                    </div>
                  </div>
                </form>
              </section>
            </div>

            {/* Right Column: Order Summary Sidebar */}
            <aside className="checkout-summary-column">
              <div className="summary-card glass-panel">
                <h3 className="summary-title">Order Summary</h3>

                <div className="summary-product-item">
                  <div className="product-thumb-wrap">
                    <img
                      src={product.image || '/Images/yakava1.png'}
                      alt={product.title}
                      className="product-thumb"
                      onError={(e) => { e.target.src = '/Images/yakava1.png' }}
                    />
                    <span className="product-qty-badge">{quantity}</span>
                  </div>

                  <div className="product-meta">
                    <h4 className="product-title">{product.title}</h4>
                    <span className="product-category-chip">{product.category}</span>
                    {product.instructor && (
                      <p className="product-instructor">By {product.instructor}</p>
                    )}
                  </div>
                </div>

                {/* Promo Code Form */}
                <div className="promo-code-container">
                  <form onSubmit={handleApplyPromo} className="promo-input-row">
                    <div className="promo-input-wrap">
                      <FaTag className="promo-icon" />
                      <input
                        type="text"
                        placeholder="Discount code (e.g. YAKAVA10)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="yk-input promo-input"
                        disabled={promoApplied}
                      />
                    </div>
                    <button
                      type="submit"
                      className="yk-btn yk-btn-secondary promo-apply-btn"
                      disabled={promoApplied || !promoCode.trim()}
                    >
                      {promoApplied ? 'Applied' : 'Apply'}
                    </button>
                  </form>

                  {promoApplied && (
                    <p className="promo-success-text">
                      <FaCheckCircle /> {promoDiscount}% discount code applied!
                    </p>
                  )}
                  {promoError && (
                    <p className="promo-error-text">{promoError}</p>
                  )}
                </div>

                {/* Pricing Calculation Breakdown */}
                <div className="pricing-breakdown">
                  <div className="calc-row">
                    <span>Retail Price:</span>
                    <span>RWF {Number(product.price * quantity).toFixed(2)}</span>
                  </div>

                  {product.discount > 0 && (
                    <div className="calc-row calc-row--discount">
                      <span>Store Promotion ({product.discount}%):</span>
                      <span>- RWF {(product.price * (product.discount / 100) * quantity).toFixed(2)}</span>
                    </div>
                  )}

                  {promoApplied && (
                    <div className="calc-row calc-row--discount">
                      <span>Promo Coupon ({promoDiscount}%):</span>
                      <span>- RWF {(baseDiscountedPrice * (promoDiscount / 100) * quantity).toFixed(2)}</span>
                    </div>
                  )}

                  <div className="calc-row">
                    <span>Estimated Tax & Delivery:</span>
                    <span className="tax-free-badge">FREE (Instant Digital)</span>
                  </div>

                  <div className="calc-divider" />

                  <div className="calc-row calc-row--total">
                    <span className="total-label">Total Due:</span>
                    <span className="total-val">RWF {momoAmount}</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="summary-trust-badges">
                  <div className="trust-badge">
                    <span className="trust-icon">🛡️</span>
                    <div>
                      <strong>Buyer Protection</strong>
                      <p>Verified creator product & direct support</p>
                    </div>
                  </div>
                  <div className="trust-badge">
                    <span className="trust-icon">⚡</span>
                    <div>
                      <strong>Instant Delivery</strong>
                      <p>Available on your personal shelf immediately</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
