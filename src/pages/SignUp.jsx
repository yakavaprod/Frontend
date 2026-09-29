import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import AuthLayout from '../components/AuthLayout.jsx'
import '../components/AuthForm.css'
import api, { saveSession } from '../api.js'

export default function SignUp() {
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
      setError('Google sign-up is unavailable for this URL. Please continue with your email and password instead. Allow this site address in Google Cloud Console.')
    }
    document.head.appendChild(script)
  }, [])

  const handleGoogleSignUp = async () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '311717523761-7spcqje0i2s1vs6dc2f3utm0e4naptnl.apps.googleusercontent.com'

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
        name: form.get('name'), email: form.get('email'), password: form.get('password'), role: 'both',
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
          <input id="name" name="name" type="text" placeholder="Enter your full name" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="signup-email">Email</label>
          <input id="signup-email" name="email" type="email" placeholder="Enter your email address" autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor="signup-password">Password</label>
          <input id="signup-password" name="password" type="password" placeholder="Create a password (8+ characters)" autoComplete="new-password" required />
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
