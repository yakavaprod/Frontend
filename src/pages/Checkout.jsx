import { useState } from 'react'
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
  FaFileInvoiceDollar,
  FaDownload,
  FaPrint,
  FaCreditCard,
  FaExternalLinkAlt,
} from 'react-icons/fa'
import SimpleHeader from '../components/SimpleHeader.jsx'
import Footer from '../components/Footer.jsx'
import api from '../api.js'
import { formatMoney, sanitizeMoney, sanitizeMomoAmount, buildAirtelEcashUssd, toNumber } from '../utils/money.js'
import './Checkout.css'

const FALLBACK_IMAGE = '/Images/yakava1.png'

export default function Checkout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { product, quantity = 1, isDonation = false, customAmount: initialCustomAmount = 0 } = location.state || {}

  const [processing, setProcessing] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState(null)
  const [invoice, setInvoice] = useState(null)
  const [copiedUssd, setCopiedUssd] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('ecash')
  const [paymentProofFile, setPaymentProofFile] = useState(null)
  const [paymentProofDataUrl, setPaymentProofDataUrl] = useState('')
  const [customAmount, setCustomAmount] = useState(Number(initialCustomAmount) || 0)

  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoError, setPromoError] = useState('')

  const loggedInUser = JSON.parse(sessionStorage.getItem('user') || 'null')

  const [formData, setFormData] = useState(() => ({
    fullName: loggedInUser?.name || '',
    email: loggedInUser?.email || '',
    phone: loggedInUser?.phone || '',
    country: loggedInUser?.country || 'Rwanda',
    state: '',
    zip: '',
  }))

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

  const safeQuantity = Math.max(1, Number(quantity) || 1)
  const productUnitPrice = sanitizeMoney(toNumber(product?.price))
  const storeDiscount = Math.min(100, Math.max(0, toNumber(product?.discount)))
  const productBasePrice = productUnitPrice * (1 - storeDiscount / 100)
  const discountedPrice = promoApplied ? productBasePrice * (1 - promoDiscount / 100) : productBasePrice
  const totalAmount = isDonation ? sanitizeMoney(customAmount) : sanitizeMoney(discountedPrice * safeQuantity)
  const isFreeOrder = totalAmount <= 0 || productUnitPrice <= 0 || Boolean(product?.free)
  const momoAmount = sanitizeMomoAmount(totalAmount)
  const momoMerchantNumber = '0798653349'
  const momoUssdCode = `*182*1*1*${momoMerchantNumber}*${Number(momoAmount).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')}#`
  const airtelEcashMerchantNumber = '0728094581'
  const airtelEcashUssdCode = buildAirtelEcashUssd(totalAmount, airtelEcashMerchantNumber)
  const activePaymentMethod = isFreeOrder ? 'free' : selectedPaymentMethod
  const activeUssdCode = isFreeOrder ? '' : (selectedPaymentMethod === 'ecash' ? airtelEcashUssdCode : selectedPaymentMethod === 'momo' ? momoUssdCode : '')
  const activePaymentLabel = isFreeOrder ? 'Free Order' : (selectedPaymentMethod === 'selar' ? 'Selar International Card' : selectedPaymentMethod === 'ecash' ? 'Airtel eCash' : 'MTN Mobile Money')

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
      setPromoDiscount(Number(data.discountPercent || 0))
      setPromoError('')
    } catch (requestError) {
      setPromoApplied(false)
      setPromoDiscount(0)
      setPromoError(requestError.response?.data?.error || 'Invalid or expired coupon code for this product.')
    }
  }

  const handleCopyUssd = async () => {
    try {
      await navigator.clipboard.writeText(activeUssdCode)
      setCopiedUssd(true)
      setTimeout(() => setCopiedUssd(false), 2500)
    } catch {
      setCopiedUssd(false)
    }
  }

  const handlePaymentProofChange = (event) => {
    const file = event.target.files?.[0]
    setError('')
    if (!file) {
      setPaymentProofFile(null)
      setPaymentProofDataUrl('')
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Choose a PNG, JPG, or WebP screenshot of your successful payment.')
      event.target.value = ''
      setPaymentProofFile(null)
      setPaymentProofDataUrl('')
      return
    }
    if (file.size > 4 * 1024 * 1024) {
      setError('Your payment screenshot must be 4 MB or smaller.')
      event.target.value = ''
      setPaymentProofFile(null)
      setPaymentProofDataUrl('')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setPaymentProofFile(file)
      setPaymentProofDataUrl(String(reader.result || ''))
    }
    reader.onerror = () => setError('Unable to read the selected payment screenshot. Please choose it again.')
    reader.readAsDataURL(file)
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    if (isDonation && (!Number(customAmount) || Number(customAmount) <= 0)) {
      setError('Please enter a valid amount to continue with your donation.')
      return
    }
    if (!acceptedTerms) {
      setError('You must accept the terms and conditions before checkout.')
      return
    }
    if (!isFreeOrder && selectedPaymentMethod === 'selar' && (!paymentProofFile || !paymentProofDataUrl)) {
      setError('Complete your payment on Selar, then upload the payment success screenshot before submitting your order.')
      return
    }

    setError('')
    setProcessing(true)

    try {
      const payload = {
        items: [{
          productId: product?._id || 'donation',
          quantity: safeQuantity,
          unitPrice: Number((isDonation ? totalAmount : productBasePrice).toFixed(2)),
          currency: 'RWF',
        }],
        billing: {
          ...formData,
          country: formData.country || 'Rwanda',
        },
        promoCode: promoApplied ? promoCode.trim().toUpperCase() : '',
        amount: Number(totalAmount.toFixed(2)),
        total: Number(totalAmount.toFixed(2)),
        currency: 'RWF',
        paymentMethod: activePaymentMethod,
        ...(selectedPaymentMethod === 'selar' && !isFreeOrder ? {
          paymentProof: {
            dataUrl: paymentProofDataUrl,
            fileName: paymentProofFile.name,
          },
        } : {}),
        status: isFreeOrder ? 'paid' : 'pending',
        acceptTerms: true,
      }

      const { data } = await api.post('/orders', payload)
      const orderData = data.order || data
      const invoiceData = data.invoice || orderData?.invoice || data.invoices?.[0] || null

      setOrder({
        ...orderData,
        total: Number(orderData?.total ?? totalAmount),
        invoice: invoiceData,
      })
      setInvoice(invoiceData)

      if (!isFreeOrder && selectedPaymentMethod !== 'selar' && /Mobi|Android/i.test(navigator.userAgent)) {
        window.location.assign(`tel:${encodeURIComponent(activeUssdCode)}`)
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
    const orderAmount = Number(order.total ?? totalAmount)
    const orderStatusLabel = isFreeOrder || order.status === 'paid' ? 'Paid' : selectedPaymentMethod === 'selar' ? 'Pending payment review' : 'Pending confirmation'

    return (
      <div className="checkout-page">
        <SimpleHeader showBack={false} title="Order Confirmed" />
        <main className="checkout-success-wrap">
          <div className="success-card glass-panel">
            <div className="success-badge-glow">
              <FaCheckCircle className="success-badge-icon" />
            </div>

            <span className="eyebrow" style={{ color: 'var(--accent-emerald)' }}>
              {isFreeOrder ? 'Free Order Received' : 'Order Received'}
            </span>
            <h1 className="success-heading">Thank You For Your Order!</h1>
            <p className="success-sub">
              {isFreeOrder
                ? 'Your order was created successfully and access has been enabled without a payment gateway.'
                : selectedPaymentMethod === 'selar'
                  ? 'Your payment screenshot and order were submitted. We will review the proof and notify you when the payment is confirmed. Access is provided after verification.'
                  : 'Your order has been initiated. Complete the prompt on your phone or dial the payment code below to finalize payment.'}
            </p>

            {!isFreeOrder && selectedPaymentMethod === 'selar' && (
              <div className="selar-submission-notice">
                <FaCheckCircle />
                <div><strong>Payment proof received</strong><span>Your order stays pending until our team verifies your Selar payment.</span></div>
              </div>
            )}

            {!isFreeOrder && selectedPaymentMethod !== 'selar' && (
              <div className="ussd-highlight-box">
                <span className="ussd-label">{selectedPaymentMethod === 'ecash' ? 'Airtel eCash Quick Dial Code' : 'MTN MoMo Quick Dial Code'}</span>
                <div className="ussd-code-row">
                  <code className="ussd-text">{activeUssdCode}</code>
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
            )}

            <div className="order-summary-box">
              <div className="order-row">
                <span>Order Reference:</span>
                <strong className="order-ref">{order.orderNumber || order._id || 'N/A'}</strong>
              </div>
              <div className="order-row">
                <span>{isDonation ? 'Donation:' : 'Purchased Item:'}</span>
                <strong>{isDonation ? 'Tip / Donation' : product.title}</strong>
              </div>
              {!isDonation && (
                <div className="order-row">
                  <span>Quantity:</span>
                  <strong>{safeQuantity}</strong>
                </div>
              )}
              <div className="order-row">
                <span>Status:</span>
                <strong>{orderStatusLabel}</strong>
              </div>
              <div className="order-row">
                <span>Total Amount:</span>
                <strong className="order-total-rwf">{formatMoney(orderAmount, 'RWF', 'en-US')}</strong>
              </div>
              <div className="order-row">
                <span>Payment Method:</span>
                <span className={`momo-pill ${selectedPaymentMethod === 'ecash' ? 'momo-pill--ecash' : ''}`}>{activePaymentLabel}</span>
              </div>
            </div>

            {invoice && (
              <div className="invoice-card">
                <div className="invoice-header-row">
                  <span className="invoice-badge"><FaFileInvoiceDollar /> Invoice</span>
                  <span className="invoice-id">#{invoice.number || invoice.invoiceNumber || order.orderNumber || 'INV'}</span>
                </div>

                <div className="invoice-summary-grid">
                  <div>
                    <span className="invoice-label">Customer</span>
                    <strong>{formData.fullName}</strong>
                  </div>
                  <div>
                    <span className="invoice-label">Amount</span>
                    <strong>{formatMoney(orderAmount, 'RWF', 'en-US')}</strong>
                  </div>
                  <div>
                    <span className="invoice-label">Issued</span>
                    <strong>{invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : 'Today'}</strong>
                  </div>
                  <div>
                    <span className="invoice-label">Status</span>
                    <strong>{invoice.status || orderStatusLabel}</strong>
                  </div>
                </div>

                <div className="invoice-actions">
                  {invoice.downloadUrl && (
                    <a href={invoice.downloadUrl} target="_blank" rel="noreferrer" className="yk-btn yk-btn-primary yk-btn-sm">
                      <FaDownload /> Download
                    </a>
                  )}
                  {invoice.url && (
                    <a href={invoice.url} target="_blank" rel="noreferrer" className="yk-btn yk-btn-secondary yk-btn-sm">
                      <FaPrint /> View
                    </a>
                  )}
                  <button type="button" className="yk-btn yk-btn-ghost yk-btn-sm" onClick={() => window.print()}>
                    <FaPrint /> Print
                  </button>
                </div>
              </div>
            )}

            <div className="next-steps-card">
              <h3>What Happens Next?</h3>
              <ul>
                {!isFreeOrder && selectedPaymentMethod !== 'selar' && (
                  <li>
                    <FaCheckCircle className="step-icon" />
                    <span>{selectedPaymentMethod === 'ecash' ? 'Approve the Airtel Money prompt or dial the eCash USSD code.' : 'Accept the MoMo prompt on your phone or dial the USSD code.'}</span>
                  </li>
                )}
                <li>
                  <FaCheckCircle className="step-icon" />
                    <span>{selectedPaymentMethod === 'selar' ? <>Access to <strong>{product.title}</strong> will be enabled after payment verification.</> : <>Digital access to <strong>{product.title}</strong> is immediately attached to your Library.</>}</span>
                </li>
                <li>
                  <FaCheckCircle className="step-icon" />
                    <span>{selectedPaymentMethod === 'selar' ? 'Your payment screenshot is securely attached to this order for review.' : 'A copy of your receipt has been recorded for your account.'}</span>
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
              <span className="step-text">3. {selectedPaymentMethod === 'selar' && !isFreeOrder ? 'Payment Review' : 'Instant Access'}</span>
            </div>
          </div>

          <div className="checkout-grid">
            <div className="checkout-form-column">
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
                        placeholder="Enter your full name"
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
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label className="yk-label" htmlFor="phone">{selectedPaymentMethod === 'selar' ? 'Phone Number (optional)' : 'Phone Number (MTN MoMo)'}</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="yk-input"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={selectedPaymentMethod === 'selar' ? 'Optional for international card payment' : 'Enter your phone number'}
                        required={!isFreeOrder && selectedPaymentMethod !== 'selar'}
                        disabled={isFreeOrder}
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
                        placeholder="Enter your country"
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
                        placeholder="Enter your city or district"
                      />
                    </div>
                  </div>

                  {isDonation && (
                    <div className="form-field" style={{ marginTop: '1rem' }}>
                      <label className="yk-label" htmlFor="donationAmount">Donation Amount (RWF)</label>
                      <input
                        type="number"
                        id="donationAmount"
                        className="yk-input"
                        min="100"
                        step="100"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(Number(e.target.value) || 0)}
                        placeholder="Enter amount to pay in RWF"
                        required
                      />
                    </div>
                  )}

                  <div className="payment-method-block">
                    <div className="section-header-row" style={{ marginTop: '2rem' }}>
                      <h2 className="section-title-sm">2. Payment Method</h2>
                      <span className="payment-security-tag"><FaLock /> Instant Verification</span>
                    </div>

                    <div className="payment-cards-selector">
                      <label className={`payment-method-card ${selectedPaymentMethod === 'ecash' ? 'payment-method-card--active payment-method-card--ecash' : ''}`}>
                        <input
                          type="radio"
                          name="paymentOption"
                          checked={selectedPaymentMethod === 'ecash'}
                          onChange={() => setSelectedPaymentMethod('ecash')}
                        />
                        <div className="method-indicator" />
                        <div className="method-details">
                          <div className="method-title-row">
                            <span className="method-name">Airtel eCash</span>
                            <span className="momo-chip momo-chip--ecash">Airtel Money</span>
                          </div>
                          <p className="method-desc">
                            {isFreeOrder
                              ? 'This purchase qualifies for a free checkout and will be processed without a payment gateway.'
                              : 'Pay instantly via Airtel Money using the eCash USSD format.'}
                          </p>
                        </div>
                        {!isFreeOrder && <FaMobileAlt className="method-icon method-icon--ecash" />}
                      </label>

                      <label className={`payment-method-card ${selectedPaymentMethod === 'momo' ? 'payment-method-card--active' : ''}`}>
                        <input
                          type="radio"
                          name="paymentOption"
                          checked={selectedPaymentMethod === 'momo'}
                          onChange={() => setSelectedPaymentMethod('momo')}
                        />
                        <div className="method-indicator" />
                        <div className="method-details">
                          <div className="method-title-row">
                            <span className="method-name">MTN Mobile Money</span>
                            <span className="momo-chip">MTN MoMo</span>
                          </div>
                          <p className="method-desc">Pay via the standard MTN MoMo prompt and USSD flow.</p>
                        </div>
                        <FaMobileAlt className="method-icon" />
                      </label>

                      <label className={`payment-method-card payment-method-card--selar ${selectedPaymentMethod === 'selar' ? 'payment-method-card--active' : ''}`}>
                        <input
                          type="radio"
                          name="paymentOption"
                          checked={selectedPaymentMethod === 'selar'}
                          onChange={() => setSelectedPaymentMethod('selar')}
                        />
                        <div className="method-indicator" />
                        <div className="method-details">
                          <div className="method-title-row">
                            <span className="method-name">International Card</span>
                            <span className="selar-chip">Selar</span>
                          </div>
                          <p className="method-desc">Pay on Selar using your currency and an available card, then submit your payment screenshot for review.</p>
                        </div>
                        <FaCreditCard className="method-icon method-icon--selar" />
                      </label>
                    </div>

                    {!isFreeOrder && selectedPaymentMethod === 'selar' && (
                      <div className="selar-instructions-card">
                        <div className="selar-instructions-heading">
                          <span className="selar-chip">International payment</span>
                          <span>Manual confirmation required</span>
                        </div>
                        <ol className="selar-payment-steps">
                          <li><span>1</span><div><strong>Open Selar payment</strong><small>Choose the currency you want to pay with on the Selar page.</small></div></li>
                          <li><span>2</span><div><strong>Select card payment</strong><small>Choose Card and complete the payment on Selar.</small></div></li>
                          <li><span>3</span><div><strong>Save your success screen</strong><small>Return here and upload a screenshot showing the successful payment.</small></div></li>
                        </ol>
                        <a className="yk-btn yk-btn-primary selar-open-button" href="https://selar.com/showlove/yakavaprod" target="_blank" rel="noopener noreferrer">
                          <FaExternalLinkAlt /> Open Selar payment
                        </a>
                        <div className="selar-proof-upload">
                          <label className="yk-label" htmlFor="payment-proof">Payment success screenshot</label>
                          <input id="payment-proof" type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePaymentProofChange} required />
                          <small>Upload PNG, JPG, or WebP, up to 4 MB. Your order remains pending until an admin verifies the proof.</small>
                          {paymentProofFile && <span className="selar-proof-selected"><FaCheckCircle /> {paymentProofFile.name}</span>}
                        </div>
                      </div>
                    )}

                    {!isFreeOrder && selectedPaymentMethod !== 'selar' && (
                      <div className="momo-instructions-card">
                        <div className="momo-header">
                          <span className="momo-tag">{selectedPaymentMethod === 'ecash' ? 'Airtel eCash Direct' : 'MTN MoMo Direct'}</span>
                          <span className="momo-merchant">{selectedPaymentMethod === 'ecash' ? 'Merchant: 0728094581' : `Merchant ID: ${momoMerchantNumber}`}</span>
                        </div>

                        <p className="momo-text">
                          Clicking <strong>&ldquo;Complete Payment & Access&rdquo;</strong> will register your order and open your phone dialer with this exact code:
                        </p>

                        <div className="ussd-interactive-bar">
                          <code className="ussd-pill">{activeUssdCode}</code>
                          <div className="ussd-btn-group">
                            <button
                              type="button"
                              onClick={handleCopyUssd}
                              className="yk-btn yk-btn-secondary yk-btn-sm"
                            >
                              <FaCopy /> {copiedUssd ? 'Copied!' : 'Copy'}
                            </button>
                            <a
                              href={`tel:${encodeURIComponent(activeUssdCode)}`}
                              className="yk-btn yk-btn-primary yk-btn-sm"
                            >
                              <FaPhoneAlt /> Call Code
                            </a>
                          </div>
                        </div>

                        <div className="momo-steps-list">
                          <div className="mini-step">
                            <span className="mini-step-num">1</span>
                            <span>Submit order or dial the code above</span>
                          </div>
                          <div className="mini-step">
                            <span className="mini-step-num">2</span>
                            <span>{selectedPaymentMethod === 'ecash' ? 'Enter your Airtel Money PIN' : 'Input your MoMo secret PIN'}</span>
                          </div>
                          <div className="mini-step">
                            <span className="mini-step-num">3</span>
                            <span>Confirmation SMS received instantly</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="checkout-terms-row">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        required
                      />
                      <span className="checkmark" />
                      <span className="terms-label-text">
                        I agree to YA KAVA&rsquo;s <Link to="/terms-of-use" target="_blank" rel="noreferrer">Terms &amp; Conditions</Link> and acknowledge instant digital delivery.
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
                    {processing ? 'Processing Order...' : isFreeOrder ? 'Complete Free Order' : selectedPaymentMethod === 'selar' ? `Submit Payment Proof • ${formatMoney(totalAmount, 'RWF', 'en-US')}` : `Complete Payment • ${formatMoney(totalAmount, 'RWF', 'en-US')}`}
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

            <aside className="checkout-summary-column">
              <div className="summary-card glass-panel">
                <h3 className="summary-title">Order Summary</h3>

                <div className="summary-product-item">
                  <div className="product-thumb-wrap">
                    <img
                      src={product.image || FALLBACK_IMAGE}
                      alt={product.title}
                      className="product-thumb"
                      onError={(e) => { e.target.src = FALLBACK_IMAGE }}
                    />
                    <span className="product-qty-badge">{safeQuantity}</span>
                  </div>

                  <div className="product-meta">
                    <h4 className="product-title">{product.title}</h4>
                    <span className="product-category-chip">{product.category}</span>
                    {product.instructor && (
                      <p className="product-instructor">By {product.instructor}</p>
                    )}
                  </div>
                </div>

                <div className="promo-code-container">
                  <form onSubmit={handleApplyPromo} className="promo-input-row">
                    <div className="promo-input-wrap">
                      <FaTag className="promo-icon" />
                      <input
                        type="text"
                        placeholder="Enter discount code"
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

                <div className="pricing-breakdown">
                  <div className="calc-row">
                    <span>Retail Price:</span>
                    <span>{formatMoney(productUnitPrice * safeQuantity, 'RWF', 'en-US')}</span>
                  </div>

                  {storeDiscount > 0 && (
                    <div className="calc-row calc-row--discount">
                      <span>Store Promotion ({storeDiscount}%):</span>
                      <span>- {formatMoney(productUnitPrice * (storeDiscount / 100) * safeQuantity, 'RWF', 'en-US')}</span>
                    </div>
                  )}

                  {promoApplied && (
                    <div className="calc-row calc-row--discount">
                      <span>Promo Coupon ({promoDiscount}%):</span>
                      <span>- {formatMoney(productBasePrice * (promoDiscount / 100) * safeQuantity, 'RWF', 'en-US')}</span>
                    </div>
                  )}

                  <div className="calc-row">
                    <span>Estimated Tax & Delivery:</span>
                    <span className="tax-free-badge">FREE (Instant Digital)</span>
                  </div>

                  <div className="calc-divider" />

                  <div className="calc-row calc-row--total">
                    <span className="total-label">Total Due:</span>
                    <span className="total-val">{formatMoney(totalAmount, 'RWF', 'en-US')}</span>
                  </div>
                </div>

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
