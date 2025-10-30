import { USER_ROLES, PERMISSIONS, ROLE_HIERARCHY, ERROR_CODES } from '../config/constants.js'

/**
 * Vérifie si un rôle a une permission spécifique
 */
export const hasPermission = (role, permission) => {
  // Super admin a toutes les permissions
  if (role === USER_ROLES.SUPER_ADMIN) {
    return true
  }

  const rolePermissions = PERMISSIONS[role] || []

  // Vérifier permission exacte
  if (rolePermissions.includes(permission)) {
    return true
  }

  // Vérifier wildcard (ex: 'posts:*' couvre 'posts:create', 'posts:read', etc.)
  const [resource, action] = permission.split(':')
  if (rolePermissions.includes(`${resource}:*`)) {
    return true
  }

  // Vérifier wildcard complet
  if (rolePermissions.includes('*')) {
    return true
  }

  return false
}

/**
 * Vérifie si un rôle est supérieur ou égal à un rôle minimum
 */
export const hasMinimumRole = (userRole, minimumRole) => {
  const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole)
  const minimumRoleIndex = ROLE_HIERARCHY.indexOf(minimumRole)

  if (userRoleIndex === -1 || minimumRoleIndex === -1) {
    return false
  }

  return userRoleIndex >= minimumRoleIndex
}

/**
 * Middleware : Vérifier qu'un utilisateur a une permission spécifique
 * Usage: requirePermission('posts:create')
 */
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentification requise',
        message: 'Vous devez être authentifié pour accéder à cette ressource',
        code: ERROR_CODES.AUTH_REQUIRED
      })
    }

    const userRole = req.user.role || USER_ROLES.GUEST

    if (!hasPermission(userRole, permission)) {
      return res.status(403).json({
        success: false,
        error: 'Permission refusée',
        message: `Vous n'avez pas la permission : ${permission}`,
        code: ERROR_CODES.PERMISSION_DENIED,
        userRole,
        requiredPermission: permission
      })
    }

    next()
  }
}

/**
 * Middleware : Vérifier qu'un utilisateur a un rôle minimum
 * Usage: requireRole('moderator')
 */
export const requireRole = (minimumRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentification requise',
        message: 'Vous devez être authentifié pour accéder à cette ressource',
        code: ERROR_CODES.AUTH_REQUIRED
      })
    }

    const userRole = req.user.role || USER_ROLES.GUEST

    if (!hasMinimumRole(userRole, minimumRole)) {
      return res.status(403).json({
        success: false,
        error: 'Rôle insuffisant',
        message: `Vous devez avoir au minimum le rôle : ${minimumRole}`,
        code: ERROR_CODES.INSUFFICIENT_ROLE,
        userRole,
        requiredRole: minimumRole
      })
    }

    next()
  }
}

/**
 * Middleware : Vérifier qu'un utilisateur a un des rôles spécifiés
 * Usage: requireAnyRole(['admin', 'moderator'])
 */
export const requireAnyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentification requise',
        message: 'Vous devez être authentifié pour accéder à cette ressource',
        code: ERROR_CODES.AUTH_REQUIRED
      })
    }

    const userRole = req.user.role || USER_ROLES.GUEST

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: 'Rôle insuffisant',
        message: `Vous devez avoir un de ces rôles : ${roles.join(', ')}`,
        code: ERROR_CODES.INSUFFICIENT_ROLE,
        userRole,
        requiredRoles: roles
      })
    }

    next()
  }
}

/**
 * Middleware : Vérifier que l'utilisateur est propriétaire de la ressource
 * ou a la permission de modifier n'importe quelle ressource
 * Usage: requireOwnershipOrPermission('posts:update:any', 'author_id')
 */
export const requireOwnershipOrPermission = (permission, ownerField = 'user_id') => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentification requise',
        code: ERROR_CODES.AUTH_REQUIRED
      })
    }

    const userRole = req.user.role || USER_ROLES.GUEST
    const userId = req.user.sub

    // Si l'utilisateur a la permission globale, on autorise
    if (hasPermission(userRole, permission)) {
      return next()
    }

    // Sinon, vérifier qu'il est propriétaire
    // Cette vérification doit être faite dans le controller
    // On attache juste l'info au req
    req.requiresOwnership = true
    req.ownerField = ownerField
    next()
  }
}

/**
 * Récupérer toutes les permissions d'un rôle
 */
export const getRolePermissions = (role) => {
  if (role === USER_ROLES.SUPER_ADMIN) {
    return ['*']
  }

  return PERMISSIONS[role] || []
}

/**
 * Afficher les permissions d'un utilisateur (utile pour debug)
 */
export const debugPermissions = (req, res) => {
  const userRole = req.user?.role || USER_ROLES.GUEST
  const permissions = getRolePermissions(userRole)

  res.json({
    success: true,
    user: {
      id: req.user?.sub,
      email: req.user?.email,
      role: userRole
    },
    permissions,
    roleHierarchy: ROLE_HIERARCHY,
    currentRoleIndex: ROLE_HIERARCHY.indexOf(userRole)
  })
}

export default {
  hasPermission,
  hasMinimumRole,
  requirePermission,
  requireRole,
  requireAnyRole,
  requireOwnershipOrPermission,
  getRolePermissions,
  debugPermissions
}

