import { Navigate, useLocation, Link } from 'react-router-dom'
import { FaLock, FaArrowLeft } from 'react-icons/fa'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation()
  const token = sessionStorage.getItem('accessToken')
  const userRole = sessionStorage.getItem('userRole') || 'customer'

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}>
        <div style={{
          maxWidth: '520px',
          width: '100%',
          background: 'var(--panel)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(244, 63, 94, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: '#fb7185',
            fontSize: '1.8rem',
            border: '1px solid rgba(244, 63, 94, 0.3)',
          }}>
            <FaLock />
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.6rem',
            color: 'var(--white)',
            margin: '0 0 0.8rem',
          }}>
            Restricted Access
          </h2>

          <p style={{
            color: 'var(--muted)',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            margin: '0 0 1.5rem',
          }}>
            This workspace requires higher permissions. Your current role is{' '}
            <strong style={{ color: '#a3b2ff', textTransform: 'capitalize' }}>
              {userRole}
            </strong>
            , while this area requires{' '}
            <span style={{ color: '#fb7185' }}>{allowedRoles.join(' or ')}</span>.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/dashboard" className="yk-btn yk-btn-primary">
              <FaArrowLeft /> Go to Dashboard
            </Link>
            <Link to="/" className="yk-btn yk-btn-ghost">
              Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return children
}
