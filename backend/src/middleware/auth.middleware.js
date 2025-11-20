import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { getUserProfile } from '../services/user.service.js'
import { USER_ROLES } from '../config/constants.js'
dotenv.config()

/**
 * Middleware d'authentification JWT
 * Vérifie le token dans le header Authorization: Bearer <token>
 * Récupère le rôle depuis la base de données (sécurité renforcée)
 * Attache les informations de l'utilisateur à req.user
 */
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Token d\'authentification requis',
      message: 'Veuillez fournir un token dans le header Authorization: Bearer <token>',
      code: 'AUTH_TOKEN_MISSING'
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Récupérer le profil utilisateur depuis la base de données
    // Cela garantit que le rôle est toujours à jour
    let userProfile = await getUserProfile(decoded.sub)
    
    if (!userProfile) {
      // Si le profil n'existe pas, créer un profil par défaut avec le rôle 'user'
      const { createOrUpdateUserProfile } = await import('../services/user.service.js')
      try {
        userProfile = await createOrUpdateUserProfile(
          decoded.sub,
          decoded.email || 'unknown@example.com',
          USER_ROLES.USER // Rôle par défaut
        )
      } catch (createError) {
        console.error('Error creating default user profile:', createError)
        return res.status(403).json({
          success: false,
          error: 'Profil utilisateur introuvable',
          message: 'Votre compte n\'est pas configuré. Veuillez contacter un administrateur.',
          code: 'USER_PROFILE_NOT_FOUND'
        })
      }
    }

    // Attacher les informations utilisateur avec le rôle récupéré depuis la DB
    req.user = {
      sub: decoded.sub,
      email: decoded.email || userProfile.email,
      role: userProfile.role, // Rôle récupéré depuis la DB, pas depuis le JWT
      iat: decoded.iat,
      exp: decoded.exp,
      aud: decoded.aud
    }
    
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expiré',
        message: 'Votre session a expiré, veuillez vous reconnecter',
        code: 'AUTH_TOKEN_EXPIRED'
      })
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        success: false,
        error: 'Token invalide',
        message: 'Le token fourni n\'est pas valide',
        code: 'AUTH_TOKEN_INVALID'
      })
    }
    console.error('Authentication error:', error)
    return res.status(403).json({
      success: false,
      error: 'Erreur d\'authentification',
      message: error.message || 'Une erreur est survenue lors de l\'authentification',
      code: 'AUTH_ERROR'
    })
  }
}

/**
 * Middleware de vérification du rôle admin
 * À utiliser APRÈS authenticateToken
 * Vérifie que l'utilisateur authentifié a le rôle "admin"
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentification requise',
      message: 'Vous devez être authentifié pour accéder à cette ressource',
      code: 'AUTH_REQUIRED'
    })
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Accès interdit',
      message: 'Vous devez avoir le rôle administrateur pour accéder à cette ressource',
      code: 'ADMIN_REQUIRED',
      userRole: req.user.role
    })
  }

  next()
}

/**
 * Middleware optionnel : vérifie le token s'il existe, sinon continue
 * Utile pour les routes publiques avec fonctionnalités bonus pour utilisateurs authentifiés
 * Récupère également le rôle depuis la base de données si le token est valide
 */
export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    req.user = null
    return next()
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userProfile = await getUserProfile(decoded.sub)
    
    if (userProfile) {
      req.user = {
        sub: decoded.sub,
        email: decoded.email || userProfile.email,
        role: userProfile.role,
        iat: decoded.iat,
        exp: decoded.exp,
        aud: decoded.aud
      }
    } else {
      req.user = null
    }
  } catch (error) {
    req.user = null
  }
  
  next()
}

/**
 * Middleware de vérification des variables d'environnement
 * À utiliser au démarrage de l'application
 */
export const checkEnvVariables = () => {
  const required = ['JWT_SECRET', 'SUPABASE_URL', 'SUPABASE_ANON_KEY']
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    console.error('❌ Variables d\'environnement manquantes:', missing.join(', '))
    console.error('⚠️  Vérifiez votre fichier .env')
    process.exit(1)
  }
  
  console.log('✅ Variables d\'environnement chargées')
}

