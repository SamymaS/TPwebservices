import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    role: 'user'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login, signup } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = {
        userId: formData.userId || `user-${Date.now()}`,
        email: formData.email,
        role: formData.role
      }

      const result = isLogin 
        ? await login(data)
        : await signup(data)

      if (!result.success) {
        setError(result.error || 'Une erreur est survenue')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (role, userId, email) => {
    setError('')
    setLoading(true)

    try {
      const data = { userId, email, role }
      const result = await login(data)

      if (!result.success) {
        setError(result.error || 'Une erreur est survenue')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-neutral-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            ✨ Ynov Express
          </h1>
          <p className="text-neutral-400">
            {isLogin ? 'Connectez-vous à votre compte' : 'Créez un nouveau compte'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 shadow-xl">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setIsLogin(true)
                setError('')
              }}
              className={`flex-1 py-2 rounded-md transition-all ${
                isLogin
                  ? 'bg-sky-500 text-black font-semibold'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => {
                setIsLogin(false)
                setError('')
              }}
              className={`flex-1 py-2 rounded-md transition-all ${
                !isLogin
                  ? 'bg-sky-500 text-black font-semibold'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              Inscription
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="votre@email.com"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  User ID (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  placeholder="Généré automatiquement si vide"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Rôle
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="guest">🔓 Guest (Lecture seule)</option>
                <option value="user">👤 User (Standard)</option>
                <option value="moderator">👮 Moderator (Modération)</option>
                <option value="admin">🛡️ Admin (Administration)</option>
                <option value="super_admin">👑 Super Admin (Tout)</option>
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-400 text-black font-semibold py-3 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  Chargement...
                </span>
              ) : (
                isLogin ? 'Se connecter' : 'Créer un compte'
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-neutral-800">
            <div className="text-xs text-neutral-500 space-y-1">
              <p>💡 <strong>Note :</strong> Ceci est une démo utilisant des tokens JWT de test.</p>
              <p>🎭 Choisissez votre rôle ou utilisez les comptes démo ci-dessous.</p>
            </div>
          </div>
        </div>

        {/* Demo Accounts - 5 Roles */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-neutral-400 mb-3 text-center">
            🎭 Comptes Démo - Testez chaque rôle
          </h3>
          
          <div className="space-y-2">
            {/* Guest */}
            <button
              onClick={() => handleDemoLogin('guest', 'demo-guest', 'guest@demo.com')}
              disabled={loading}
              className="w-full bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700 rounded-md p-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔓</span>
                  <div className="text-left">
                    <div className="font-medium text-neutral-200 group-hover:text-neutral-100">Guest</div>
                    <div className="text-xs text-neutral-500">Lecture seule • Pas de création</div>
                  </div>
                </div>
                <span className="text-xs text-neutral-600 group-hover:text-neutral-500">Niveau 0</span>
              </div>
            </button>

            {/* User */}
            <button
              onClick={() => handleDemoLogin('user', 'demo-user', 'user@demo.com')}
              disabled={loading}
              className="w-full bg-blue-950/30 hover:bg-blue-950/50 border border-blue-800/50 rounded-md p-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👤</span>
                  <div className="text-left">
                    <div className="font-medium text-blue-200 group-hover:text-blue-100">User</div>
                    <div className="text-xs text-blue-400/70">CRUD sur son contenu • Posts & commentaires</div>
                  </div>
                </div>
                <span className="text-xs text-blue-600 group-hover:text-blue-500">Niveau 1</span>
              </div>
            </button>

            {/* Moderator */}
            <button
              onClick={() => handleDemoLogin('moderator', 'demo-moderator', 'moderator@demo.com')}
              disabled={loading}
              className="w-full bg-orange-950/30 hover:bg-orange-950/50 border border-orange-800/50 rounded-md p-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👮</span>
                  <div className="text-left">
                    <div className="font-medium text-orange-200 group-hover:text-orange-100">Moderator</div>
                    <div className="text-xs text-orange-400/70">Modération • Supprimer tout contenu</div>
                  </div>
                </div>
                <span className="text-xs text-orange-600 group-hover:text-orange-500">Niveau 2</span>
              </div>
            </button>

            {/* Admin */}
            <button
              onClick={() => handleDemoLogin('admin', 'demo-admin', 'admin@demo.com')}
              disabled={loading}
              className="w-full bg-red-950/30 hover:bg-red-950/50 border border-red-800/50 rounded-md p-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🛡️</span>
                  <div className="text-left">
                    <div className="font-medium text-red-200 group-hover:text-red-100">Admin</div>
                    <div className="text-xs text-red-400/70">Administration • Seed & Reset • Diagnostics</div>
                  </div>
                </div>
                <span className="text-xs text-red-600 group-hover:text-red-500">Niveau 3</span>
              </div>
            </button>

            {/* Super Admin */}
            <button
              onClick={() => handleDemoLogin('super_admin', 'demo-superadmin', 'superadmin@demo.com')}
              disabled={loading}
              className="w-full bg-purple-950/30 hover:bg-purple-950/50 border border-purple-800/50 rounded-md p-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👑</span>
                  <div className="text-left">
                    <div className="font-medium text-purple-200 group-hover:text-purple-100">Super Admin</div>
                    <div className="text-xs text-purple-400/70">Accès total • Toutes permissions</div>
                  </div>
                </div>
                <span className="text-xs text-purple-600 group-hover:text-purple-500">Niveau 4</span>
              </div>
            </button>
          </div>

          {/* Info Roles */}
          <div className="mt-4 p-3 bg-neutral-900/50 border border-neutral-800 rounded-md">
            <p className="text-xs text-neutral-500 text-center">
              💡 Chaque rôle a des permissions différentes. Testez-les tous !
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

