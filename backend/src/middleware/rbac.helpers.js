import { PERMISSIONS, ROLE_HIERARCHY } from '../config/constants.js'

/**
 * Vérifie si l'utilisateur a une permission spécifique
 */
export function hasPermission(userRole, permission) {
  if (!userRole) return false
  
  const rolePermissions = PERMISSIONS[userRole] || []
  
  // Super admin a tout
  if (rolePermissions.includes('*')) return true
  
  // Vérifier permission exacte
  if (rolePermissions.includes(permission)) return true
  
  // Vérifier wildcard (ex: posts:*)
  const [resource, action] = permission.split(':')
  if (rolePermissions.includes(`${resource}:*`)) return true
  
  return false
}

/**
 * Vérifie si l'utilisateur peut faire une action sur sa propre ressource
 */
export function canEditOwn(userRole, resource) {
  return hasPermission(userRole, `${resource}:update:own`) || 
         hasPermission(userRole, `${resource}:update:any`)
}

/**
 * Vérifie si l'utilisateur peut supprimer sa propre ressource
 */
export function canDeleteOwn(userRole, resource) {
  return hasPermission(userRole, `${resource}:delete:own`) || 
         hasPermission(userRole, `${resource}:delete:any`)
}

/**
 * Vérifie si l'utilisateur peut éditer n'importe quelle ressource
 */
export function canEditAny(userRole, resource) {
  return hasPermission(userRole, `${resource}:update:any`)
}

/**
 * Vérifie si l'utilisateur peut supprimer n'importe quelle ressource
 */
export function canDeleteAny(userRole, resource) {
  return hasPermission(userRole, `${resource}:delete:any`)
}

/**
 * Vérifie si userId correspond à la ressource OU si l'utilisateur a la permission "any"
 */
export function canModifyResource(userRole, userId, resourceUserId, action, resource) {
  // Super admin peut tout
  if (hasPermission(userRole, '*')) return true
  
  // Vérifier si c'est sa propre ressource ET qu'il a la permission :own
  const isOwner = userId === resourceUserId
  const hasOwnPermission = hasPermission(userRole, `${resource}:${action}:own`)
  const hasAnyPermission = hasPermission(userRole, `${resource}:${action}:any`)
  
  if (isOwner && hasOwnPermission) return true
  if (hasAnyPermission) return true
  
  return false
}

/**
 * Retourne un objet d'erreur de permission
 */
export function permissionDeniedError(action, resource, reason = null) {
  return {
    success: false,
    error: 'Permission refusée',
    message: `Vous n'avez pas la permission de ${action} ce ${resource}`,
    code: 'PERMISSION_DENIED',
    details: reason
  }
}

/**
 * Middleware helper pour vérifier la propriété d'une ressource
 */
export async function checkResourceOwnership(req, res, resourceGetter, action, resourceName) {
  try {
    // Récupérer la ressource
    const resource = await resourceGetter()
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        error: `${resourceName} non trouvé`,
        code: 'NOT_FOUND'
      })
    }
    
    // Vérifier les permissions
    const userRole = req.user.role
    const userId = req.user.userId
    const resourceUserId = resource.user_id || resource.author_id
    
    const canModify = canModifyResource(userRole, userId, resourceUserId, action, resourceName)
    
    if (!canModify) {
      return res.status(403).json(
        permissionDeniedError(action, resourceName, 
          resourceUserId === userId 
            ? "Vous n'avez pas la permission nécessaire" 
            : "Cette ressource ne vous appartient pas"
        )
      )
    }
    
    // Permission accordée, retourner la ressource
    return { allowed: true, resource }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Erreur lors de la vérification des permissions',
      message: error.message
    })
  }
}

