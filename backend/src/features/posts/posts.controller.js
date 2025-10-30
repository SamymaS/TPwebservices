import { supabase } from '../../services/supabase.service.js'

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
  }

  // Validate
  if (!body.title) {
    return res.status(400).json({ error: 'Title is required' })
  }

  if (!body.content) {
    return res.status(400).json({ error: 'Content is required' })
  }

  // Create post
  const { data, error } = await supabase.from('demo_posts').insert(body)

  if (error) {
    return res.status(500).json({ error: error.message })
  }
  res.status(201).json(data)
}

/**
 * Update post
 */
export const updatePost = async (req, res) => {
  const { id } = req.params
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
  
  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json(data)
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
 * Delete post (and related comments/likes)
 */
export const deletePost = async (req, res) => {
  const { id } = req.params

  // Delete related data first
  const { error: likesError } = await supabase
    .from('demo_likes')
    .delete()
    .eq('post', id)
  if (likesError) return res.status(500).json({ error: likesError.message })

  const { error: commentsError } = await supabase
    .from('demo_comments')
    .delete()
    .eq('post', id)
  if (commentsError) return res.status(500).json({ error: commentsError.message })

  // Delete post
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
 * Create comment
 */
export const createComment = async (req, res) => {
  const { id } = req.params
  const body = {
    post: id,
    content: req.body.content,
  }

  if (!body.content || body.content.length < 2 || body.content.length > 280) {
    return res.status(400).json({
      error: 'Content is required and must be between 2 and 280 characters',
    })
  }

  const { data, error } = await supabase
    .from('demo_comments')
    .insert(body)
    .select('id')

  if (error) {
    return res.status(500).json({ error: error.message })
  }
  res.status(201).json(data)
}

/**
 * Delete comment
 */
export const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params
  const { error } = await supabase
    .from('demo_comments')
    .delete()
    .eq('id', commentId)
    .eq('post', postId)
  
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
 * Create like
 */
export const createLike = async (req, res) => {
  const { id } = req.params
  const { data, error } = await supabase
    .from('demo_likes')
    .insert({ post: id })
    .select('id')

  if (error) {
    return res.status(500).json({ error: error.message })
  }
  res.status(201).json(data)
}

/**
 * Delete like
 */
export const deleteLike = async (req, res) => {
  const { postId, likeId } = req.params
  const { error } = await supabase
    .from('demo_likes')
    .delete()
    .eq('id', likeId)
    .eq('post', postId)
  
  if (error) return res.status(500).json({ error: error.message })
  res.status(204).send()
}

