import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Import routes
import authRouter from './src/features/auth/auth.routes.js'
import postsRouter from './src/features/posts/posts.routes.js'
import adminRouter from './src/features/admin/admin.routes.js'

// Import middleware
import { checkEnvVariables } from './src/middleware/auth.middleware.js'

// Import CORS configuration
import corsOptions, { corsLogger, displayAllowedOrigins } from './src/config/cors.config.js'

// Load environment variables
dotenv.config()

// Vérifier les variables d'environnement au démarrage
checkEnvVariables()

const app = express()

// Middlewares globaux
app.use(express.json())
app.use(corsLogger) // Logger CORS (optionnel)
app.use(cors(corsOptions)) // CORS sécurisé

// Routes
app.use('/api', authRouter)
app.use('/api', postsRouter)
app.use('/api', adminRouter)

// Health check principal
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    message: '✨ API Ynov Express fonctionnelle',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    environment: {
      node: process.version,
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasSupabase: !!process.env.SUPABASE_URL,
    }
  })
})

// Route 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route non trouvée',
    message: `La route ${req.method} ${req.path} n'existe pas`,
    code: 'ROUTE_NOT_FOUND'
  })
})

// Gestionnaire d'erreurs global
app.use((error, req, res, next) => {
  console.error('❌ Erreur serveur:', error)
  res.status(500).json({
    success: false,
    error: 'Erreur serveur',
    message: error.message,
    code: 'INTERNAL_SERVER_ERROR'
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🚀 Serveur Backend démarré avec succès!')
  console.log(`📡 URL: http://localhost:${PORT}`)
  console.log(`🔐 Auth: JWT activé`)
  console.log(`🗄️  Database: Supabase connecté`)
  displayAllowedOrigins() // Afficher les origines CORS
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
})

