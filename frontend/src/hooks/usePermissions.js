import { useAuth } from '../contexts/AuthContext'

// Définition des permissions (synchronisé avec le backend)
const PERMISSIONS = {
  guest: [
    'posts:read',
    'comments:read',
    'likes:read',
  ],
  user: [
    'posts:read',
    'posts:create',
    'posts:update:own',
    'posts:delete:own',
    'comments:read',
    'comments:create',
    'comments:delete:own',
    'likes:read',
    'likes:create',
    'likes:delete:own',
  ],
  moderator: [
    'posts:read',
    'posts:create',
    'posts:update:own',
    'posts:update:any',
    'posts:delete:own',
    'posts:delete:any',
    'posts:publish:any',
    'comments:read',
    'comments:create',
    'comments:delete:own',
    'comments:delete:any',
    'likes:read',
    'likes:create',
    'likes:delete:own',
    'likes:delete:any',
  ],
  admin: [
    'posts:*',
    'comments:*',
    'likes:*',
    'admin:seed',
    'admin:generate',
    'admin:diagnostics',
  ],
  super_admin: [
    '*', // Toutes les permissions
  ],
}

export function usePermissions() {
  const { user } = useAuth()

  const hasPermission = (permission) => {
    if (!user || !user.role) return false

    const rolePermissions = PERMISSIONS[user.role] || []

    // Super admin a tout
    if (rolePermissions.includes('*')) return true

    // Vérifier permission exacte
    if (rolePermissions.includes(permission)) return true

    // Vérifier wildcard (ex: posts:*)
    const [resource, action] = permission.split(':')
    if (rolePermissions.includes(`${resource}:*`)) return true

    return false
  }

  const canCreate = (resource) => {
    return hasPermission(`${resource}:create`)
  }

  const canReadOwn = (resource) => {
    return hasPermission(`${resource}:read`) || hasPermission(`${resource}:read:own`)
  }

  const canUpdateOwn = (resource) => {
    return hasPermission(`${resource}:update:own`) || hasPermission(`${resource}:update:any`)
  }

  const canDeleteOwn = (resource) => {
    return hasPermission(`${resource}:delete:own`) || hasPermission(`${resource}:delete:any`)
  }

  const canUpdateAny = (resource) => {
    return hasPermission(`${resource}:update:any`)
  }

  const canDeleteAny = (resource) => {
    return hasPermission(`${resource}:delete:any`)
  }

  const canPublish = (resource) => {
    return hasPermission(`${resource}:publish:any`)
  }

  const isAdmin = () => {
    return user?.role === 'admin' || user?.role === 'super_admin'
  }

  const isModerator = () => {
    return user?.role === 'moderator' || user?.role === 'admin' || user?.role === 'super_admin'
  }

  return {
    user,
    hasPermission,
    canCreate,
    canReadOwn,
    canUpdateOwn,
    canDeleteOwn,
    canUpdateAny,
    canDeleteAny,
    canPublish,
    isAdmin,
    isModerator,
  }
}

