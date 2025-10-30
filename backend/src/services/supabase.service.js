import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

/**
 * Client Supabase avec la clé ANON (publique)
 * - Respecte les règles Row Level Security (RLS)
 * - À utiliser pour les routes utilisateurs et publiques
 */
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

/**
 * Client Supabase avec la clé SERVICE_ROLE (privée)
 * - Contourne les règles RLS
 * - Accès administrateur complet
 * - À utiliser UNIQUEMENT pour les routes admin protégées par JWT
 * ⚠️ NE JAMAIS exposer côté client !
 */
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

