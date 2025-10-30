import { useState } from 'react'
import { postsAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export default function CreatePost({ onPostCreated }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { token } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const response = await postsAPI.create(
        { title: title.trim(), content: content.trim() },
        token
      )

      if (response) {
        setSuccess(true)
        setTitle('')
        setContent('')
        onPostCreated()
        
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la création du post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        ✍️ Créer un nouveau post
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Titre
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Le titre de votre post..."
            className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Contenu
          </label>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Écrivez votre contenu ici..."
            rows={4}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
          />
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-md text-sm">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-md text-sm">
            ✅ Post créé avec succès ! (en mode brouillon)
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading || !title.trim() || !content.trim()}
            className="px-6 py-2 bg-sky-500 hover:bg-sky-400 text-black font-semibold rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Création...' : '📝 Créer (brouillon)'}
          </button>
          
          <div className="text-sm text-neutral-400">
            💡 Le post sera créé en brouillon. Vous pourrez le publier plus tard.
          </div>
        </div>
      </form>
    </div>
  )
}

