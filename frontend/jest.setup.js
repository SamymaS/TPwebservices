// Setup Jest - chargé AVANT les modules de test
// Définir import.meta.env pour les tests (Vite utilise import.meta.env)
if (typeof globalThis.import === 'undefined') {
  globalThis.import = {
    meta: {
      env: {
        VITE_API_URL: process.env.VITE_API_URL || 'http://localhost:3000'
      }
    }
  };
}

