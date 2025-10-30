/**
 * Configuration et constantes de l'application
 */

// Configuration des tokens JWT
export const JWT_CONFIG = {
  EXPIRATION: 24 * 60 * 60, // 24 heures en secondes
  EXPIRATION_MS: 24 * 60 * 60 * 1000, // 24 heures en millisecondes
  AUDIENCE: 'authenticated',
}

// Rôles utilisateur
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
}

// Tables de la base de données
export const TABLES = {
  POSTS: 'demo_posts',
  COMMENTS: 'demo_comments',
  LIKES: 'demo_likes',
}

// Codes d'erreur
export const ERROR_CODES = {
  // Authentification
  AUTH_TOKEN_MISSING: 'AUTH_TOKEN_MISSING',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  AUTH_ERROR: 'AUTH_ERROR',
  ADMIN_REQUIRED: 'ADMIN_REQUIRED',
  
  // Token
  TOKEN_MISSING: 'TOKEN_MISSING',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  
  // Validation
  INVALID_COUNT: 'INVALID_COUNT',
  INVALID_ROLE: 'INVALID_ROLE',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  
  // Base de données
  DELETE_FAILED: 'DELETE_FAILED',
  RESET_ERROR: 'RESET_ERROR',
  SEED_POSTS_FAILED: 'SEED_POSTS_FAILED',
  SEED_COMMENTS_FAILED: 'SEED_COMMENTS_FAILED',
  SEED_LIKES_FAILED: 'SEED_LIKES_FAILED',
  SEED_ERROR: 'SEED_ERROR',
  GENERATE_POSTS_FAILED: 'GENERATE_POSTS_FAILED',
  GENERATE_COMMENTS_FAILED: 'GENERATE_COMMENTS_FAILED',
  GENERATE_LIKES_FAILED: 'GENERATE_LIKES_FAILED',
  GENERATE_ERROR: 'GENERATE_ERROR',
  DIAGNOSTICS_ERROR: 'DIAGNOSTICS_ERROR',
}

// Limites de validation
export const VALIDATION_LIMITS = {
  GENERATE_COUNT_MIN: 1,
  GENERATE_COUNT_MAX: 20,
  COMMENT_MIN_LENGTH: 2,
  COMMENT_MAX_LENGTH: 280,
  TITLE_MIN_LENGTH: 2,
  TITLE_MAX_LENGTH: 200,
  CONTENT_MIN_LENGTH: 1,
}

// Messages de succès
export const SUCCESS_MESSAGES = {
  TOKEN_GENERATED: '🔐 Token généré avec succès',
  ADMIN_TOKEN_GENERATED: '🔐 Token administrateur généré',
  TOKEN_VALID: 'Token valide ✓',
  LOGOUT_SUCCESS: 'Déconnexion réussie. Supprimez le token côté client.',
  RESET_SUCCESS: '🗑️ Toutes les tables ont été vidées',
  SEED_SUCCESS: '🌱 Données de démonstration créées',
  GENERATE_SUCCESS: (count) => `✨ ${count} posts générés avec succès`,
  DIAGNOSTICS_SUCCESS: '✅ Diagnostics effectués',
  API_HEALTH: 'API Admin fonctionnelle',
}

// Configuration HTTP
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
}

// Variables d'environnement requises
export const REQUIRED_ENV_VARS = [
  'JWT_SECRET',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
]

export default {
  JWT_CONFIG,
  USER_ROLES,
  TABLES,
  ERROR_CODES,
  VALIDATION_LIMITS,
  SUCCESS_MESSAGES,
  HTTP_STATUS,
  REQUIRED_ENV_VARS,
}

