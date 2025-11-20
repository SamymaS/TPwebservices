import jwt from 'jsonwebtoken'
import { JWT_CONFIG, USER_ROLES, HTTP_STATUS, SUCCESS_MESSAGES, ERROR_CODES } from '../../config/constants.js'
import { supabaseAdmin } from '../../services/supabase.service.js'

/**
 * Generate user or admin token (DEV ONLY)
 */
export const generateToken = async (req, res) => {
  const { 
    userId = `test-user-${Date.now()}`, 
    email = 'test@example.com', 
    role = 'user' 
  } = req.body

  // Validate role
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

  // Créer ou mettre à jour le profil utilisateur dans la base de données
  const { createOrUpdateUserProfile } = await import('../../services/user.service.js')
  await createOrUpdateUserProfile(userId, email, role)

  // Le JWT ne contient plus le rôle pour des raisons de sécurité
  // Le rôle sera récupéré depuis la base de données à chaque requête
  const token = jwt.sign(
    {
      sub: userId,
      email: email,
      // role supprimé du JWT pour sécurité
      aud: JWT_CONFIG.AUDIENCE,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + JWT_CONFIG.EXPIRATION,
    },
    process.env.JWT_SECRET
  )

  res.json({
    success: true,
    access_token: token,
    token_type: 'Bearer',
    expires_in: JWT_CONFIG.EXPIRATION,
    expires_at: new Date(Date.now() + JWT_CONFIG.EXPIRATION_MS).toISOString(),
    user: { id: userId, email, role }
  })
}

/**
 * Generate admin token (DEV ONLY)
 */
export const generateAdminToken = async (req, res) => {
  const { 
    userId = 'admin-123', 
    email = 'admin@example.com'
  } = req.body

  // Créer ou mettre à jour le profil admin dans la base de données
  const { createOrUpdateUserProfile } = await import('../../services/user.service.js')
  await createOrUpdateUserProfile(userId, email, USER_ROLES.ADMIN)

  // Le JWT ne contient plus le rôle pour des raisons de sécurité
  const token = jwt.sign(
    {
      sub: userId,
      email: email,
      // role supprimé du JWT pour sécurité
      aud: JWT_CONFIG.AUDIENCE,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + JWT_CONFIG.EXPIRATION,
    },
    process.env.JWT_SECRET
  )

  res.json({
    success: true,
    access_token: token,
    token_type: 'Bearer',
    expires_in: JWT_CONFIG.EXPIRATION,
    expires_at: new Date(Date.now() + JWT_CONFIG.EXPIRATION_MS).toISOString(),
    user: { id: userId, email, role: USER_ROLES.ADMIN },
    message: SUCCESS_MESSAGES.ADMIN_TOKEN_GENERATED
  })
}

/**
 * Verify token validity
 */
export const verifyToken = async (req, res) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
      success: false,
      error: 'Token manquant',
      message: 'Aucun token fourni dans le header Authorization',
      code: ERROR_CODES.TOKEN_MISSING
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const now = Math.floor(Date.now() / 1000)
    const timeRemaining = decoded.exp - now
    
    // Récupérer le rôle depuis la base de données
    const { getUserProfile } = await import('../../services/user.service.js')
    const userProfile = await getUserProfile(decoded.sub)
    
    res.json({
      success: true,
      valid: true,
      decoded: {
        ...decoded,
        role: userProfile?.role || 'user' // Rôle depuis la DB
      },
      message: SUCCESS_MESSAGES.TOKEN_VALID,
      expiresIn: timeRemaining,
      expiresAt: new Date(decoded.exp * 1000).toISOString(),
      user: {
        id: decoded.sub,
        email: decoded.email,
        role: userProfile?.role || 'user' // Rôle depuis la DB, pas depuis le JWT
      }
    })
  } catch (error) {
    res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      valid: false,
      error: error.name,
      message: error.message,
      code: error.name === 'TokenExpiredError' ? ERROR_CODES.TOKEN_EXPIRED : ERROR_CODES.TOKEN_INVALID
    })
  }
}

/**
 * Get current user info
 */
export const getMe = (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.sub,
      email: req.user.email,
      role: req.user.role,
      authenticatedAt: new Date(req.user.iat * 1000).toISOString(),
      expiresAt: new Date(req.user.exp * 1000).toISOString()
    }
  })
}

/**
 * Logout (client-side)
 */
export const logout = (req, res) => {
  res.json({
    success: true,
    message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
    instructions: 'Le token est toujours techniquement valide jusqu\'à expiration. Assurez-vous de le supprimer de votre stockage local.'
  })
}

/**
 * Refresh token
 * Le nouveau token ne contient pas le rôle (récupéré depuis la DB)
 */
export const refreshToken = (req, res) => {
  // Le rôle est déjà récupéré depuis la DB par le middleware authenticateToken
  const newToken = jwt.sign(
    {
      sub: req.user.sub,
      email: req.user.email,
      // role supprimé du JWT pour sécurité
      aud: JWT_CONFIG.AUDIENCE,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + JWT_CONFIG.EXPIRATION,
    },
    process.env.JWT_SECRET
  )

  res.json({
    success: true,
    access_token: newToken,
    token_type: 'Bearer',
    expires_in: JWT_CONFIG.EXPIRATION,
    expires_at: new Date(Date.now() + JWT_CONFIG.EXPIRATION_MS).toISOString(),
    user: {
      id: req.user.sub,
      email: req.user.email,
      role: req.user.role // Rôle depuis la DB (via middleware)
    }
  })
}

/**
 * Request password reset
 */
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Email manquant',
        message: 'Veuillez fournir une adresse email',
        code: ERROR_CODES.VALIDATION_ERROR
      })
    }

    // Use Supabase Auth to send password reset email
    const { data, error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password`,
    })

    if (error) {
      console.error('Password reset error:', error)
      // Don't reveal if email exists or not for security
      return res.json({
        success: true,
        message: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.'
      })
    }

    res.json({
      success: true,
      message: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.'
    })
  } catch (error) {
    console.error('Password reset request error:', error)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Erreur serveur',
      message: 'Une erreur est survenue lors de la demande de réinitialisation',
      code: ERROR_CODES.AUTH_ERROR
    })
  }
}

/**
 * Reset password with token
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Données manquantes',
        message: 'Token et nouveau mot de passe requis',
        code: ERROR_CODES.VALIDATION_ERROR
      })
    }

    if (password.length < 6) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Mot de passe trop court',
        message: 'Le mot de passe doit contenir au moins 6 caractères',
        code: ERROR_CODES.VALIDATION_ERROR
      })
    }

    // Verify the reset token and update password
    const { data, error } = await supabaseAdmin.auth.updateUser({
      password: password
    })

    if (error) {
      console.error('Password reset error:', error)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Erreur de réinitialisation',
        message: 'Token invalide ou expiré',
        code: ERROR_CODES.TOKEN_INVALID
      })
    }

    res.json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès'
    })
  } catch (error) {
    console.error('Password reset error:', error)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Erreur serveur',
      message: 'Une erreur est survenue lors de la réinitialisation',
      code: ERROR_CODES.AUTH_ERROR
    })
  }
}

