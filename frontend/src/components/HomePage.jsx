import { useState } from 'react'
import Header from './Header'
import PostsList from './PostsList'
import CreatePost from './CreatePost'
import AdminPanel from './AdminPanel'
import Profile from './Profile'
import { useAuth } from '../contexts/AuthContext'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('posts')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { user } = useAuth()

  const refresh = () => setRefreshTrigger(prev => prev + 1)

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-5xl mx-auto px-4 py-6">
        {activeTab === 'posts' && (
          <div className="space-y-6">
            <CreatePost onPostCreated={refresh} />
            <PostsList refreshTrigger={refreshTrigger} onUpdate={refresh} />
          </div>
        )}

        {activeTab === 'profile' && <Profile />}
        
        {activeTab === 'admin' && user?.role === 'admin' && (
          <AdminPanel onUpdate={refresh} />
        )}
      </main>
    </div>
  )
}

