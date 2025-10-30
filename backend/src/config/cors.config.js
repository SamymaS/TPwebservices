/**
 * Configuration CORS sécurisée
 * Définit les origines autorisées et les options CORS
 */

// Origines autorisées en fonction de l'environnement
const getAllowedOrigins = () => {
  const origins = []

  // Environnement de développement
  if (process.env.NODE_ENV !== 'production') {
    origins.push(
      'http://localhost:5173',  // Vite dev server
      'http://localhost:3000',  // Alternative locale
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000'
    )
  }

  // Origines personnalisées depuis les variables d'environnement
  if (process.env.ALLOWED_ORIGINS) {
    const customOrigins = process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    origins.push(...customOrigins)
  }

  // Si aucune origine n'est définie, autoriser uniquement localhost en dev
  if (origins.length === 0 && process.env.NODE_ENV !== 'production') {
    origins.push('http://localhost:5173')
  }

  return origins
}

/**
 * Options CORS
 */
export const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins()
    
    // Autoriser les requêtes sans origine (comme curl, Postman, apps mobiles)
    if (!origin) {
      return callback(null, true)
    }

    // Vérifier si l'origine est autorisée
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.warn(`❌ Origine non autorisée: ${origin}`)
      callback(new Error('Non autorisé par CORS'))
    }
  },
  credentials: true, // Autoriser les cookies et les credentials
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Méthodes HTTP autorisées
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ], // Headers autorisés
  exposedHeaders: ['Authorization'], // Headers exposés au client
  maxAge: 86400, // Cache preflight pendant 24h (en secondes)
  optionsSuccessStatus: 200 // Pour compatibilité avec anciens navigateurs
}

/**
 * Middleware CORS pour logging (optionnel)
 */
export const corsLogger = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log(`🔍 Preflight CORS: ${req.method} ${req.path} from ${req.headers.origin || 'unknown'}`)
  }
  next()
}

/**
 * Afficher les origines autorisées au démarrage
 */
export const displayAllowedOrigins = () => {
  const origins = getAllowedOrigins()
  console.log('🔐 CORS - Origines autorisées:')
  origins.forEach(origin => console.log(`   ✓ ${origin}`))
  
  if (process.env.NODE_ENV === 'production' && origins.length === 0) {
    console.warn('⚠️  ATTENTION: Aucune origine CORS autorisée en production!')
  }
}

export default corsOptions

