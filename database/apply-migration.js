import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', 'backend', '.env') })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyMigration(migrationFile) {
  console.log(`\n🔄 Application de la migration: ${migrationFile}`)
  
  const migrationPath = path.join(__dirname, 'migrations', migrationFile)
  const sql = fs.readFileSync(migrationPath, 'utf8')
  
  // Split by semicolons to execute multiple statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))
  
  for (const statement of statements) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement })
      
      if (error) {
        console.error(`❌ Erreur:`, error.message)
        // Try alternative method
        console.log('⚠️  Tentative avec méthode alternative...')
        const { error: altError } = await supabase.from('_migrations').insert({ 
          query: statement,
          applied_at: new Date().toISOString()
        })
        
        if (altError) {
          console.error(`❌ Échec:`, altError.message)
        }
      } else {
        console.log(`✅ Statement exécuté avec succès`)
      }
    } catch (err) {
      console.error(`❌ Exception:`, err.message)
    }
  }
}

async function main() {
  console.log('🚀 Début de la migration RBAC')
  console.log('=' .repeat(50))
  
  await applyMigration('003_add_user_id_columns.sql')
  
  console.log('\n' + '='.repeat(50))
  console.log('✅ Migration terminée !')
  console.log('\n💡 Note: Vous devrez peut-être appliquer la migration manuellement via le dashboard Supabase')
  console.log('   SQL Editor → Nouveau query → Copiez le contenu de database/migrations/003_add_user_id_columns.sql')
}

main()

