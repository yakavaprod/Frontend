import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

const getInitialTheme = () => {
  const storedUser = sessionStorage.getItem('user')
  try {
    const preference = JSON.parse(storedUser || '{}').preferences?.theme
    if (preference === 'light' || preference === 'dark') return preference
  } catch {
    // Use the device preference when the stored session is unavailable.
  }
  return 'system'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    const resolvedTheme = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme
    root.dataset.theme = resolvedTheme
    root.style.colorScheme = resolvedTheme
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside ThemeProvider')
  return context
}
