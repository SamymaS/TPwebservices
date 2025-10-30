import { useState, useEffect } from 'react'
import { postsAPI, commentsAPI, likesAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { usePermissions } from '../hooks/usePermissions'

export default function PostCard({ post, onUpdate }) {
  const [showDetails, setShowDetails] = useState(false)
  const [comments, setComments] = useState([])
  const [likes, setLikes] = useState([])
  const [likesCount, setLikesCount] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(post.title)
  const [editContent, setEditContent] = useState(post.content)
  
  const { token, user } = useAuth()
  const { 
    canCreate, 
    canUpdateOwn, 
    canDeleteOwn, 
    canUpdateAny, 
    canDeleteAny,
    canPublish
  } = usePermissions()

  // Vérifier si c'est le propriétaire du post
  const isOwner = user?.userId === post.user_id
  
  // Calculer les permissions pour ce post
  const canEdit = isOwner ? canUpdateOwn('posts') : canUpdateAny('posts')
  const canDelete = isOwner ? canDeleteOwn('posts') : canDeleteAny('posts')
  const canPublishPost = canPublish('posts')

  useEffect(() => {
    if (showDetails) {
      loadDetails()
    }
  }, [showDetails])

  async function loadDetails() {
    try {
      const [commentsData, likesData, countData] = await Promise.all([
        commentsAPI.list(post.id),
        likesAPI.list(post.id),
        likesAPI.count(post.id)
      ])
      
      setComments(Array.isArray(commentsData) ? commentsData : [])
      setLikes(Array.isArray(likesData) ? likesData : [])
      setLikesCount(typeof countData === 'number' ? countData : 0)
    } catch (error) {
      console.error('Error loading details:', error)
    }
  }

  async function handlePublish() {
    setLoading(true)
    try {
      await postsAPI.publish(post.id, token)
      onUpdate()
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) return
    
    setLoading(true)
    try {
      await postsAPI.delete(post.id, token)
      onUpdate()
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdate() {
    setLoading(true)
    try {
      await postsAPI.update(post.id, { title: editTitle, content: editContent }, token)
      setIsEditing(false)
      onUpdate()
    } finally {
      setLoading(false)
    }
  }

  async function handleAddLike() {
    try {
      await likesAPI.add(post.id, token)
      loadDetails()
    } catch (error) {
      console.error('Error adding like:', error)
    }
  }

  async function handleAddComment(e) {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      await commentsAPI.create(post.id, newComment.trim(), token)
      setNewComment('')
      loadDetails()
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  async function handleDeleteComment(commentId) {
    if (!confirm('Supprimer ce commentaire ?')) return
    
    try {
      await commentsAPI.delete(post.id, commentId, token)
      loadDetails()
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  return (
    <article className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-all">
      {!isEditing ? (
        <>
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <span>🕐 {new Date(post.created_at).toLocaleString('fr-FR')}</span>
                {!post.is_published && (
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs font-medium">
                    📝 Brouillon
                  </span>
                )}
                {post.is_published && post.published_at && (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs font-medium">
                    📢 Publié
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <p className="text-neutral-300 whitespace-pre-wrap mb-4">{post.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {canCreate('likes') && (
              <button
                onClick={handleAddLike}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-rose-500 text-neutral-300 hover:text-white rounded-md text-sm transition-all"
              >
                ❤️ Like {likesCount > 0 && `(${likesCount})`}
              </button>
            )}

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-md text-sm transition-all"
            >
              💬 Commentaires {comments.length > 0 && `(${comments.length})`}
            </button>

            {!post.is_published && canPublishPost && (
              <button
                onClick={handlePublish}
                disabled={loading}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-md text-sm transition-all disabled:opacity-50"
              >
                📢 Publier
              </button>
            )}

            {canEdit && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-black font-semibold rounded-md text-sm transition-all"
              >
                ✏️ Modifier
              </button>
            )}

            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-3 py-1.5 bg-rose-500 hover:bg-rose-400 text-white rounded-md text-sm transition-all disabled:opacity-50"
              >
                🗑️ Supprimer
              </button>
            )}
            
            {/* Message si pas de permissions */}
            {!canEdit && !canDelete && user && (
              <span className="text-xs text-neutral-500 italic">
                🔒 Lecture seule
              </span>
            )}
          </div>

          {/* Details Panel */}
          {showDetails && (
            <div className="mt-6 pt-6 border-t border-neutral-800 space-y-4">
              {/* Add Comment Form - Seulement si permission */}
              {canCreate('comments') && (
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ajouter un commentaire..."
                    className="flex-1 bg-neutral-950 border border-neutral-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-black font-semibold rounded-md transition-all"
                  >
                    💬 Envoyer
                  </button>
                </form>
              )}
              
              {!canCreate('comments') && user && (
                <div className="text-sm text-neutral-500 text-center py-2">
                  🔒 Vous n'avez pas la permission de commenter
                </div>
              )}

              {/* Comments List */}
              {comments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-neutral-400">Commentaires :</h4>
                  {comments.map((comment) => {
                    const isCommentOwner = user?.userId === comment.user_id
                    const canDeleteComment = isCommentOwner ? canDeleteOwn('comments') : canDeleteAny('comments')
                    
                    return (
                      <div
                        key={comment.id}
                        className="bg-neutral-950 border border-neutral-800 rounded-md p-3"
                      >
                        <p className="text-sm text-neutral-300 mb-2">{comment.content}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-neutral-500">
                            🕐 {new Date(comment.created_at).toLocaleString('fr-FR')}
                          </span>
                          {canDeleteComment && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-xs text-rose-400 hover:text-rose-300 transition-all"
                            >
                              🗑️ Supprimer
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        /* Edit Mode */
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Titre</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Contenu</label>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-black font-semibold rounded-md transition-all disabled:opacity-50"
            >
              💾 Enregistrer
            </button>
            <button
              onClick={() => {
                setIsEditing(false)
                setEditTitle(post.title)
                setEditContent(post.content)
              }}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-md transition-all"
            >
              ❌ Annuler
            </button>
          </div>
        </div>
      )}
    </article>
  )
}

