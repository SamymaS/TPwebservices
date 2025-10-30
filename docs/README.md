# 📚 Documentation Ynov Express

Bienvenue dans la documentation complète du projet Ynov Express !

## 📖 Structure de la documentation

### 📡 API

- **[AUTH_SETUP.md](api/AUTH_SETUP.md)** - Guide de configuration de l'authentification JWT
- **[POSTMAN_AUTH_GUIDE.md](api/POSTMAN_AUTH_GUIDE.md)** - Guide complet pour tester l'API avec Postman

### 🗄️ Base de données

- **[SUPABASE_KEYS_GUIDE.md](database/SUPABASE_KEYS_GUIDE.md)** - Explication des différentes clés Supabase et leur utilisation

### 📖 Guides

- **[FRONTEND_GUIDE.md](guides/FRONTEND_GUIDE.md)** - Guide d'utilisation et de développement du frontend React

## 🚀 Par où commencer ?

### Pour les développeurs Backend

1. Lisez d'abord [AUTH_SETUP.md](api/AUTH_SETUP.md) pour comprendre l'authentification
2. Consultez [SUPABASE_KEYS_GUIDE.md](database/SUPABASE_KEYS_GUIDE.md) pour configurer Supabase
3. Utilisez [POSTMAN_AUTH_GUIDE.md](api/POSTMAN_AUTH_GUIDE.md) pour tester vos routes

### Pour les développeurs Frontend

1. Commencez par [FRONTEND_GUIDE.md](guides/FRONTEND_GUIDE.md)
2. Consultez [AUTH_SETUP.md](api/AUTH_SETUP.md) pour comprendre l'intégration JWT

## 📝 Notes importantes

- Toutes les routes protégées nécessitent un token JWT valide
- Les routes admin nécessitent un rôle "admin" en plus du token
- Les variables d'environnement doivent être configurées avant le démarrage

## 🔗 Liens utiles

- [Retour au README principal](../README.md)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Express.js](https://expressjs.com/)
- [Documentation React](https://react.dev/)

