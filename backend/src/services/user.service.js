import { supabaseAdmin } from './supabase.service.js'
import { USER_ROLES } from '../config/constants.js'

/**
 * Service de gestion des utilisateurs et de leurs rôles
 * Récupère les informations utilisateur depuis la base de données
 */

/**
 * Récupère le profil utilisateur avec son rôle depuis la base de données
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<{id: string, email: string, role: string} | null>}
 */
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, email, role')
      .eq('user_id', userId)
      .single()

    if (error) {
      // Si l'utilisateur n'existe pas dans user_profiles, retourner un rôle par défaut
      if (error.code === 'PGRST116') {
        console.warn(`User profile not found for userId: ${userId}, using default role`)
        return null
      }
      throw error
    }

    return {
      id: data.user_id,
      email: data.email,
      role: data.role || USER_ROLES.USER // Rôle par défaut si non défini
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw error
  }
}

/**
 * Crée ou met à jour un profil utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {string} role - Rôle de l'utilisateur (optionnel, défaut: 'user')
 * @returns {Promise<{id: string, email: string, role: string}>}
 */
export const createOrUpdateUserProfile = async (userId, email, role = USER_ROLES.USER) => {
  try {
    // Vérifier que le rôle est valide
    const validRoles = Object.values(USER_ROLES)
    if (!validRoles.includes(role)) {
      throw new Error(`Invalid role: ${role}. Must be one of: ${validRoles.join(', ')}`)
    }

    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .upsert(
        {
          user_id: userId,
          email: email,
          role: role,
          updated_at: new Date().toISOString()
        },
        {
          onConflict: 'user_id',
          ignoreDuplicates: false
        }
      )
      .select('user_id, email, role')
      .single()

    if (error) throw error

    return {
      id: data.user_id,
      email: data.email,
      role: data.role
    }
  } catch (error) {
    console.error('Error creating/updating user profile:', error)
    throw error
  }
}

/**
 * Met à jour le rôle d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {string} newRole - Nouveau rôle
 * @returns {Promise<{id: string, email: string, role: string}>}
 */
export const updateUserRole = async (userId, newRole) => {
  try {
    const validRoles = Object.values(USER_ROLES)
    if (!validRoles.includes(newRole)) {
      throw new Error(`Invalid role: ${newRole}. Must be one of: ${validRoles.join(', ')}`)
    }

    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .update({ role: newRole })
      .eq('user_id', userId)
      .select('user_id, email, role')
      .single()

    if (error) throw error

    if (!data) {
      throw new Error(`User profile not found for userId: ${userId}`)
    }

    return {
      id: data.user_id,
      email: data.email,
      role: data.role
    }
  } catch (error) {
    console.error('Error updating user role:', error)
    throw error
  }
}

/**
 * Récupère le rôle d'un utilisateur (fonction utilitaire rapide)
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<string>} - Rôle de l'utilisateur (défaut: 'user')
 */
export const getUserRole = async (userId) => {
  try {
    const profile = await getUserProfile(userId)
    return profile?.role || USER_ROLES.USER
  } catch (error) {
    console.error('Error getting user role:', error)
    return USER_ROLES.USER // Rôle par défaut en cas d'erreur
  }
}



