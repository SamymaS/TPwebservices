// Configuration Jest pour les tests
// Charger les variables d'environnement de test si nécessaire
import dotenv from 'dotenv';

// Charger .env.test si disponible, sinon .env
dotenv.config({ path: '.env.test' });
dotenv.config(); // Fallback sur .env

// Variables d'environnement par défaut pour les tests
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-key-for-testing';
process.env.NODE_ENV = 'test';

