
import {
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem('careerintel_token')
  )

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('careerintel_user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Restore the saved session when the app starts.
    const savedToken = localStorage.getItem('careerintel_token')
    const savedUser = localStorage.getItem('careerintel_user')

    setToken(savedToken)

    try {
      setUser(savedUser ? JSON.parse(savedUser) : null)
    } catch {
      setUser(null)
      localStorage.removeItem('careerintel_user')
    }

    setLoading(false)
  }, [])

  const login = useCallback((authData) => {
    const newToken = authData?.token
    const newUser = authData?.user

    if (!newToken || !newUser) {
      throw new Error('Login response must contain token and user.')
    }

    localStorage.setItem('careerintel_token', newToken)
    localStorage.setItem('careerintel_user', JSON.stringify(newUser))

    setToken(newToken)
    setUser(newUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('careerintel_token')
    localStorage.removeItem('careerintel_user')

    setToken(null)
    setUser(null)
  }, [])

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    loading,
    login,
    logout,
    setUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
