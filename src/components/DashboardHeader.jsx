import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSearch, FaBell, FaChevronDown, FaSignOutAlt, FaHome, FaCog, FaBookOpen, FaBoxOpen, FaCompactDisc, FaCheck } from 'react-icons/fa'
import './DashboardHeader.css'

export default function DashboardHeader({ customer, search = '', onSearchChange, onLogout }) {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const userMenuRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!showMenu) return undefined

    const handleOutsideClick = (event) => {
      if (!userMenuRef.current?.contains(event.target)) setShowMenu(false)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowMenu(false)
        userMenuRef.current?.querySelector('.user-btn')?.focus()
      }
      if (event.key === 'Tab' && !menuRef.current?.contains(event.target)) setShowMenu(false)
    }

    document.addEventListener('click', handleOutsideClick)
    document.addEventListener('keydown', handleKeyDown)
    menuRef.current?.querySelector('[role="menuitem"]')?.focus()
    return () => {
      document.removeEventListener('click', handleOutsideClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showMenu])

  const handleLogout = () => {
    setShowMenu(false)
    onLogout?.()
  }

  const handleMenuKeyDown = (event) => {
    const menuItems = [...event.currentTarget.querySelectorAll('[role="menuitem"]')]
    const currentIndex = menuItems.indexOf(document.activeElement)
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      menuItems[(currentIndex + direction + menuItems.length) % menuItems.length]?.focus()
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      menuItems[event.key === 'Home' ? 0 : menuItems.length - 1]?.focus()
    }
  }

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-inner">
        {/* Logo & Brand */}
        <div className="dashboard-brand">
          <img src="/Images/Logos/Yakava.jpeg" alt="YA KAVA PROD" className="dashboard-logo" />
          <span className="dashboard-brand-name">My Library</span>
        </div>

        {/* Search Bar */}
        <div className="dashboard-search">
          <FaSearch className="search-icon" />
          <input
            type="text" 
            placeholder="Search your library..." 
            className="search-input"
            value={search}
            onChange={(event) => onSearchChange?.(event.target.value)}
            aria-label="Search your library"
          />
        </div>

        <nav className="dashboard-nav" aria-label="Main navigation">
          <Link to="/blog" className="dashboard-nav-link"><FaBookOpen /> Blog</Link>
          <Link to="/products" className="dashboard-nav-link"><FaBoxOpen /> Products</Link>
          <Link to="/reels" className="dashboard-nav-link"><FaCompactDisc /> Reels</Link>
        </nav>

        {/* Right Actions */}
        <div className="dashboard-actions">
          {/* Notifications */}
          <button className="action-btn notification-btn" title="Notifications">
            <FaBell />
            <span className="notification-badge">3</span>
          </button>

          {/* User Menu */}
          <div className="user-menu" ref={userMenuRef}>
            <button 
              className="user-btn"
              type="button"
              aria-expanded={showMenu}
              aria-controls="dashboard-user-menu"
              aria-haspopup="menu"
              onClick={() => setShowMenu((current) => !current)}
              title="User menu"
            >
              <div className="user-avatar-circle">
                {customer?.avatarUrl ? <img src={customer.avatarUrl} alt="" /> : customer?.initial || 'U'}
              </div>
              <span className="user-display-name">{customer?.name?.split(' ')[0] || 'User'}{customer?.verified && <span className="header-verified-badge" title="Verified account" aria-label="Verified account"><FaCheck /></span>}</span>
              <FaChevronDown className={`chevron ${showMenu ? 'open' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="dropdown-menu" id="dashboard-user-menu" ref={menuRef} role="menu" aria-label="User account menu" onClick={(event) => event.stopPropagation()} onKeyDown={handleMenuKeyDown}>
                <div className="menu-header">
                  <div className="menu-user-info">
                    <div className="menu-avatar">{customer?.avatarUrl ? <img src={customer.avatarUrl} alt="" /> : customer?.initial || 'U'}</div>
                    <div className="menu-user-details">
                      <p className="menu-user-name">{customer?.name || 'User'}{customer?.verified && <span className="header-verified-badge" title="Verified account" aria-label="Verified account"><FaCheck /></span>}</p>
                      <p className="menu-user-sub">Member since {customer?.memberSince || 'today'}</p>
                    </div>
                  </div>
                </div>

                <div className="menu-divider"></div>

                <div className="menu-items">
                  <Link role="menuitem" className="menu-item" to="/dashboard" onClick={() => setShowMenu(false)}>
                    <FaHome /> Dashboard
                  </Link>
                  <Link role="menuitem" className="menu-item" to="/products" onClick={() => setShowMenu(false)}>
                    <FaHome /> Browse Products
                  </Link>
                  <Link role="menuitem" className="menu-item" to="/settings" onClick={() => setShowMenu(false)}>
                    <FaCog /> Settings
                  </Link>
                </div>

                <div className="menu-divider"></div>

                <button type="button" role="menuitem" className="menu-item logout-item" onClick={handleLogout}>
                  <FaSignOutAlt /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
