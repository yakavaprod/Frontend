import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import AuthLayout from '../components/AuthLayout.jsx'
import '../components/AuthForm.css'
import api, { saveSession } from '../api.js'

const ROLES = [
  { key: 'learn', label: 'Learn' },
  { key: 'both', label: 'Both' },
]

export default function SignUp() {
  const [role, setRole] = useState('both')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const existing = document.getElementById('google-gsi-script')
    if (existing || window.google?.accounts) return

    const script = document.createElement('script')
    script.id = 'google-gsi-script'
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      if (!window.google?.accounts) {
        setError('Google sign-up is currently blocked for this app URL. Please continue with your email and password instead.')
      }
    }
    script.onerror = () => {
      setError('Google sign-up is unavailable for this URL. Please continue with your email and password instead. For local testing, use http://localhost:5175 and allow it in Google Cloud Console.')
    }
    document.head.appendChild(script)
  }, [])

  const handleGoogleSignUp = async () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

    if (!window.google?.accounts) {
      setError('Google sign-up is not available in this browser right now. Please continue with your email and password instead.')
      return
    }

    if (!googleClientId) {
      setError('Google sign-up is not configured yet. Please continue with your email and password, or restart the app after adding the Google client ID.')
      return
    }

    setError('')
    setLoading(true)

    try {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async ({ credential }) => {
          if (!credential) {
            setError('Google sign-up did not return a valid token. Please continue with your email and password instead.')
            setLoading(false)
            return
          }

          try {
            const { data } = await api.post('/auth/google', { token: credential })
            saveSession(data)
            navigate(data.user.role === 'admin' ? '/admin' : '/dashboard')
          } catch (requestError) {
            setError(requestError.response?.data?.error || 'Google sign-up is unavailable right now. Please continue with your email and password instead.')
          } finally {
            setLoading(false)
          }
        },
      })

      window.google.accounts.id.prompt()
    } catch {
      setError('Google sign-up could not start from this browser or URL. Please continue with your email and password instead.')
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form = new FormData(e.currentTarget)
    try {
      const { data } = await api.post('/auth/signup', {
        name: form.get('name'), email: form.get('email'), password: form.get('password'), role,
      })
      saveSession(data)
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to create your account right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Create account"
      title="Join the creator network."
      lead="Build your profile, explore learning resources, and discover digital products designed for creators."
      footer={<>Already have an account? <Link to="/login">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" type="text" placeholder="Musoni Samuel" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="signup-email">Email</label>
          <input id="signup-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor="signup-password">Password</label>
          <input id="signup-password" name="password" type="password" placeholder="At least 8 characters" autoComplete="new-password" required />
        </div>

        <label className="field" style={{ marginBottom: '0.5rem' }} htmlFor="role-picker">
          I'm here to
        </label>
        <div className="role-picker" id="role-picker" role="radiogroup" aria-label="I'm here to">
          {ROLES.map((r) => (
            <button
              type="button"
              key={r.key}
              role="radio"
              aria-checked={role === r.key}
              className={`role-chip ${role === r.key ? 'is-active' : ''}`}
              onClick={() => setRole(r.key)}
            >
              {r.label}
            </button>
          ))}
        </div>

        {error && <p role="alert" className="form-error">{error}</p>}
        <button type="submit" className="auth-submit" disabled={loading}>{loading ? 'Creating account...' : 'Start buying'}</button>
      </form>

      <div className="auth-divider">or continue with</div>
      <div className="auth-social">
        <button type="button" onClick={handleGoogleSignUp} disabled={loading}><FcGoogle /> Google</button>
        <button type="button"><FaGithub /> GitHub</button>
      </div>
    </AuthLayout>
  )
}
