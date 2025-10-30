import { supabaseAdmin } from '../../services/supabase.service.js'
import { ERROR_CODES, SUCCESS_MESSAGES } from '../../config/constants.js'

/**
 * Health check
 */
export const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    message: 'API Admin fonctionnelle',
    timestamp: new Date().toISOString()
  })
}

/**
 * Reset all demo tables
 */
export const resetDatabase = async (req, res) => {
  const tables = ['demo_likes', 'demo_comments', 'demo_posts']
  const deletedCounts = {}

  try {
    for (const table of tables) {
      // Count first
      const { count: beforeCount } = await supabaseAdmin
        .from(table)
        .select('*', { count: 'exact', head: true })

      // Delete all
      const { error } = await supabaseAdmin
        .from(table)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')

      if (error) {
        return res.status(500).json({
          success: false,
          error: error.message,
          table,
          code: ERROR_CODES.DELETE_FAILED
        })
      }

      deletedCounts[table] = beforeCount || 0
    }

    res.status(200).json({
      success: true,
      reset: true,
      message: SUCCESS_MESSAGES.RESET_SUCCESS,
      deletedCounts,
      executedBy: req.user.email,
      timestamp: new Date().toISOString()
    })
  } catch (e) {
    res.status(500).json({
      success: false,
      error: e.message,
      code: ERROR_CODES.RESET_ERROR
    })
  }
}

/**
 * Seed demo data
 */
export const seedDatabase = async (req, res) => {
  try {
    const demoPosts = [
      {
        title: 'Hello Supabase',
        content: 'Premier article seedé',
        is_published: true,
        published_at: new Date().toISOString(),
      },
      {
        title: 'Brouillon en attente',
        content: 'Contenu à publier plus tard',
        is_published: false,
        published_at: null,
      },
    ]

    const { data: posts, error: postsError } = await supabaseAdmin
      .from('demo_posts')
      .insert(demoPosts)
      .select('id')

    if (postsError) {
      return res.status(500).json({
        success: false,
        error: postsError.message,
        code: ERROR_CODES.SEED_POSTS_FAILED
      })
    }

    const [firstPostId] = posts?.map((p) => p.id) ?? []
    let commentsCreated = 0
    let likesCreated = 0

    if (firstPostId) {
      const { data: comments, error: commentsError } = await supabaseAdmin
        .from('demo_comments')
        .insert([
          { post: firstPostId, content: 'Super article !' },
          { post: firstPostId, content: 'Merci pour l\'info' },
        ])
        .select('id')

      if (commentsError) {
        return res.status(500).json({
          success: false,
          error: commentsError.message,
          code: ERROR_CODES.SEED_COMMENTS_FAILED
        })
      }
      commentsCreated = comments?.length ?? 0

      const { data: likes, error: likesError } = await supabaseAdmin
        .from('demo_likes')
        .insert([{ post: firstPostId }, { post: firstPostId }])
        .select('id')

      if (likesError) {
        return res.status(500).json({
          success: false,
          error: likesError.message,
          code: ERROR_CODES.SEED_LIKES_FAILED
        })
      }
      likesCreated = likes?.length ?? 0
    }

    res.status(201).json({
      success: true,
      seeded: true,
      message: SUCCESS_MESSAGES.SEED_SUCCESS,
      created: {
        posts: posts?.length ?? 0,
        comments: commentsCreated,
        likes: likesCreated
      },
      executedBy: req.user.email,
      timestamp: new Date().toISOString()
    })
  } catch (e) {
    res.status(500).json({
      success: false,
      error: e.message,
      code: ERROR_CODES.SEED_ERROR
    })
  }
}

/**
 * Generate random data
 */
export const generateData = async (req, res) => {
  const count = Number(req.body?.count ?? 3)
  
  if (!Number.isFinite(count) || count < 1 || count > 20) {
    return res.status(400).json({
      success: false,
      error: 'Nombre invalide',
      message: 'Le nombre de posts doit être entre 1 et 20',
      code: ERROR_CODES.INVALID_COUNT,
      provided: count,
      allowed: { min: 1, max: 20 }
    })
  }

  try {
    const now = Date.now()
    const postsToInsert = Array.from({ length: count }).map((_, i) => ({
      title: `Post ${i + 1} - ${now}`,
      content: `Contenu automatique #${i + 1} généré le ${new Date().toLocaleString('fr-FR')}`,
      is_published: i % 2 === 0,
      published_at: i % 2 === 0 ? new Date().toISOString() : null,
    }))

    const { data: createdPosts, error: pErr } = await supabaseAdmin
      .from('demo_posts')
      .insert(postsToInsert)
      .select('id')

    if (pErr) {
      return res.status(500).json({
        success: false,
        error: pErr.message,
        code: ERROR_CODES.GENERATE_POSTS_FAILED
      })
    }

    let totalComments = 0
    let totalLikes = 0

    for (const p of createdPosts) {
      const { data: comments, error: cErr } = await supabaseAdmin
        .from('demo_comments')
        .insert([
          { post: p.id, content: 'Commentaire automatique 1' },
          { post: p.id, content: 'Commentaire automatique 2' },
        ])
        .select('id')

      if (cErr) {
        return res.status(500).json({
          success: false,
          error: cErr.message,
          code: ERROR_CODES.GENERATE_COMMENTS_FAILED
        })
      }
      totalComments += comments?.length ?? 0

      const { data: likes, error: lErr } = await supabaseAdmin
        .from('demo_likes')
        .insert([{ post: p.id }, { post: p.id }])
        .select('id')

      if (lErr) {
        return res.status(500).json({
          success: false,
          error: lErr.message,
          code: ERROR_CODES.GENERATE_LIKES_FAILED
        })
      }
      totalLikes += likes?.length ?? 0
    }

    res.status(201).json({
      success: true,
      message: SUCCESS_MESSAGES.GENERATE_SUCCESS(count),
      generated: {
        posts: createdPosts.length,
        comments: totalComments,
        likes: totalLikes
      },
      executedBy: req.user.email,
      timestamp: new Date().toISOString()
    })
  } catch (e) {
    res.status(500).json({
      success: false,
      error: e.message,
      code: ERROR_CODES.GENERATE_ERROR
    })
  }
}

/**
 * Get diagnostics
 */
export const getDiagnostics = async (req, res) => {
  try {
    const tables = ['demo_posts', 'demo_comments', 'demo_likes']
    const stats = {}

    for (const table of tables) {
      const { count, error } = await supabaseAdmin
        .from(table)
        .select('*', { count: 'exact', head: true })

      if (error) {
        stats[table] = { error: error.message, count: null }
      } else {
        stats[table] = { count, status: 'ok' }
      }
    }

    const { data: samplePost, error: sampleError } = await supabaseAdmin
      .from('demo_posts')
      .select('id, title, created_at')
      .limit(1)

    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.DIAGNOSTICS_SUCCESS,
      database: {
        connected: true,
        tables: stats
      },
      sample: sampleError ? null : samplePost,
      environment: {
        hasJwtSecret: !!process.env.JWT_SECRET,
        hasSupabaseUrl: !!process.env.SUPABASE_URL,
        hasAnonKey: !!process.env.SUPABASE_ANON_KEY,
        hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      },
      executedBy: req.user.email,
      timestamp: new Date().toISOString()
    })
  } catch (e) {
    res.status(500).json({
      success: false,
      error: e.message,
      code: ERROR_CODES.DIAGNOSTICS_ERROR
    })
  }
}

