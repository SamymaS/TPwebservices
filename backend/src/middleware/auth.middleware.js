import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

/**
 * Middleware d'authentification JWT
 * Vérifie le token dans le header Authorization: Bearer <token>
 * Attache les informations de l'utilisateur à req.user
 */
export const authenticateToken = (req, res, next) => {
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
    req.user = decoded // Attache les infos de l'utilisateur à la requête
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
    return res.status(403).json({
      success: false,
      error: 'Erreur d\'authentification',
      message: error.message,
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
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    req.user = null
    return next()
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
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

