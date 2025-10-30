import { useState, useEffect, useMemo } from 'react'
import { postsAPI } from '../services/api'
import PostCard from './PostCard'

export default function PostsList({ refreshTrigger, onUpdate }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [onlyPublished, setOnlyPublished] = useState(false)
  const [sortBy, setSortBy] = useState('date_desc')

  useEffect(() => {
    loadPosts()
  }, [refreshTrigger])

  async function loadPosts() {
    setLoading(true)
    try {
      const params = {}
      if (onlyPublished) params.is_published = 'true'
      if (searchQuery.length >= 2) params.q = searchQuery
      
      const data = await postsAPI.list(params)
      setPosts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error loading posts:', error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  // Apply filters and sorting
  const filteredAndSortedPosts = useMemo(() => {
    let result = [...posts]

    // Sort
    switch (sortBy) {
      case 'date_desc':
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
      case 'date_asc':
        result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        break
      case 'title_asc':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'title_desc':
        result.sort((a, b) => b.title.localeCompare(a.title))
        break
    }

    return result
  }, [posts, sortBy])

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Rechercher un post (min 2 caractères)..."
              className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-neutral-950 border border-neutral-700 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="date_desc">📅 Plus récents</option>
              <option value="date_asc">📅 Plus anciens</option>
              <option value="title_asc">🔤 Titre A→Z</option>
              <option value="title_desc">🔤 Titre Z→A</option>
            </select>
          </div>

          {/* Published Filter */}
          <label className="flex items-center gap-2 bg-neutral-950 border border-neutral-700 rounded-md px-4 py-2 cursor-pointer hover:border-neutral-600 transition-all">
            <input
              type="checkbox"
              checked={onlyPublished}
              onChange={(e) => setOnlyPublished(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-700 text-sky-500 focus:ring-sky-500"
            />
            <span className="text-sm">📢 Publiés uniquement</span>
          </label>

          {/* Refresh */}
          <button
            onClick={loadPosts}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-black font-semibold rounded-md text-sm transition-all"
          >
            🔄 Actualiser
          </button>
        </div>

        {/* Stats */}
        <div className="mt-3 pt-3 border-t border-neutral-800 flex items-center gap-4 text-sm text-neutral-400">
          <span>📊 {filteredAndSortedPosts.length} post(s) affiché(s)</span>
          <span>•</span>
          <span>🔍 Recherche: {searchQuery || 'Aucune'}</span>
          <span>•</span>
          <span>📂 Filtre: {onlyPublished ? 'Publiés' : 'Tous'}</span>
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-neutral-400">Chargement des posts...</p>
        </div>
      ) : filteredAndSortedPosts.length === 0 ? (
        <div className="text-center py-12 bg-neutral-900 border border-neutral-800 rounded-lg">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold mb-2">Aucun post trouvé</h3>
          <p className="text-neutral-400">
            {searchQuery 
              ? 'Essayez une autre recherche' 
              : 'Créez votre premier post ci-dessus !'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedPosts.map((post) => (
            <PostCard key={post.id} post={post} onUpdate={onUpdate} />
          ))}
        </div>
      )}
    </div>
  )
}

