import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import AuthLayout from '../components/AuthLayout.jsx'
import '../components/AuthForm.css'
import api, { saveSession } from '../api.js'

export default function Login() {
  const [remember, setRemember] = useState(true)
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
        setError('Google sign-in is currently blocked for this app URL. Please continue with your email and password instead.')
      }
    }
    script.onerror = () => {
      setError('Google sign-in is unavailable for this URL. Please continue with your email and password instead. For local testing, use http://localhost:5175 and allow it in Google Cloud Console.')
    }
    document.head.appendChild(script)
  }, [])

  const handleGoogleSignIn = async () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

    if (!window.google?.accounts) {
      setError('Google sign-in is not available in this browser right now. Please continue with your email and password instead.')
      return
    }

    if (!googleClientId) {
      setError('Google sign-in is not configured yet. Please continue with your email and password, or restart the app after adding the Google client ID.')
      return
    }

    setError('')
    setLoading(true)

    try {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async ({ credential }) => {
          if (!credential) {
            setError('Google sign-in did not return a valid token. Please continue with your email and password instead.')
            setLoading(false)
            return
          }

          try {
            const { data } = await api.post('/auth/google', { token: credential })
            saveSession(data)
            navigate(data.user.role === 'admin' ? '/admin' : '/dashboard')
          } catch (requestError) {
            setError(requestError.response?.data?.error || 'Google sign-in is unavailable right now. Please continue with your email and password instead.')
          } finally {
            setLoading(false)
          }
        },
      })

      window.google.accounts.id.prompt()
    } catch {
      setError('Google sign-in could not start from this browser or URL. Please continue with your email and password instead.')
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form = new FormData(e.currentTarget)
    try {
      const { data } = await api.post('/auth/login', { email: form.get('email'), password: form.get('password') })
      saveSession(data)
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to sign in right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Session start"
      title="Welcome back."
      lead="Sign in to continue learning, managing your digital products, and growing your creator business."
      footer={<>New to YA KAVA STORE? <Link to="/signup">Create an account</Link></>}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" required />
        </div>

        <div className="field-row">
          <label className="field-check">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Keep me signed in
          </label>
          <a href="#">Forgot password?</a>
        </div>

        {error && <p role="alert" className="form-error">{error}</p>}
        <button type="submit" className="auth-submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
      </form>

      <div className="auth-divider">or continue with</div>
      <div className="auth-social">
        <button type="button" onClick={handleGoogleSignIn} disabled={loading}><FcGoogle /> Google</button>
        <button type="button"><FaGithub /> GitHub</button>
      </div>
    </AuthLayout>
  )
}
