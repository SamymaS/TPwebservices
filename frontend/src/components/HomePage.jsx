import { useState } from 'react'
import Header from './Header'
import PostsList from './PostsList'
import CreatePost from './CreatePost'
import AdminPanel from './AdminPanel'
import Profile from './Profile'
import { useAuth } from '../contexts/AuthContext'
import { usePermissions } from '../hooks/usePermissions'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('posts')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { user } = useAuth()
  const { canCreate, isAdmin } = usePermissions()

  const refresh = () => setRefreshTrigger(prev => prev + 1)

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-5xl mx-auto px-4 py-6">
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {canCreate('posts') ? (
              <CreatePost onPostCreated={refresh} />
            ) : (
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 text-center">
                <p className="text-neutral-400">
                  🔒 Vous n'avez pas la permission de créer des posts
                </p>
                <p className="text-sm text-neutral-500 mt-2">
                  Rôle actuel : <span className="font-semibold text-neutral-400">{user?.role || 'guest'}</span>
                </p>
              </div>
            )}
            <PostsList refreshTrigger={refreshTrigger} onUpdate={refresh} />
          </div>
        )}

        {activeTab === 'profile' && <Profile />}
        
        {activeTab === 'admin' && isAdmin() && (
          <AdminPanel onUpdate={refresh} />
        )}
        
        {activeTab === 'admin' && !isAdmin() && (
          <div className="bg-neutral-900 border border-red-800/50 rounded-lg p-6 text-center">
            <p className="text-red-400 text-lg mb-2">
              🚫 Accès refusé
            </p>
            <p className="text-neutral-400">
              Vous devez avoir le rôle Admin ou Super Admin pour accéder au panel d'administration
            </p>
            <p className="text-sm text-neutral-500 mt-2">
              Votre rôle : <span className="font-semibold text-neutral-400">{user?.role || 'guest'}</span>
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

