import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaBell, FaCheck, FaLock, FaSignOutAlt, FaUserCircle } from 'react-icons/fa'
import SimpleHeader from '../components/SimpleHeader.jsx'
import api, { clearSession } from '../api.js'
import './Settings.css'
import { useTheme } from '../ThemeContext.jsx'

const defaultPreferences = {
  emailOrderUpdates: true,
  emailCourseReminders: true,
  emailMarketing: false,
  weeklyDigest: true,
  theme: 'system',
}

export default function Settings() {
  const navigate = useNavigate()
  const { setTheme } = useTheme()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', country: '', avatarUrl: '' })
  const [preferences, setPreferences] = useState(defaultPreferences)
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState('')
  const [notice, setNotice] = useState({ type: '', text: '' })

  useEffect(() => {
    api.get('/auth/me')
      .then(({ data }) => {
        const currentUser = data.user
        setUser(currentUser)
        setProfile({ name: currentUser.name || '', email: currentUser.email || '', phone: currentUser.phone || '', country: currentUser.country || '', avatarUrl: currentUser.avatarUrl || '' })
        const loadedPreferences = { ...defaultPreferences, ...(currentUser.preferences || {}) }
        setPreferences(loadedPreferences)
        setTheme(loadedPreferences.theme)
      })
      .catch((error) => {
        if (error.response?.status === 401) navigate('/login')
        else setNotice({ type: 'error', text: 'Unable to load your settings.' })
      })
      .finally(() => setLoading(false))
  }, [navigate])

  const showNotice = (type, text) => setNotice({ type, text })
  const updateStoredUser = (updatedUser) => {
    setUser(updatedUser)
    sessionStorage.setItem('user', JSON.stringify(updatedUser))
    sessionStorage.setItem('userRole', updatedUser.role)
  }

  const saveProfile = async (event) => {
    event.preventDefault()
    setSaving('profile')
    setNotice({ type: '', text: '' })
    try {
      const { data } = await api.patch('/settings/profile', profile)
      updateStoredUser(data.user)
      showNotice('success', 'Your profile details have been saved.')
    } catch (error) {
      showNotice('error', error.response?.data?.error || 'Unable to save profile details.')
    } finally { setSaving('') }
  }

  const savePreferences = async (event) => {
    event.preventDefault()
    setSaving('preferences')
    setNotice({ type: '', text: '' })
    try {
      const { data } = await api.patch('/settings/preferences', preferences)
      updateStoredUser(data.user)
      showNotice('success', 'Your notification preferences have been saved.')
    } catch (error) {
      showNotice('error', error.response?.data?.error || 'Unable to save preferences.')
    } finally { setSaving('') }
  }

  const changePassword = async (event) => {
    event.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) return showNotice('error', 'New passwords do not match.')
    setSaving('password')
    setNotice({ type: '', text: '' })
    try {
      await api.patch('/settings/password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword })
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
      showNotice('success', 'Your password has been updated.')
    } catch (error) {
      showNotice('error', error.response?.data?.error || 'Unable to update password.')
    } finally { setSaving('') }
  }

  const deactivateAccount = async () => {
    const password = window.prompt('Enter your password to deactivate this account.')
    if (!password) return
    setSaving('account')
    try {
      await api.delete('/settings/account', { data: { password } })
      clearSession()
      navigate('/login', { replace: true })
    } catch (error) {
      showNotice('error', error.response?.data?.error || 'Unable to deactivate account.')
      setSaving('')
    }
  }

  const logout = () => { clearSession(); navigate('/login', { replace: true }) }

  if (loading) return <div className="settings-page"><SimpleHeader showBack /><main className="settings-shell"><p>Loading settings...</p></main></div>

  return (
    <div className="settings-page">
      <SimpleHeader showBack={false} />
      <main className="settings-shell">
        <header className="settings-heading">
          <button className="settings-back" type="button" onClick={() => navigate('/dashboard')}><FaArrowLeft /> Back to dashboard</button>
          <p className="settings-kicker">Account workspace</p>
          <h1>Settings</h1>
          <p>Keep your profile, notifications, and account security in order.</p>
        </header>

        {notice.text && <div className={`settings-notice ${notice.type}`} role="status"><FaCheck /> {notice.text}</div>}

        <div className="settings-layout">
          <aside className="settings-nav" aria-label="Settings sections">
            <a href="#profile"><FaUserCircle /> Profile</a>
            <a href="#notifications"><FaBell /> Notifications</a>
            <a href="#security"><FaLock /> Security</a>
          </aside>

          <div className="settings-content">
            <section className="settings-panel" id="profile">
              <div className="panel-title"><div className="panel-icon"><FaUserCircle /></div><div><p>Personal details</p><h2>Profile</h2></div></div>
              <form onSubmit={saveProfile}>
                <div className="settings-grid">
                  <label>Full name<input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} required /></label>
                  <label>Email address<input type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} required /></label>
                  <label>Phone number<input type="tel" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} placeholder="Optional" /></label>
                  <label>Country<input value={profile.country} onChange={(event) => setProfile({ ...profile, country: event.target.value })} placeholder="Optional" /></label>
                  <label className="settings-grid-wide">Profile picture URL<input type="url" value={profile.avatarUrl} onChange={(event) => setProfile({ ...profile, avatarUrl: event.target.value })} placeholder="https://example.com/profile-picture.jpg" /><small>Use a public HTTPS image link.</small></label>
                </div>
                <div className="panel-footer"><span>Member since {user?.memberSince ? new Date(user.memberSince).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'today'}</span><button className="settings-primary" disabled={saving === 'profile'}>{saving === 'profile' ? 'Saving...' : 'Save profile'}</button></div>
              </form>
            </section>

            <section className="settings-panel" id="notifications">
              <div className="panel-title"><div className="panel-icon"><FaBell /></div><div><p>Stay in the loop</p><h2>Notifications</h2></div></div>
              <form onSubmit={savePreferences}>
                <div className="toggle-list">
                  <label className="toggle-row"><span><strong>Order updates</strong><small>Payment and order status messages.</small></span><input type="checkbox" checked={preferences.emailOrderUpdates} onChange={(event) => setPreferences({ ...preferences, emailOrderUpdates: event.target.checked })} /></label>
                  <label className="toggle-row"><span><strong>Course reminders</strong><small>Helpful reminders about your learning activity.</small></span><input type="checkbox" checked={preferences.emailCourseReminders} onChange={(event) => setPreferences({ ...preferences, emailCourseReminders: event.target.checked })} /></label>
                  <label className="toggle-row"><span><strong>Weekly digest</strong><small>A weekly summary of your library and marketplace activity.</small></span><input type="checkbox" checked={preferences.weeklyDigest} onChange={(event) => setPreferences({ ...preferences, weeklyDigest: event.target.checked })} /></label>
                  <label className="toggle-row"><span><strong>Creator news and offers</strong><small>Occasional product launches and announcements.</small></span><input type="checkbox" checked={preferences.emailMarketing} onChange={(event) => setPreferences({ ...preferences, emailMarketing: event.target.checked })} /></label>
                </div>
                <div className="panel-footer"><label className="theme-select">Theme<select value={preferences.theme} onChange={(event) => { const nextTheme = event.target.value; setPreferences({ ...preferences, theme: nextTheme }); setTheme(nextTheme) }}><option value="system">Use device setting</option><option value="light">Light</option><option value="dark">Dark</option></select></label><button className="settings-primary" disabled={saving === 'preferences'}>{saving === 'preferences' ? 'Saving...' : 'Save preferences'}</button></div>
              </form>
            </section>

            <section className="settings-panel" id="security">
              <div className="panel-title"><div className="panel-icon"><FaLock /></div><div><p>Protect your account</p><h2>Security</h2></div></div>
              <form onSubmit={changePassword}>
                <div className="settings-grid password-grid">
                  <label>Current password<input type="password" value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} required /></label>
                  <span />
                  <label>New password<input type="password" minLength="8" value={passwords.newPassword} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} required /><small>Use at least 8 characters.</small></label>
                  <label>Confirm new password<input type="password" minLength="8" value={passwords.confirmPassword} onChange={(event) => setPasswords({ ...passwords, confirmPassword: event.target.value })} required /></label>
                </div>
                <div className="panel-footer"><span>Password changes are applied immediately.</span><button className="settings-primary" disabled={saving === 'password'}>{saving === 'password' ? 'Updating...' : 'Update password'}</button></div>
              </form>
            </section>

            <section className="settings-panel danger-panel">
              <div><p className="danger-kicker">Danger zone</p><h2>Deactivate account</h2><p>Your account will be suspended and you will be signed out. Existing order records are retained.</p></div>
              <button className="settings-danger" type="button" onClick={deactivateAccount} disabled={saving === 'account'}>{saving === 'account' ? 'Deactivating...' : 'Deactivate account'}</button>
            </section>

            <button className="settings-signout" type="button" onClick={logout}><FaSignOutAlt /> Sign out of YA KAVA</button>
          </div>
        </div>
      </main>
    </div>
  )
}
