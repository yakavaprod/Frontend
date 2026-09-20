import { useNavigate, Link } from 'react-router-dom'
import { FaArrowLeft, FaSignOutAlt, FaShieldAlt, FaUser } from 'react-icons/fa'
import './SimpleHeader.css'
import { clearSession } from '../api.js'

export default function SimpleHeader({ showBack = true, title, onLogout }) {
  const navigate = useNavigate()
  const user = JSON.parse(sessionStorage.getItem('user') || 'null')
  const userRole = sessionStorage.getItem('userRole') || (user ? user.role : null)

  const handleBack = () => {
    navigate(-1)
  }

  const handleLogout = () => {
    clearSession()
    if (onLogout) {
      onLogout()
    } else {
      navigate('/login')
    }
  }

  return (
    <header className="simple-header">
      <div className="simple-header-inner">
        <div className="header-brand">
          {showBack && (
            <button className="header-back-btn" onClick={handleBack} title="Go back">
              <FaArrowLeft />
            </button>
          )}
          <Link to="/" className="header-logo-section">
            <img src="/Images/Logos/Yakava.jpeg" alt="YA KAVA STORE logo" className="header-logo" />
            <span className="header-project-name">YA KAVA STORE</span>
          </Link>
          {title && <span className="header-page-title">{title}</span>}
        </div>

        <div className="header-actions">
          {user && (
            <div className="header-user-info">
              <span className="header-username">{user.name}</span>
              {userRole && (
                <span className={`role-badge role-badge--${userRole}`}>
                  {userRole === 'admin' && <FaShieldAlt />}
                  {userRole}
                </span>
              )}
            </div>
          )}
          {user ? (
            <button className="header-logout-btn" onClick={handleLogout} title="Sign out">
              <FaSignOutAlt />
              <span>Sign out</span>
            </button>
          ) : (
            <Link to="/login" className="header-login-link">
              <FaUser />
              <span>Sign in</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

