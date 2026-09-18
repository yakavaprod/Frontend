import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaStar, FaShoppingCart, FaCheckCircle, FaClock, FaLock, FaDownload } from 'react-icons/fa'
import SimpleHeader from '../components/SimpleHeader.jsx'
import Footer from '../components/Footer.jsx'
import api from '../api.js'
import './ProductDetail.css'

export default function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [userOrders, setUserOrders] = useState([])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    api.get(`/products/${productId}`)
      .then(({ data }) => { if (!cancelled) setProduct(data) })
      .catch(() => { if (!cancelled) setNotFound(true) })
      .finally(() => { if (!cancelled) setLoading(false) })

    const token = sessionStorage.getItem('accessToken')
    if (!token) {
      if (!cancelled) setUserOrders([])
      return () => { cancelled = true }
    }

    api.get('/orders')
      .then(({ data }) => { if (!cancelled) setUserOrders(data || []) })
      .catch(() => { if (!cancelled) setUserOrders([]) })

    return () => { cancelled = true }
  }, [productId])

  const accessState = useMemo(() => {
    if (!product?._id) return 'locked'
    const matchingOrder = userOrders.find((order) => order.items?.some((item) => String(item.product) === String(product._id)))
    if (matchingOrder?.status === 'paid') return 'paid'
    if (matchingOrder?.status === 'pending') return 'pending'
    return 'locked'
  }, [product, userOrders])

  const isUnlocked = accessState === 'paid'
  const isPending = accessState === 'pending'
  const isCourse = product?.category === 'courses'
  const publicVideoUrl = isCourse ? (product?.trailerUrl || product?.videoUrl || '') : (product?.videoUrl || '')
  const lockedVideoUrl = isCourse ? (product?.videoUrl || '') : ''
  const downloadUrl = product?.downloadUrl || ''

  if (loading) {
    return (
      <>
        <SimpleHeader showBack={true} />
        <div className="product-detail">
          <div className="not-found">
            <h2>Loading product…</h2>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (notFound || !product) {
    return (
      <>
        <SimpleHeader showBack={true} />
        <div className="product-detail">
          <div className="not-found">
            <h2>Product not found</h2>
            <button onClick={() => navigate('/products')} className="back-btn">
              <FaArrowLeft /> Back to Products
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const reviews = product.reviews || []
  const rating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null

  const handleBuyNow = () => {
    navigate('/checkout', { state: { product, quantity } })
  }

  const handleAccessAction = () => {
    if (isUnlocked) {
      if (isCourse && product.videoUrl) {
        window.open(product.videoUrl, '_blank', 'noopener,noreferrer')
      } else if (!isCourse && downloadUrl) {
        window.open(downloadUrl, '_blank', 'noopener,noreferrer')
      } else if (product.image) {
        window.open(product.image, '_blank', 'noopener,noreferrer')
      }
      return
    }

    if (isPending) return
    navigate('/checkout', { state: { product, quantity } })
  }

  const discountedPrice = product.price * (1 - (product.discount || 0) / 100)

  const handleAddToCart = async () => {
    try {
      await api.post('/cart/items', { productId: product._id, quantity })
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    } catch {
      // silently ignore - user may need to log in
      navigate('/login')
    }
  }

  return (
    <>
      <SimpleHeader showBack={true} />
      <div className="product-detail">
      <div className="detail-container">
        {/* Video Section */}
        {(publicVideoUrl || (isCourse && lockedVideoUrl)) && (
          <section className="video-section">
            <div className={`video-wrapper ${isCourse && !isUnlocked && lockedVideoUrl ? 'video-locked' : ''}`}>
              {isCourse && !isUnlocked && lockedVideoUrl ? (
                <div className="video-lock-overlay">
                  <div className="video-lock-card">
                    <FaLock />
                    <h3>{isPending ? 'Order submitted' : 'Unlock full course'}</h3>
                    <p>
                      {isPending
                        ? 'This order is still awaiting admin confirmation before the paid course content is enabled.'
                        : 'The public trailer is free to watch. Buy the course to unlock the full lesson video.'}
                    </p>
                  </div>
                </div>
              ) : (
                <iframe
                  width="100%"
                  height="600"
                  src={publicVideoUrl || lockedVideoUrl}
                  title="Product Preview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </section>
        )}

        {/* Main Content */}
        <div className="detail-content">
          {/* Left Column - Description */}
          <section className="description-section">
            <div className="product-header">
              <h1>{product.title}</h1>
              <div className="category-badge">{product.category}</div>
            </div>

            <div className="product-access-badges">
              {isCourse ? (
                <span className={`access-badge ${isUnlocked ? 'access-badge--paid' : 'access-badge--trailer'}`}>
                  {isUnlocked ? 'Full course access unlocked' : 'Free trailer preview'}
                </span>
              ) : (
                <span className={`access-badge ${isUnlocked ? 'access-badge--paid' : 'access-badge--locked'}`}>
                  {isUnlocked ? 'Owned asset' : 'Catalog preview'}
                </span>
              )}
              {isPending && <span className="access-badge access-badge--pending">Payment pending confirmation</span>}
            </div>

            {/* Rating and Stats */}
            <div className="rating-section">
              {rating !== null && (
                <div className="rating-display">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className="star"
                        style={{ color: i < Math.round(rating) ? '#fbbf24' : '#e5e7eb' }}
                      />
                    ))}
                  </div>
                  <span className="rating-text">{rating.toFixed(1)}</span>
                  <span className="reviews-count">({reviews.length} reviews)</span>
                </div>
              )}

              {product.duration && (
                <div className="stats-display">
                  <div className="stat">
                    <FaClock />
                    <span>{product.duration}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Instructor Info */}
            {product.instructor && (
              <div className="instructor-info">
                <h3>Instructor</h3>
                <p>{product.instructor}</p>
              </div>
            )}

            {/* Full Description */}
            <div className="full-description">
              <h2>About this {product.category}</h2>
              <div className="description-text">
                {product.description.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Reviews */}
            {reviews.length > 0 && (
              <div className="testimonials-section">
                <h2>Customer Reviews</h2>
                <div className="testimonials">
                  {reviews.map((review) => (
                    <div key={review._id} className="testimonial">
                      <div className="testimonial-header">
                        <div className="testimonial-rating">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className="star"
                              style={{ color: i < review.rating ? '#fbbf24' : '#e5e7eb' }}
                            />
                          ))}
                        </div>
                        <h4>{review.user?.name || 'Anonymous'}</h4>
                      </div>
                      <p>{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Right Column - Purchase Section */}
          <section className="purchase-section">
            <div className="purchase-card">
              <div className={product.discount ? 'price-display price-display--discounted' : 'price-display'}>
                {product.discount > 0 && <s className="original-price">RWF {product.price.toFixed(2)}</s>}
                <span className="currency">RWF</span>
                <span className="amount">{discountedPrice.toFixed(2)}</span>
              </div>

              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="qty-btn"
                  >
                    −
                  </button>
                  <input type="number" value={quantity} readOnly className="qty-input" />
                  <button onClick={() => setQuantity(quantity + 1)} className="qty-btn">
                    +
                  </button>
                </div>
              </div>

              <div className="total-price">
                <span>Total:</span>
                <span className="total">RWF {(discountedPrice * quantity).toFixed(2)}</span>
              </div>

              {isCourse && !isUnlocked && (
                <div className={`access-status ${isPending ? 'access-status--pending' : 'access-status--locked'}`}>
                  {isPending ? <FaClock /> : <FaLock />}
                  <span>
                    {isPending ? 'Order submitted — waiting for admin confirmation' : 'Trailer is free. Full course unlocks after payment.'}
                  </span>
                </div>
              )}

              {!isCourse && !isUnlocked && (
                <div className={`access-status ${isPending ? 'access-status--pending' : 'access-status--locked'}`}>
                  {isPending ? <FaClock /> : <FaLock />}
                  <span>
                    {isPending ? 'Order submitted — waiting for admin confirmation' : 'Download and access are locked until payment is confirmed'}
                  </span>
                </div>
              )}

              {isUnlocked && (
                <button className="buy-btn unlocked-btn" onClick={handleAccessAction}>
                  <FaDownload /> {isCourse ? 'Watch full course' : 'Download asset'}
                </button>
              )}

              {!isUnlocked && (
                <button className="buy-btn" onClick={handleAccessAction}>
                  <FaShoppingCart /> {isPending ? 'Awaiting confirmation' : 'Buy Now'}
                </button>
              )}

              <button
                className={`cart-btn ${addedToCart ? 'added' : ''}`}
                onClick={handleAddToCart}
              >
                {addedToCart ? (
                  <>
                    <FaCheckCircle /> Added to Cart
                  </>
                ) : (
                  <>
                    <FaShoppingCart /> Add to Cart
                  </>
                )}
              </button>

              {/* Features List */}
              <div className="features-list">
                <h3>What you get:</h3>
                <ul>
                  {product.category === 'courses' ? (
                    <>
                      <li>✓ Lifetime access to all materials</li>
                      <li>✓ Certificate of completion</li>
                      <li>✓ Community access</li>
                      <li>✓ Regular updates included</li>
                      <li>✓ Money-back guarantee (30 days)</li>
                    </>
                  ) : (
                    <>
                      <li>✓ Instant download access</li>
                      <li>✓ Regular updates included</li>
                      <li>✓ Free customer support</li>
                      <li>✓ 30-day money-back guarantee</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Security Badge */}
              <div className="security-badge">
                <p>🔒 Secure checkout • 30-day refund guarantee</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      </div>
      <Footer />
    </>
  )
}