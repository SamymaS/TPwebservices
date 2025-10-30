import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('authToken'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      verifyToken()
    } else {
      setLoading(false)
    }
  }, [])

  async function verifyToken() {
    try {
      const response = await authAPI.verify(token)
      if (response.success && response.valid) {
        setUser(response.user)
      } else {
        logout()
      }
    } catch (error) {
      console.error('Token verification failed:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  async function login(credentials) {
    try {
      // Pour la démo, on génère un token
      const response = await authAPI.generateToken(credentials)
      
      if (response.success) {
        const newToken = response.access_token
        localStorage.setItem('authToken', newToken)
        setToken(newToken)
        setUser(response.user)
        return { success: true }
      }
      
      return { success: false, error: 'Échec de la connexion' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async function signup(credentials) {
    try {
      // Pour la démo, on génère directement un token
      const response = await authAPI.generateToken(credentials)
      
      if (response.success) {
        const newToken = response.access_token
        localStorage.setItem('authToken', newToken)
        setToken(newToken)
        setUser(response.user)
        return { success: true }
      }
      
      return { success: false, error: 'Échec de l\'inscription' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  function logout() {
    localStorage.removeItem('authToken')
    setToken(null)
    setUser(null)
  }

  async function refreshUser() {
    if (token) {
      await verifyToken()
    }
  }

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    refreshUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

