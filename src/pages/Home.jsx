import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaArrowRight,
  FaBolt,
  FaCheckCircle,
  FaDiscord,
  FaGraduationCap,
  FaLaptopCode,
  FaMoneyBillWave,
  FaPlay,
  FaShieldAlt,
  FaShoppingBag,
  FaStar,
} from 'react-icons/fa'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import MobileApp from '../components/MobileApp.jsx'
import Footer from '../components/Footer.jsx'
import Testimonials from '../components/Testimonials.jsx'
import api from '../api.js'

const WORKFLOW_STEPS = [
  {
    id: '01',
    icon: <FaGraduationCap />,
    title: 'Master Real-World Creative Skills',
    tag: 'Creator Academy',
    desc: 'Bite-sized, high-yield masterclasses designed by working producers, designers, and software creators. Zero fluff, 100% practical results.',
    highlights: ['Production templates included', 'Direct instructor Q&A', 'Self-paced lifetime access'],
  },
  {
    id: '02',
    icon: <FaShoppingBag />,
    title: 'Curated Digital Marketplace',
    tag: 'E-Commerce Layer',
    desc: 'Purchase verified sound kits, Lightroom presets, UI kits, and production stems built for high-performance creative output.',
    highlights: ['Instant download on payment', '100% royalty-free commercial use', 'Tested for FL Studio, Ableton, Logic'],
  },
  {
    id: '03',
    icon: <FaMoneyBillWave />,
    title: 'Instant Rwandan MoMo Monetization',
    tag: 'Frictionless Payments',
    desc: 'Turn your creativity into steady revenue. Creators can list assets and receive direct payouts via MTN Mobile Money without bank delays.',
    highlights: ['RWF native pricing', 'One-touch USSD checkout', 'Real-time sales tracking & ledger'],
  },
  {
    id: '04',
    icon: <FaDiscord />,
    title: 'Discord VIP Collaborative Network',
    tag: 'Creator Collective',
    desc: 'Join our verified Discord ecosystem where musicians, videographers, and tech creators share feedback, collaborate on tracks, and hire talent.',
    highlights: ['Weekly beat battles & feedback', 'Co-producer matching', 'Exclusive asset giveaways'],
  },
]

