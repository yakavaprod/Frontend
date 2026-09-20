import axios from 'axios'

// Vite replaces VITE_API_URL at build time. The production fallback prevents
// deployed builds from trying to call the local development server when the
// hosting provider environment variable was not configured.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-8z4x.onrender.com/api'

const api = axios.create({
  baseURL: API_BASE_URL.replace(/\/$/, ''),
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
