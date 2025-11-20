import { supabaseAdmin } from '../../services/supabase.service.js'
import { ERROR_CODES, SUCCESS_MESSAGES, HTTP_STATUS, USER_ROLES } from '../../config/constants.js'
import { getUserProfile, updateUserRole, createOrUpdateUserProfile } from '../../services/user.service.js'

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

/**
 * Obtenir tous les profils utilisateurs (admin seulement)
 */
export const getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, email, role, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error.message,
        code: ERROR_CODES.AUTH_ERROR
      })
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      users: data || [],
      count: data?.length || 0,
      timestamp: new Date().toISOString()
    })
  } catch (e) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: e.message,
      code: ERROR_CODES.AUTH_ERROR
    })
  }
}

/**
 * Obtenir le profil d'un utilisateur spécifique (admin seulement)
 */
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params

    const profile = await getUserProfile(userId)

    if (!profile) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: 'Utilisateur introuvable',
        message: `Aucun profil trouvé pour l'utilisateur ${userId}`,
        code: ERROR_CODES.USER_PROFILE_NOT_FOUND
      })
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      user: profile,
      timestamp: new Date().toISOString()
    })
  } catch (e) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: e.message,
      code: ERROR_CODES.AUTH_ERROR
    })
  }
}

/**
 * Mettre à jour le rôle d'un utilisateur (admin seulement)
 */
export const updateUserRoleById = async (req, res) => {
  try {
    const { userId } = req.params
    const { role } = req.body

    if (!role) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Rôle manquant',
        message: 'Le champ "role" est requis',
        code: ERROR_CODES.VALIDATION_ERROR
      })
    }

    const validRoles = Object.values(USER_ROLES)
    if (!validRoles.includes(role)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Rôle invalide',
        message: `Le rôle doit être un des suivants : ${validRoles.join(', ')}`,
        code: ERROR_CODES.INVALID_ROLE,
        allowedRoles: validRoles
      })
    }

    // Empêcher un utilisateur de modifier son propre rôle (sauf super_admin)
    if (req.user.sub === userId && req.user.role !== USER_ROLES.SUPER_ADMIN) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: 'Action interdite',
        message: 'Vous ne pouvez pas modifier votre propre rôle',
        code: ERROR_CODES.PERMISSION_DENIED
      })
    }

    const updatedProfile = await updateUserRole(userId, role)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `Rôle de l'utilisateur mis à jour avec succès`,
      user: updatedProfile,
      updatedBy: req.user.email,
      timestamp: new Date().toISOString()
    })
  } catch (e) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: e.message,
      code: ERROR_CODES.AUTH_ERROR
    })
  }
}

/**
 * Créer ou mettre à jour un profil utilisateur (admin seulement)
 */
export const createOrUpdateUser = async (req, res) => {
  try {
    const { userId, email, role = USER_ROLES.USER } = req.body

    if (!userId || !email) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Données manquantes',
        message: 'Les champs "userId" et "email" sont requis',
        code: ERROR_CODES.VALIDATION_ERROR
      })
    }

    const validRoles = Object.values(USER_ROLES)
    if (role && !validRoles.includes(role)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Rôle invalide',
        message: `Le rôle doit être un des suivants : ${validRoles.join(', ')}`,
        code: ERROR_CODES.INVALID_ROLE,
        allowedRoles: validRoles
      })
    }

    const profile = await createOrUpdateUserProfile(userId, email, role)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Profil utilisateur créé ou mis à jour avec succès',
      user: profile,
      createdBy: req.user.email,
      timestamp: new Date().toISOString()
    })
  } catch (e) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: e.message,
      code: ERROR_CODES.AUTH_ERROR
    })
  }
}