export default function Home() {
  const navigate = useNavigate()
  const [activeWorkflow, setActiveWorkflow] = useState(0)
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loadingProducts, setLoadingProducts] = useState(true)

  useEffect(() => {
    let isCancelled = false
    api.get('/products')
      .then(({ data }) => {
        if (!isCancelled) setProducts(data.slice(0, 6))
      })
      .catch(() => {
        // graceful fallback
      })
      .finally(() => {
        if (!isCancelled) setLoadingProducts(false)
      })
    return () => { isCancelled = true }
  }, [])

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((p) => p.category === selectedCategory)

  return (
    <div className="home-layout">
      <Navbar />

      <main aria-label="YA KAVA STORE Home" className="landing-shell">
        {/* Dynamic Interactive Hero */}
        <Hero />

        {/* Live Marketplace Showcase */}
        <section className="home-marketplace-section" id="marketplace">
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="eyebrow">Curated Drops</span>
                <h2 className="section-title">Explore Featured Digital Assets</h2>
              </div>
              <div className="marketplace-cat-tabs">
                {['all', 'courses', 'products', 'services'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`cat-pill ${selectedCategory === cat ? 'cat-pill--active' : ''}`}
                  >
                    {cat === 'all' ? 'All Assets' : cat === 'courses' ? 'Masterclasses' : cat === 'products' ? 'Sound & Kits' : 'Services'}
                  </button>
                ))}
              </div>
            </div>

            {loadingProducts ? (
              <div className="home-loading-grid">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="product-skeleton glass-panel" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="home-products-grid">
                {filteredProducts.map((p) => {
                  const finalPrice = p.discount ? p.price * (1 - p.discount / 100) : p.price
                  return (
                    <article key={p._id} className="home-prod-card glass-card">
                      <div className="home-prod-card__image-wrap">
                        <img
                          src={p.image || '/Images/yakava1.png'}
                          alt={p.title}
                          className="home-prod-card__img"
                          onError={(e) => { e.target.src = '/Images/yakava1.png' }}
                        />
                        <span className="home-prod-card__category">{p.category}</span>
                        {p.discount > 0 && (
                          <span className="home-prod-card__discount">-{p.discount}%</span>
                        )}
                      </div>

                      <div className="home-prod-card__content">
                        <h3 className="home-prod-card__title">{p.title}</h3>
                        <p className="home-prod-card__instructor">By {p.instructor || 'YA KAVA STORE'}</p>

                        <div className="home-prod-card__footer">
                          <div className="home-prod-card__price-box">
                            <span className="home-prod-card__price">
                              RWF {finalPrice.toLocaleString()}
                            </span>
                            {p.discount > 0 && (
                              <span className="home-prod-card__old-price">
                                RWF {p.price.toLocaleString()}
                              </span>
                            )}
                          </div>

                          <div className="home-prod-card__actions">
                            <Link
                              to={`/product/${p._id}`}
                              className="yk-btn yk-btn-ghost yk-btn-sm"
                            >
                              Preview
                            </Link>
                            <button
                              onClick={() => navigate('/checkout', { state: { product: p, quantity: 1 } })}
                              className="yk-btn yk-btn-primary yk-btn-sm"
                            >
                              <FaBolt /> Buy
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (
              <div className="empty-home-marketplace glass-panel">
                <p>No products currently found in this category.</p>
                <Link to="/products" className="yk-btn yk-btn-primary">
                  View Full Marketplace
                </Link>
              </div>
            )}

            <div className="home-marketplace-footer">
              <Link to="/products" className="yk-btn yk-btn-secondary">
                View All Marketplace Products <FaArrowRight />
              </Link>
            </div>
          </div>
        </section>

        {/* Interactive Creator Workflow Matrix */}
        <section className="home-workflow-section">
          <div className="wrap">
            <div className="section-head" style={{ justifyContent: 'center', textAlign: 'center', marginBottom: '3.5rem' }}>
              <div>
                <span className="eyebrow" style={{ justifyContent: 'center' }}>The Creator Operating System</span>
                <h2 className="section-title">Engineered For Practical Creator Success</h2>
                <p style={{ color: 'var(--muted)', maxWidth: '64ch', margin: '0.8rem auto 0', fontSize: '1rem', lineHeight: '1.6' }}>
                  Whether you produce beats, edit video, or build software, YA KAVA provides the entire infrastructure you need to package skills into sustainable income.
                </p>
              </div>
            </div>

            <div className="workflow-container glass-panel">
              <div className="workflow-nav">
                {WORKFLOW_STEPS.map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => setActiveWorkflow(idx)}
                    className={`workflow-nav-btn ${activeWorkflow === idx ? 'workflow-nav-btn--active' : ''}`}
                  >
                    <span className="workflow-nav-icon">{step.icon}</span>
                    <div className="workflow-nav-text">
                      <span className="workflow-nav-tag">{step.tag}</span>
                      <strong className="workflow-nav-title">{step.title}</strong>
                    </div>
                  </button>
                ))}
              </div>

              <div className="workflow-display-card">
                <div className="workflow-display-badge">
                  <span>Step {WORKFLOW_STEPS[activeWorkflow].id}</span>
                  <strong>{WORKFLOW_STEPS[activeWorkflow].tag}</strong>
                </div>

                <h3 className="workflow-display-title">
                  {WORKFLOW_STEPS[activeWorkflow].title}
                </h3>

                <p className="workflow-display-desc">
                  {WORKFLOW_STEPS[activeWorkflow].desc}
                </p>

                <div className="workflow-highlights-list">
                  {WORKFLOW_STEPS[activeWorkflow].highlights.map((h, i) => (
                    <div key={i} className="highlight-row">
                      <FaCheckCircle className="highlight-icon" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="workflow-display-cta">
                  <Link to="/products" className="yk-btn yk-btn-primary">
                    Get Started with {WORKFLOW_STEPS[activeWorkflow].tag} <FaArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Discord & Community Banner */}
        <section className="home-discord-section">
          <div className="wrap">
            <div className="discord-card glass-panel">
              <div className="discord-glow" />
              <div className="discord-content">
                <div className="discord-badge">
                  <FaDiscord /> Official Creative Lounge
                </div>
                <h2>Connect, Collaborate & Get Live Feedback</h2>
                <p>
                  Join over 1,200+ producers, mixing engineers, and digital creators on our official Discord.
                  Share stems, get honest track reviews, and find collaborators across Rwanda and East Africa.
                </p>
                <div className="discord-actions">
                  <a
                    href="https://discord.gg/E4Ad3PdTnr"
                    target="_blank"
                    rel="noreferrer"
                    className="yk-btn yk-btn-primary"
                    style={{ background: '#5865F2', borderColor: '#5865F2' }}
                  >
                    <FaDiscord /> Join Discord Server
                  </a>
                  <Link to="/reels" className="yk-btn yk-btn-ghost">
                    <FaPlay /> Watch Video Drops
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <Testimonials />

        {/* Mobile App Banner */}
        <MobileApp />
      </main>

      <Footer />
    </div>
  )
}

