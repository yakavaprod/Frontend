import { useState } from 'react'
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
      footer={<>New to YA KAVA PROD? <Link to="/signup">Create an account</Link></>}
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
        <button type="button"><FcGoogle /> Google</button>
        <button type="button"><FaGithub /> GitHub</button>
      </div>
    </AuthLayout>
  )
}
