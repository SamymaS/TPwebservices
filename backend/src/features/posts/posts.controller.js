import { supabase } from '../../services/supabase.service.js'
import { canModifyResource, permissionDeniedError, hasPermission } from '../../middleware/rbac.helpers.js'

/**
 * Get all posts
 */
export const getAllPosts = async (req, res) => {
  let query = supabase.from('demo_posts').select('*')

  // Filter only published posts
  if (req.query.is_published === 'true') {
    query = query.eq('is_published', true)
  }

  // Simple search by title contains
  if (req.query.q && req.query.q.length >= 2) {
    query = query.ilike('title', `%${req.query.q}%`)
  }

  const { data, error } = await query

  if (error) {
    return res.status(500).json({ error: error.message })
  }
  res.status(200).json(data)
}

/**
 * Get post by id
 */
export const getPostById = async (req, res) => {
  const { id } = req.params
  const { data, error } = await supabase
    .from('demo_posts')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) return res.status(404).json({ error: error.message })
  res.status(200).json(data)
}

/**
 * Create new post
 */
export const createPost = async (req, res) => {
  const body = {
    title: req.body.title,
    content: req.body.content,
    is_published: false,
    user_id: req.user.userId,  // Tracer l'auteur
  }

  // Validate
  if (!body.title) {
    return res.status(400).json({ error: 'Title is required' })
  }

  if (!body.content) {
    return res.status(400).json({ error: 'Content is required' })
  }

  // Create post
  const { data, error } = await supabase.from('demo_posts').insert(body).select()

  if (error) {
    return res.status(500).json({ error: error.message })
  }
  res.status(201).json(data[0])
}

/**
 * Update post (avec vérification de propriété)
 */
export const updatePost = async (req, res) => {
  const { id } = req.params
  const userRole = req.user.role
  const userId = req.user.userId

  // 1. Récupérer le post
  const { data: post, error: fetchError } = await supabase
    .from('demo_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !post) {
    return res.status(404).json({ 
      success: false,
      error: 'Post non trouvé',
      code: 'NOT_FOUND'
    })
  }

  // 2. Vérifier les permissions (own vs any)
  const canModify = canModifyResource(userRole, userId, post.user_id, 'update', 'posts')
  
  if (!canModify) {
    return res.status(403).json(
      permissionDeniedError('modifier', 'post', 
        post.user_id === userId 
          ? "Vous n'avez pas la permission de modifier vos posts" 
          : "Ce post ne vous appartient pas"
      )
    )
  }

  // 3. Appliquer les modifications
  const updates = {}
  if (typeof req.body.title === 'string') updates.title = req.body.title
  if (typeof req.body.content === 'string') updates.content = req.body.content
  
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'Nothing to update' })
  }
  
  const { data, error } = await supabase
    .from('demo_posts')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json(data[0])
}

/**
 * Publish post
 */
