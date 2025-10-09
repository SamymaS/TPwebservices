import { useEffect, useMemo, useState } from 'react'

const api = {
  list: (params = '') => fetch(`/api/posts${params}`).then(r => r.json()),
  create: (body) => fetch(`/api/posts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json()),
  publish: (id) => fetch(`/api/posts/${id}/publish`, { method: 'PATCH' }),
  remove: (id) => fetch(`/api/posts/${id}`, { method: 'DELETE' }),
  comments: (id) => fetch(`/api/posts/${id}/comments`).then(r => r.json()),
  addComment: (id, content) => fetch(`/api/posts/${id}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) }).then(r => r.json()),
  removeComment: (postId, commentId) => fetch(`/api/posts/${postId}/comments/${commentId}`, { method: 'DELETE' }),
  likesCount: (id) => fetch(`/api/posts/${id}/likes-count`).then(r => r.json()),
  addLike: (id) => fetch(`/api/posts/${id}/likes`, { method: 'POST' }).then(r => r.json()),
}

export default function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [onlyPublished, setOnlyPublished] = useState(true)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const params = useMemo(() => {
    const qs = new URLSearchParams()
    if (onlyPublished) qs.set('is_published', 'true')
    if (query.trim().length >= 2) qs.set('q', query.trim())
    const s = qs.toString()
    return s ? `?${s}` : ''
  }, [onlyPublished, query])

  async function load() {
    setLoading(true)
    try {
      const data = await api.list(params)
      setPosts(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [params])

  async function handleCreate(e) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    await api.create({ title: title.trim(), content: content.trim() })
    setTitle(''); setContent('')
    load()
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800 sticky top-0 bg-neutral-950/80 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="font-bold text-xl">Demo Blog</div>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Recherche (min 2)" className="ml-auto bg-neutral-900 border border-neutral-800 rounded px-3 py-1 text-sm" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={onlyPublished} onChange={e=>setOnlyPublished(e.target.checked)} /> Publiés
          </label>
          <button onClick={load} className="bg-sky-500 hover:bg-sky-400 text-black rounded px-3 py-1 text-sm">Rafraîchir</button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <form onSubmit={handleCreate} className="bg-neutral-900 border border-neutral-800 rounded p-4 mb-6">
          <div className="text-sm text-neutral-400 mb-2">Créer un post</div>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Titre" className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 mb-2" />
          <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Contenu" className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 mb-3" rows={3} />
          <button className="bg-sky-500 hover:bg-sky-400 text-black rounded px-4 py-2">Publier plus tard</button>
        </form>

        {loading && <div className="text-neutral-400">Chargement…</div>}
        {!loading && posts.map(p => (
          <PostCard key={p.id} post={p} onChanged={load} />
        ))}
      </main>
    </div>
  )
}

function PostCard({ post, onChanged }) {
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [likes, setLikes] = useState(0)
  const [open, setOpen] = useState(false)

  async function loadDetails() {
    const [cs, lc] = await Promise.all([
      api.comments(post.id),
      api.likesCount(post.id),
    ])
    setComments(Array.isArray(cs) ? cs : [])
    setLikes(typeof lc === 'number' ? lc : 0)
  }

  useEffect(() => { if (open) loadDetails() }, [open])

  async function handlePublish() { await api.publish(post.id); onChanged() }
  async function handleDelete() { await api.remove(post.id); onChanged() }
  async function handleLike() { await api.addLike(post.id); loadDetails() }
  async function handleAddComment(e) {
    e.preventDefault()
    if (!comment.trim()) return
    await api.addComment(post.id, comment.trim())
    setComment('')
    loadDetails()
  }
  async function handleDeleteComment(cid) { await api.removeComment(post.id, cid); loadDetails() }

  return (
    <article className="border-b border-neutral-800 py-4">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-neutral-800 w-10 h-10" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="font-semibold">{post.title}</div>
            {!post.is_published && (
              <span className="text-xs text-amber-400 border border-amber-400/30 rounded px-2 py-0.5">Brouillon</span>
            )}
            {post.published_at && (
              <span className="text-xs text-neutral-500">{new Date(post.published_at).toLocaleString()}</span>
            )}
            <button onClick={()=>setOpen(v=>!v)} className="ml-auto text-xs text-sky-400 hover:underline">{open ? 'Masquer' : 'Détails'}</button>
          </div>
          <div className="text-neutral-300 mt-1 whitespace-pre-wrap">{post.content}</div>
          <div className="flex items-center gap-3 mt-3">
            <button onClick={handleLike} className="text-sm text-sky-400 hover:underline">Like</button>
            {!post.is_published && <button onClick={handlePublish} className="text-sm text-emerald-400 hover:underline">Publier</button>}
            <button onClick={handleDelete} className="text-sm text-rose-400 hover:underline">Supprimer</button>
            <span className="text-sm text-neutral-400">{likes} likes</span>
          </div>
          {open && (
            <div className="mt-3">
              <form onSubmit={handleAddComment} className="flex gap-2 mb-2">
                <input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Ajouter un commentaire" className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-3 py-2" />
                <button className="bg-neutral-200 text-black rounded px-3">Envoyer</button>
              </form>
              <ul className="space-y-2">
                {comments.map(c => (
                  <li key={c.id} className="bg-neutral-900 border border-neutral-800 rounded p-2 flex items-start gap-2">
                    <div className="rounded-full bg-neutral-800 w-8 h-8" />
                    <div className="flex-1">
                      <div className="text-sm text-neutral-300 whitespace-pre-wrap">{c.content}</div>
                      <button onClick={()=>handleDeleteComment(c.id)} className="text-xs text-rose-400 hover:underline mt-1">Supprimer</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}


