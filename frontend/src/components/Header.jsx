import { useAuth } from '../contexts/AuthContext'
import { usePermissions } from '../hooks/usePermissions'

const ROLE_EMOJIS = {
  guest: '🔓',
  user: '👤',
  moderator: '👮',
  admin: '🛡️',
  super_admin: '👑'
}

const ROLE_LABELS = {
  guest: 'Guest',
  user: 'User',
  moderator: 'Moderator',
  admin: 'Admin',
  super_admin: 'Super Admin'
}

export default function Header({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth()
  const { isAdmin } = usePermissions()

  const roleEmoji = ROLE_EMOJIS[user?.role] || '❓'
  const roleLabel = ROLE_LABELS[user?.role] || 'Unknown'

  return (
    <header className="border-b border-neutral-800 sticky top-0 bg-neutral-950/80 backdrop-blur z-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              ✨ Ynov Express
            </div>
            <span className="px-2 py-1 text-xs bg-neutral-800 text-neutral-400 rounded">
              RBAC v3.0
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-4 py-2 rounded-md transition-all ${
                activeTab === 'posts'
                  ? 'bg-sky-500 text-black font-semibold'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800'
              }`}
            >
              📝 Posts
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-md transition-all ${
                activeTab === 'profile'
                  ? 'bg-sky-500 text-black font-semibold'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800'
              }`}
            >
              👤 Profil
            </button>

            {isAdmin() && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-2 rounded-md transition-all ${
                  activeTab === 'admin'
                    ? 'bg-amber-500 text-black font-semibold'
                    : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800'
                }`}
              >
                {roleEmoji} Admin
              </button>
            )}

            {/* User Info */}
            <div className="ml-4 pl-4 border-l border-neutral-800 flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium">{user?.email}</div>
                <div className="text-xs text-neutral-400">
                  {roleEmoji} {roleLabel}
                </div>
              </div>
              
              <button
                onClick={logout}
                className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-md text-sm transition-all"
                title="Déconnexion"
              >
                🚪 Déconnexion
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

