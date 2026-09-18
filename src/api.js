import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
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
