import { VALIDATION_LIMITS, ERROR_CODES, USER_ROLES } from '../config/constants.js'

/**
 * Validateur pour le nombre de posts à générer
 */
export const validateGenerateCount = (count) => {
  const numCount = Number(count)
  
  if (!Number.isFinite(numCount)) {
    return {
      valid: false,
      error: {
        success: false,
        error: 'Nombre invalide',
        message: 'Le nombre fourni n\'est pas un nombre valide',
        code: ERROR_CODES.INVALID_COUNT,
        provided: count,
      },
    }
  }
  
  if (numCount < VALIDATION_LIMITS.GENERATE_COUNT_MIN || numCount > VALIDATION_LIMITS.GENERATE_COUNT_MAX) {
    return {
      valid: false,
      error: {
        success: false,
        error: 'Nombre invalide',
        message: `Le nombre de posts doit être entre ${VALIDATION_LIMITS.GENERATE_COUNT_MIN} et ${VALIDATION_LIMITS.GENERATE_COUNT_MAX}`,
        code: ERROR_CODES.INVALID_COUNT,
        provided: numCount,
        allowed: { 
          min: VALIDATION_LIMITS.GENERATE_COUNT_MIN, 
          max: VALIDATION_LIMITS.GENERATE_COUNT_MAX 
        },
      },
    }
  }
  
  return { valid: true, value: numCount }
}

/**
 * Validateur pour le contenu d'un commentaire
 */
export const validateCommentContent = (content) => {
  if (!content || typeof content !== 'string') {
    return {
      valid: false,
      error: {
        success: false,
        error: 'Contenu invalide',
        message: 'Le contenu est requis et doit être une chaîne de caractères',
        code: ERROR_CODES.VALIDATION_ERROR,
      },
    }
  }
  
  if (content.length < VALIDATION_LIMITS.COMMENT_MIN_LENGTH || 
      content.length > VALIDATION_LIMITS.COMMENT_MAX_LENGTH) {
    return {
      valid: false,
      error: {
        success: false,
        error: 'Contenu invalide',
        message: `Le contenu doit contenir entre ${VALIDATION_LIMITS.COMMENT_MIN_LENGTH} et ${VALIDATION_LIMITS.COMMENT_MAX_LENGTH} caractères`,
        code: ERROR_CODES.VALIDATION_ERROR,
        provided: content.length,
        allowed: {
          min: VALIDATION_LIMITS.COMMENT_MIN_LENGTH,
          max: VALIDATION_LIMITS.COMMENT_MAX_LENGTH,
        },
      },
    }
  }
  
  return { valid: true, value: content }
}

/**
 * Validateur pour le titre d'un post
 */
export const validatePostTitle = (title) => {
  if (!title || typeof title !== 'string') {
    return {
      valid: false,
      error: {
        success: false,
        error: 'Titre invalide',
        message: 'Le titre est requis et doit être une chaîne de caractères',
        code: ERROR_CODES.VALIDATION_ERROR,
      },
    }
  }
  
  if (title.length < VALIDATION_LIMITS.TITLE_MIN_LENGTH || 
      title.length > VALIDATION_LIMITS.TITLE_MAX_LENGTH) {
    return {
      valid: false,
      error: {
        success: false,
        error: 'Titre invalide',
        message: `Le titre doit contenir entre ${VALIDATION_LIMITS.TITLE_MIN_LENGTH} et ${VALIDATION_LIMITS.TITLE_MAX_LENGTH} caractères`,
        code: ERROR_CODES.VALIDATION_ERROR,
        provided: title.length,
        allowed: {
          min: VALIDATION_LIMITS.TITLE_MIN_LENGTH,
          max: VALIDATION_LIMITS.TITLE_MAX_LENGTH,
        },
      },
    }
  }
  
  return { valid: true, value: title.trim() }
}

/**
 * Validateur pour le contenu d'un post
 */
export const validatePostContent = (content) => {
  if (!content || typeof content !== 'string') {
    return {
      valid: false,
      error: {
        success: false,
        error: 'Contenu invalide',
        message: 'Le contenu est requis et doit être une chaîne de caractères',
        code: ERROR_CODES.VALIDATION_ERROR,
      },
    }
  }
  
  if (content.length < VALIDATION_LIMITS.CONTENT_MIN_LENGTH) {
    return {
      valid: false,
      error: {
        success: false,
        error: 'Contenu invalide',
        message: `Le contenu doit contenir au moins ${VALIDATION_LIMITS.CONTENT_MIN_LENGTH} caractère`,
        code: ERROR_CODES.VALIDATION_ERROR,
        provided: content.length,
      },
    }
  }
  
  return { valid: true, value: content }
}

/**
 * Validateur pour le rôle utilisateur
 */
export const validateUserRole = (role) => {
  const validRoles = Object.values(USER_ROLES)
  
  if (!role || !validRoles.includes(role)) {
    return {
      valid: false,
      error: {
        success: false,
        error: 'Rôle invalide',
        message: `Le rôle doit être '${USER_ROLES.USER}' ou '${USER_ROLES.ADMIN}'`,
        code: ERROR_CODES.INVALID_ROLE,
        provided: role,
        allowedRoles: validRoles,
      },
    }
  }
  
  return { valid: true, value: role }
}

/**
 * Validateur pour un UUID
 */
export const validateUUID = (uuid, fieldName = 'ID') => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  
  if (!uuid || !uuidRegex.test(uuid)) {
    return {
      valid: false,
      error: {
        success: false,
        error: `${fieldName} invalide`,
        message: `${fieldName} doit être un UUID valide`,
        code: ERROR_CODES.VALIDATION_ERROR,
        provided: uuid,
      },
    }
  }
  
  return { valid: true, value: uuid }
}

export default {
  validateGenerateCount,
  validateCommentContent,
  validatePostTitle,
  validatePostContent,
  validateUserRole,
  validateUUID,
}

