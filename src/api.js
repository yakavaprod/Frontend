import axios from 'axios'

// Vite replaces VITE_API_URL at build time. Accept either the full API URL
// (.../api) or the Render service origin and normalize it to the API root.
const configuredApiUrl = import.meta.env.VITE_API_URL || 'https://backend-8z4x.onrender.com/api'
const API_BASE_URL = configuredApiUrl.replace(/\/+$/, '').endsWith('/api')
  ? configuredApiUrl.replace(/\/+$/, '')
  : `${configuredApiUrl.replace(/\/+$/, '')}/api`

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const saveSession = ({ token, user }) => {
  sessionStorage.setItem('accessToken', token)
  sessionStorage.setItem('user', JSON.stringify(user))
  sessionStorage.setItem('userRole', user.role)
}

export const clearSession = () => {
  sessionStorage.removeItem('accessToken')
  sessionStorage.removeItem('user')
  sessionStorage.removeItem('userRole')
}

export default api
