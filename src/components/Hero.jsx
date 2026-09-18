import { Link } from 'react-router-dom'
import { FaArrowRight, FaBolt, FaShieldAlt, FaPlay, FaShoppingBag, FaDiscord } from 'react-icons/fa'
import './Hero.css'

const STATS = [
  { value: '1,200+', label: 'Active Creators' },
  { value: '45+', label: 'Masterclasses & Kits' },
  { value: 'Instant', label: 'MTN MoMo Access' },
  { value: '100%', label: 'Verified Audio & Assets' },
]

export default function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero__row">
        <div className="hero__copy">
          <div className="hero__live-pill">
            <span className="live-dot" />
            <span>Digital Marketplace & Creator Academy</span>
          </div>

          <h1 className="hero__title">
            Empowering <span className="hero__gradient-text">Creators</span> to Learn, Sell & Scale.
          </h1>

          <p className="hero__lead">
            YA KAVA STORE is a digital learning and marketplace platform built for musicians, producers and creators.
            learn music production, develop your creative skills, access practical resources, and discover digital products
            designed to help you turn your skills into a sustainable career.<br></br>Join our community of creators and start your journey today!
          </p>

          <div className="hero__actions">
            <Link to="/products" className="yk-btn yk-btn-primary hero__main-cta">
              <FaShoppingBag /> Explore Marketplace <FaArrowRight />
            </Link>
            <Link to="/reels" className="yk-btn yk-btn-secondary">
              <FaPlay /> Watch Reels
            </Link>
            <a
              href="https://discord.gg/E4Ad3PdTnr"
              target="_blank"
              rel="noreferrer"
              className="yk-btn yk-btn-ghost hero__discord-btn"
            >
              <FaDiscord /> Community
            </a>
          </div>

          {/* Quick Stats Grid */}
          <div className="hero__stats-grid">
            {STATS.map((stat, idx) => (
              <div key={idx} className="hero__stat-card">
                <span className="hero__stat-value">{stat.value}</span>
                <span className="hero__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Right Panel with Interactive Floating Cards */}
        <div className="hero__panel">
          <div className="hero__visual-card glass-panel">
            <div className="hero__floating-badge hero__floating-badge--top">
              <span className="badge-icon"><FaBolt /></span>
              <div>
                <strong>Hot Drop</strong>
                <span>Sound Kits & Masterclasses</span>
              </div>
            </div>

            <div className="hero__image-wrapper">
              <img
                src="/Images/kava.jpeg"
                alt="YA KAVA product preview"
                className="hero__product-image"
                onError={(e) => { e.target.src = '/Images/kava.jpeg' }}
              />
              <div className="hero__image-overlay">
                <Link to="/products" className="hero__preview-play-btn" title="Preview Marketplace">
                  <FaPlay />
                </Link>
                <div className="hero__preview-meta">
                  <span className="preview-tag">Verified Creator Drop</span>
                  <p className="preview-title">Acoustic & Digital Production Suite</p>
                </div>
              </div>
            </div>

            <div className="hero__floating-badge hero__floating-badge--bottom">
              <span className="badge-icon badge-icon--green"><FaShieldAlt /></span>
              <div>
                <strong>Instant Rwandan MoMo Delivery</strong>
                <span>Instant automated shelf unlock</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

