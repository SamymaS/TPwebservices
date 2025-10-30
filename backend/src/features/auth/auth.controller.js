import jwt from 'jsonwebtoken'
import { JWT_CONFIG, USER_ROLES, HTTP_STATUS, SUCCESS_MESSAGES, ERROR_CODES } from '../../config/constants.js'

/**
 * Generate user or admin token (DEV ONLY)
 */
export const generateToken = (req, res) => {
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

  const token = jwt.sign(
    {
      sub: userId,
      email: email,
      role: role,
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
export const generateAdminToken = (req, res) => {
  const { 
    userId = 'admin-123', 
    email = 'admin@example.com'
  } = req.body

  const token = jwt.sign(
    {
      sub: userId,
      email: email,
      role: USER_ROLES.ADMIN,
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
export const verifyToken = (req, res) => {
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
    
    res.json({
      success: true,
      valid: true,
      decoded: decoded,
      message: SUCCESS_MESSAGES.TOKEN_VALID,
      expiresIn: timeRemaining,
      expiresAt: new Date(decoded.exp * 1000).toISOString(),
      user: {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role
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
 */
export const refreshToken = (req, res) => {
  const newToken = jwt.sign(
    {
      sub: req.user.sub,
      email: req.user.email,
      role: req.user.role,
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
      role: req.user.role
    }
  })
}

