import { useState, useEffect } from 'react'
import AuthPage from './components/AuthPage'
import HomePage from './components/HomePage'
import ResetPassword from './components/ResetPassword'
import { AuthProvider, useAuth } from './contexts/AuthContext'

function AppContent() {
  const { user, loading } = useAuth()

  // Check if URL is for password reset
  const isResetPasswordPage = window.location.pathname === '/reset-password' || window.location.hash.includes('access_token')

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-neutral-400">Chargement...</p>
        </div>
      </div>
    )
  }

  // Show reset password page if on that route
  if (isResetPasswordPage) {
    return <ResetPassword onSuccess={() => window.location.href = '/'} />
  }

  return user ? <HomePage /> : <AuthPage />
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