export const publishPost = async (req, res) => {
  const { id } = req.params
  const { data, error } = await supabase
    .from('demo_posts')
    .update({ is_published: true, published_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return res.status(500).json({ error: error.message })
  }
  res.status(204).json(data)
}

/**
 * Delete post (avec vérification de propriété)
 */
export const deletePost = async (req, res) => {
  const { id } = req.params
  const userRole = req.user.role
  const userId = req.user.userId

  // 1. Récupérer le post
  const { data: post, error: fetchError } = await supabase
    .from('demo_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !post) {
    return res.status(404).json({ 
      success: false,
      error: 'Post non trouvé',
      code: 'NOT_FOUND'
    })
  }

  // 2. Vérifier les permissions (own vs any)
  const canDelete = canModifyResource(userRole, userId, post.user_id, 'delete', 'posts')
  
  if (!canDelete) {
    return res.status(403).json(
      permissionDeniedError('supprimer', 'post', 
        post.user_id === userId 
          ? "Vous n'avez pas la permission de supprimer vos posts" 
          : "Ce post ne vous appartient pas et vous n'avez pas les permissions de modération"
      )
    )
  }

  // 3. Delete related data first
  await supabase.from('demo_likes').delete().eq('post', id)
  await supabase.from('demo_comments').delete().eq('post', id)

  // 4. Delete post
  const { error: postError } = await supabase
    .from('demo_posts')
    .delete()
    .eq('id', id)
  if (postError) return res.status(500).json({ error: postError.message })
  
  res.status(204).send()
}

/**
 * Get comments for post
 */
export const getComments = async (req, res) => {
  const { id } = req.params
  const { data, error } = await supabase
    .from('demo_comments')
    .select('*')
    .eq('post', id)

  if (error) {
    return res.status(500).json({ error: error.message })
  }
  res.status(200).json(data)
}

/**
 * Create comment (avec traçage de l'auteur)
 */
export const createComment = async (req, res) => {
  const { id } = req.params
  const body = {
    post: id,
    content: req.body.content,
    user_id: req.user.userId,  // Tracer l'auteur
  }

  if (!body.content || body.content.length < 2 || body.content.length > 280) {
    return res.status(400).json({
      error: 'Content is required and must be between 2 and 280 characters',
    })
  }

  const { data, error } = await supabase
    .from('demo_comments')
    .insert(body)
    .select()

  if (error) {
    return res.status(500).json({ error: error.message })
  }
  res.status(201).json(data[0])
}

/**
 * Delete comment (avec vérification de propriété)
 */
export const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params
  const userRole = req.user.role
  const userId = req.user.userId

  // 1. Récupérer le commentaire
  const { data: comment, error: fetchError } = await supabase
    .from('demo_comments')
    .select('*')
    .eq('id', commentId)
    .eq('post', postId)
    .single()

  if (fetchError || !comment) {
    return res.status(404).json({ 
      success: false,
      error: 'Commentaire non trouvé',
      code: 'NOT_FOUND'
    })
  }

  // 2. Vérifier les permissions (own vs any)
  const canDelete = canModifyResource(userRole, userId, comment.user_id, 'delete', 'comments')
  
  if (!canDelete) {
    return res.status(403).json(
      permissionDeniedError('supprimer', 'commentaire', 
        comment.user_id === userId 
          ? "Vous n'avez pas la permission de supprimer vos commentaires" 
          : "Ce commentaire ne vous appartient pas"
      )
    )
  }

  // 3. Supprimer
  const { error } = await supabase
    .from('demo_comments')
    .delete()
    .eq('id', commentId)
  
  if (error) return res.status(500).json({ error: error.message })
  res.status(204).send()
}

/**
 * Get likes for post
 */
export const getLikes = async (req, res) => {
  const { id } = req.params
  const { data, error } = await supabase
    .from('demo_likes')
    .select('id, post')
    .eq('post', id)
  
  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json(data)
}

/**
 * Get likes count for post
 */
export const getLikesCount = async (req, res) => {
  const { id } = req.params
  const { data, error } = await supabase
    .from('demo_likes')
    .select('*')
    .eq('post', id)
  
  if (error) {
    return res.status(500).json({ error: error.message })
  }
  res.status(200).json(data.length)
}

/**
 * Create like (avec traçage de l'utilisateur)
 */
export const createLike = async (req, res) => {
  const { id } = req.params
  const { data, error } = await supabase
    .from('demo_likes')
    .insert({ 
      post: id,
      user_id: req.user.userId  // Tracer l'utilisateur
    })
    .select()

  if (error) {
    return res.status(500).json({ error: error.message })
  }
  res.status(201).json(data[0])
}

/**
 * Delete like (avec vérification de propriété)
 */
export const deleteLike = async (req, res) => {
  const { postId, likeId } = req.params
  const userRole = req.user.role
  const userId = req.user.userId

  // 1. Récupérer le like
  const { data: like, error: fetchError } = await supabase
    .from('demo_likes')
    .select('*')
    .eq('id', likeId)
    .eq('post', postId)
    .single()

  if (fetchError || !like) {
    return res.status(404).json({ 
      success: false,
      error: 'Like non trouvé',
      code: 'NOT_FOUND'
    })
  }

  // 2. Vérifier les permissions (own vs any)
  const canDelete = canModifyResource(userRole, userId, like.user_id, 'delete', 'likes')
  
  if (!canDelete) {
    return res.status(403).json(
      permissionDeniedError('supprimer', 'like', 
        like.user_id === userId 
          ? "Vous n'avez pas la permission de supprimer vos likes" 
          : "Ce like ne vous appartient pas"
      )
    )
  }

  // 3. Supprimer
  const { error } = await supabase
    .from('demo_likes')
    .delete()
    .eq('id', likeId)
  
  if (error) return res.status(500).json({ error: error.message })
  res.status(204).send()
}

