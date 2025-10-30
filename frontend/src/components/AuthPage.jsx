import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
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
        role: isAdmin ? 'admin' : 'user'
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

            {/* Admin Toggle */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-md p-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-medium text-sm">Mode Administrateur</div>
                  <div className="text-xs text-neutral-400">Accès aux fonctionnalités admin</div>
                </div>
                <input
                  type="checkbox"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="w-5 h-5 rounded border-neutral-700 text-sky-500 focus:ring-sky-500"
                />
              </label>
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
              <p>🔐 En mode admin, vous aurez accès aux fonctionnalités de gestion.</p>
              <p>✨ En mode user, vous pourrez créer des posts et commenter.</p>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              setFormData({ userId: 'demo-user', email: 'user@demo.com', role: 'user' })
              setIsAdmin(false)
              setIsLogin(true)
            }}
            className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 py-2 rounded-md text-sm transition-all"
          >
            👤 Compte démo user
          </button>
          <button
            onClick={() => {
              setFormData({ userId: 'demo-admin', email: 'admin@demo.com', role: 'admin' })
              setIsAdmin(true)
              setIsLogin(true)
            }}
            className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 py-2 rounded-md text-sm transition-all"
          >
            👑 Compte démo admin
          </button>
        </div>
      </div>
    </div>
  )
}

