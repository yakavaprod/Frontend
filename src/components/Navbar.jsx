import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { HiOutlineMenu, HiX } from 'react-icons/hi'
import { FaShieldAlt, FaPaintBrush, FaBookOpen, FaUserCircle, FaSignOutAlt } from 'react-icons/fa'
import { clearSession } from '../api.js'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const token = sessionStorage.getItem('accessToken')
  const user = JSON.parse(sessionStorage.getItem('user') || 'null')
  const userRole = sessionStorage.getItem('userRole') || (user ? user.role : null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    clearSession()
    navigate('/login')
  }

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="wrap nav__row">
        <Link to="/" className="nav__mark" aria-label="YA KAVA STORE home">
          <img src="/Images/Logos/logo.png" alt="YA KAVA STORE logo" className="nav__logo" />
          <span className="nav__brand-name">YA KAVA STORE</span>
        </Link>

        <nav className="nav__links" aria-label="Primary navigation">
          <Link to="/" className={`nav__link ${location.pathname === '/' ? 'nav__link--active' : ''}`}>
            Home
          </Link>
          <Link to="/products" className={`nav__link ${location.pathname === '/products' ? 'nav__link--active' : ''}`}>
            Marketplace
          </Link>
          <Link to="/reels" className={`nav__link ${location.pathname === '/reels' ? 'nav__link--active' : ''}`}>
            Reels
          </Link>
          <Link to="/blog" className={`nav__link ${location.pathname === '/blog' ? 'nav__link--active' : ''}`}>
            Articles
          </Link>

          {/* Role-Specific Navigation Links */}
          {token && userRole === 'admin' && (
            <Link to="/admin" className={`nav__link nav__link--highlight ${location.pathname === '/admin' ? 'nav__link--active' : ''}`}>
              <FaShieldAlt className="nav__inline-icon" /> Admin Panel
            </Link>
          )}
          {token && userRole === 'creator' && (
            <Link to="/dashboard" className={`nav__link nav__link--highlight ${location.pathname === '/dashboard' ? 'nav__link--active' : ''}`}>
              <FaPaintBrush className="nav__inline-icon" /> Creator Studio
            </Link>
          )}
          {token && userRole === 'customer' && (
            <Link to="/dashboard" className={`nav__link ${location.pathname === '/dashboard' ? 'nav__link--active' : ''}`}>
              <FaBookOpen className="nav__inline-icon" /> My Shelf
            </Link>
          )}
        </nav>

        <div className="nav__actions">
          {token && user ? (
            <div className="nav__user-menu">
              <Link to="/dashboard" className="nav__profile-pill" title="View Dashboard">
                <FaUserCircle className="nav__user-icon" />
                <span className="nav__user-name">{user.name?.split(' ')[0]}</span>
                <span className={`role-badge role-badge--${userRole || 'customer'}`}>
                  {userRole}
                </span>
              </Link>
              <button onClick={handleLogout} className="nav__icon-btn nav__logout-btn" title="Sign out">
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="nav__signin">Sign in</Link>
              <Link to="/signup" className="yk-btn yk-btn-primary nav__cta">Get Started</Link>
            </>
          )}

          <button
            className="nav__icon-btn nav__burger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <HiX /> : <HiOutlineMenu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="nav__mobile">
          <Link to="/" className="nav__mobile-link" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link to="/products" className="nav__mobile-link" onClick={() => setOpen(false)}>
            Marketplace
          </Link>
          <Link to="/reels" className="nav__mobile-link" onClick={() => setOpen(false)}>
            Reels
          </Link>
          <Link to="/blog" className="nav__mobile-link" onClick={() => setOpen(false)}>
            Articles
          </Link>

          {token && userRole === 'admin' && (
            <Link to="/admin" className="nav__mobile-link nav__mobile-highlight" onClick={() => setOpen(false)}>
              <FaShieldAlt /> Admin Panel
            </Link>
          )}
          {token && (userRole === 'creator' || userRole === 'customer') && (
            <Link to="/dashboard" className="nav__mobile-link nav__mobile-highlight" onClick={() => setOpen(false)}>
              {userRole === 'creator' ? <FaPaintBrush /> : <FaBookOpen />}
              {userRole === 'creator' ? ' Creator Studio' : ' My Library'}
            </Link>
          )}

          <div className="nav__mobile-divider" />

          {token && user ? (
            <div className="nav__mobile-user">
              <div className="nav__mobile-user-row">
                <span>{user.name}</span>
                <span className={`role-badge role-badge--${userRole}`}>{userRole}</span>
              </div>
              <button onClick={() => { setOpen(false); handleLogout(); }} className="yk-btn yk-btn-ghost" style={{ width: '100%', marginTop: '0.8rem' }}>
                <FaSignOutAlt /> Sign out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <Link to="/login" className="nav__mobile-signin" onClick={() => setOpen(false)}>Sign in</Link>
              <Link to="/signup" className="yk-btn yk-btn-primary" onClick={() => setOpen(false)} style={{ width: '100%', textAlign: 'center' }}>Get Started</Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

