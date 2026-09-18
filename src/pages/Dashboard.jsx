import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaHeart,
  FaPlay,
  FaCheckCircle,
  FaChevronRight,
  FaArrowRight,
  FaReceipt,
  FaUserCircle,
  FaCompactDisc,
} from 'react-icons/fa'
import DashboardHeader from '../components/DashboardHeader.jsx'
import Footer from '../components/Footer.jsx'
import api, { clearSession } from '../api.js'
import './Dashboard.css'

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=500&h=300&fit=crop'
const firstName = (name) => (name || '').split(' ')[0]
const formatDate = (isoDate) => isoDate
  ? new Date(isoDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
  : ''

export default function Dashboard() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [customer, setCustomer] = useState(null)
  const [library, setLibrary] = useState([])
  const [orders, setOrders] = useState([])
  const [recommended, setRecommended] = useState([])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api.get('/dashboard')
      .then(({ data }) => {
        if (cancelled) return
        setCustomer(data.user)
        setLibrary(data.library || [])
        setOrders(data.orders || [])
        const ownedIds = new Set((data.library || []).map((item) => item._id))
        return api.get('/products').then(({ data: allProducts }) => {
          if (cancelled) return
          setRecommended(allProducts.filter((p) => !ownedIds.has(p._id)).slice(0, 2))
        })
      })
      .catch((requestError) => {
        if (cancelled) return
        if (requestError.response?.status === 401) { navigate('/login'); return }
        setError(requestError.response?.data?.error || 'Unable to load your dashboard right now.')
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [navigate])

  const lifetimeSpend = useMemo(
    () => orders.filter((o) => o.status === 'paid').reduce((sum, o) => sum + Number(o.total || 0), 0).toFixed(2),
    [orders]
  )

  const continueItem = library[0]
  const paidProductIds = useMemo(() => new Set(
    orders.filter((order) => order.status === 'paid').flatMap((order) => order.items.map((item) => String(item.product)))
  ), [orders])
  const pendingProductIds = useMemo(() => new Set(
    orders.filter((order) => order.status === 'pending').flatMap((order) => order.items.map((item) => String(item.product)))
  ), [orders])

  const shelfItems = useMemo(() => {
    if (!search.trim()) return library
    const q = search.toLowerCase()
    return library.filter(
      (i) => i.title.toLowerCase().includes(q) || (i.instructor || '').toLowerCase().includes(q)
    )
  }, [library, search])

  const handleLogout = () => {
    clearSession()
    navigate('/login')
  }

  const handleSearchChange = (value) => {
    setSearch(value)
  }

  if (loading) {
    return (
      <div className="dashboard">
        <DashboardHeader customer={{ name: '', memberSince: '', initial: '' }} onLogout={handleLogout} />
        <div className="dash-container">
          <p>Loading your dashboard…</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard">
        <DashboardHeader customer={{ name: '', memberSince: '', initial: '' }} onLogout={handleLogout} />
        <div className="dash-container">
          <p role="alert">{error}</p>
        </div>
        <Footer />
      </div>
    )
  }

  const headerCustomer = {
    name: customer?.name || '',
    memberSince: formatDate(customer?.memberSince),
    initial: (customer?.name || '?').charAt(0).toUpperCase(),
    verified: Boolean(customer?.verified || customer?.name?.trim().toUpperCase() === 'YA KAVA'),
    avatarUrl: customer?.avatarUrl || '',
  }

  return (
    <div className="dashboard">
      <DashboardHeader customer={headerCustomer} search={search} onSearchChange={handleSearchChange} onLogout={handleLogout} />

      <div className="dash-container">
        {/* Role-Specific Banner: Admin / Creator */}
        {customer?.role === 'admin' && (
          <div className="glass-panel" style={{
            padding: '1.4rem 1.8rem',
            marginBottom: '2rem',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.12) 0%, rgba(13, 27, 45, 0.9) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div>
              <span className="role-badge role-badge--admin" style={{ marginBottom: '0.4rem' }}>
                Administrator Mode
              </span>
              <h3 style={{ margin: '0.2rem 0', color: 'var(--white)', fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>
                System Administration Active
              </h3>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.88rem' }}>
                You have full access to product management, customer orders, user accounts, and reel drops.
              </p>
            </div>
            <button onClick={() => navigate('/admin')} className="yk-btn yk-btn-primary">
              Open Admin Console <FaArrowRight />
            </button>
          </div>
        )}

        {customer?.role === 'creator' && (
          <div className="glass-panel" style={{
            padding: '1.4rem 1.8rem',
            marginBottom: '2rem',
            border: '1px solid rgba(111, 124, 255, 0.4)',
            background: 'linear-gradient(135deg, rgba(111, 124, 255, 0.14) 0%, rgba(13, 27, 45, 0.9) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div>
              <span className="role-badge role-badge--creator" style={{ marginBottom: '0.4rem' }}>
                Creator Studio
              </span>
              <h3 style={{ margin: '0.2rem 0', color: 'var(--white)', fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>
                Professional Creator Workspace
              </h3>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.88rem' }}>
                Publish masterclasses, upload sound packs, and track your creative portfolio.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => navigate('/reels')} className="yk-btn yk-btn-secondary">
                <FaCompactDisc /> View Reels
              </button>
              <button onClick={() => navigate('/products')} className="yk-btn yk-btn-primary">
                Browse Marketplace <FaArrowRight />
              </button>
            </div>
          </div>
        )}

        {/* Welcome + ledger */}
        <section className="welcome-row">
          <div className="welcome-text">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
              <p className="eyebrow" style={{ margin: 0 }}>Welcome back</p>
              <span className={`role-badge role-badge--${customer?.role || 'customer'}`}>
                {customer?.role || 'customer'}
              </span>
            </div>
            <h1>{firstName(customer?.name)}&rsquo;s Library</h1>
            <p className="welcome-sub">Member since {headerCustomer.memberSince}</p>
          </div>

          <dl className="ledger-stats">
            <div className="ledger-stat">
              <dt>In library</dt>
              <dd>{library.length}</dd>
            </div>
            <div className="ledger-stat">
              <dt>Orders</dt>
              <dd>{orders.length}</dd>
            </div>
            <div className="ledger-stat">
              <dt>Paid orders</dt>
              <dd>{orders.filter((o) => o.status === 'paid').length}</dd>
            </div>
            <div className="ledger-stat">
              <dt>Lifetime spend</dt>
              <dd>RWF {lifetimeSpend}</dd>
            </div>
          </dl>
        </section>

        {/* Continue learning */}
        {continueItem && (
          <section className="continue-section">
            <article className="continue-card">
              <div className="continue-image">
                <img src={continueItem.image || PLACEHOLDER_IMAGE} alt={continueItem.title} />
              </div>
              <div className="continue-content">
                <span className="continue-eyebrow">Most recently added</span>
                <h2>{continueItem.title}</h2>
                {continueItem.instructor && <p className="continue-instructor">{continueItem.instructor}</p>}

                <button className="resume-btn" onClick={() => navigate(`/product/${continueItem._id}`)}>
                  <FaPlay /> Open
                </button>
              </div>
            </article>
          </section>
        )}

        {/* Shelf of owned items */}
        <section className="shelf-section">
          <div className="section-head">
            <h2>Your Shelf</h2>
            <Link to="/products" className="text-link">
              Browse more <FaChevronRight />
            </Link>
          </div>

          {library.length === 0 ? (
            <div className="empty-state">Your library is empty. Browse the marketplace to get started.</div>
          ) : shelfItems.length === 0 ? (
            <div className="empty-state">Nothing matches &ldquo;{search}&rdquo; in your library.</div>
          ) : (
            <div className="shelf">
              <div className="shelf-row">
                {shelfItems.map((item) => (
                  <button
                    key={item._id}
                    className={`spine spine-${item.category}`}
                    onClick={() => navigate(`/product/${item._id}`)}
                  >
                    <span className="spine-ribbon">
                      <FaCheckCircle />
                    </span>
                    <span className="spine-type">{item.category}</span>
                    <span className="spine-title">{item.title}</span>
                    {item.instructor && <span className="spine-instructor">{item.instructor}</span>}
                    <span className="shelf-status-pill">
                      {paidProductIds.has(String(item._id)) ? 'Owned' : pendingProductIds.has(String(item._id)) ? 'Pending' : 'Preview'}
                    </span>
                  </button>
                ))}
              </div>
              <div className="shelf-ledge" aria-hidden="true" />
            </div>
          )}
        </section>

        {/* Order history */}
        <section className="orders-section">
          <div className="section-head">
            <h2>Order History</h2>
            <span className="text-link muted">
              <FaReceipt /> {orders.length} orders
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="empty-state">No orders yet.</div>
          ) : (
            <div className="orders-table">
              <div className="orders-row orders-head">
                <span>Order</span>
                <span>Item</span>
                <span>Date</span>
                <span>Amount</span>
                <span>Status</span>
              </div>
              {orders.map((order) => (
                <div className="orders-row" key={order._id}>
                  <span className="mono">{order.orderNumber}</span>
                  <span className="orders-item">{order.items.map((i) => i.title).join(', ')}</span>
                  <span>{formatDate(order.createdAt)}</span>
                  <span className="mono">RWF {Number(order.total || 0).toFixed(2)}</span>
                  <span className={`status-pill status-${order.status}`}>
                    {order.status === 'pending' ? 'Pending' : order.status === 'paid' ? 'Paid' : order.status === 'cancelled' ? 'Cancelled' : order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recommended */}
        {recommended.length > 0 && (
          <section className="recommend-section">
            <div className="section-head">
              <h2>Picked For You</h2>
              <Link to="/products" className="text-link">
                See all <FaChevronRight />
              </Link>
            </div>

            <div className="recommend-grid">
              {recommended.map((product) => (
                <Link
                  className="rec-card"
                  key={product._id}
                  to={`/product/${product._id}`}
                  aria-label={`View ${product.title}`}
                >
                  <div className="rec-image">
                    <img src={product.image || PLACEHOLDER_IMAGE} alt={product.title} />
                  </div>
                  <div className="rec-body">
                    <span className="rec-category">{product.category}</span>
                    <h3>{product.title}</h3>
                    {product.instructor && <p className="rec-instructor">{product.instructor}</p>}
                    <div className="rec-footer">
                      <span className="rec-price">RWF {Number(product.price || 0).toFixed(2)}</span>
                      <span className="rec-cta">
                        View <FaArrowRight />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Account */}
        <section className="account-section" id="account-settings">
          <div className="account-card">
            <FaCompactDisc className="account-icon" />
            <div className="account-copy">
              <h3>Reels</h3>
              <p>Scroll through the latest video updates, drops and announcements.</p>
            </div>
              <button className="ghost-btn" onClick={() => navigate('/reels')}>
              Watch now <FaArrowRight />
            </button>
          </div>

          <div className="account-card">
            <FaUserCircle className="account-icon" />
            <div className="account-copy">
              <h3>Account settings</h3>
              <p>Update your profile, payment methods and notification preferences.</p>
            </div>
            <button className="ghost-btn" onClick={() => navigate('/settings')}>
              Manage <FaArrowRight />
            </button>
          </div>

          <div className="account-card">
            <FaHeart className="account-icon" />
            <div className="account-copy">
              <h3>Saved for later</h3>
              <p>Items you&rsquo;ve bookmarked to purchase another time.</p>
            </div>
            <button className="ghost-btn">
              View wishlist <FaArrowRight />
            </button>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}