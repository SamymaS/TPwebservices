# 🚀 Ynov Express - API Full Stack

Application full stack moderne avec backend Express.js et frontend React, utilisant Supabase comme base de données et JWT pour l'authentification.

## 📐 Architecture du projet

```
ynov-express/
├── 📁 backend/                    # Backend Express.js
│   ├── src/
│   │   ├── features/              # Fonctionnalités (feature-based architecture)
│   │   │   ├── auth/              # Authentification JWT
│   │   │   ├── posts/             # Gestion des posts
│   │   │   ├── comments/          # (à venir)
│   │   │   ├── likes/             # (à venir)
│   │   │   └── admin/             # Administration
│   │   ├── config/                # Configuration
│   │   ├── middleware/            # Middlewares
│   │   ├── utils/                 # Utilitaires
│   │   └── services/              # Services (Supabase, etc.)
│   ├── index.js                   # Point d'entrée
│   └── package.json
│
├── 📁 frontend/                   # Frontend React + Vite
│   ├── src/
│   │   ├── components/            # Composants React
│   │   ├── contexts/              # Context API
│   │   └── services/              # API client
│   └── package.json
│
├── 📁 docs/                       # Documentation
│   ├── api/                       # Documentation API
│   ├── database/                  # Documentation base de données
│   └── guides/                    # Guides d'utilisation
│
├── 📁 database/                   # Schémas SQL
│   ├── schema.sql
│   └── demo_schema.sql
│
└── 📁 postman/                    # Collections Postman
```

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+
- Compte Supabase
- npm ou yarn

### Installation

#### 1. Backend

```bash
cd backend
npm install
```

Créez un fichier `.env` dans le dossier `backend/` :

```env
# Supabase
SUPABASE_URL=votre_url_supabase
SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key

# JWT
JWT_SECRET=votre_secret_jwt

# Port (optionnel)
PORT=3000
```

Démarrez le serveur :

```bash
npm start
# ou en mode développement avec auto-reload
npm run dev
```

Le backend sera accessible sur `http://localhost:3000`

#### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

## 📚 Documentation

### API

- **[AUTH_SETUP.md](docs/api/AUTH_SETUP.md)** - Configuration de l'authentification JWT
- **[POSTMAN_AUTH_GUIDE.md](docs/api/POSTMAN_AUTH_GUIDE.md)** - Guide d'utilisation Postman

### Base de données

- **[SUPABASE_KEYS_GUIDE.md](docs/database/SUPABASE_KEYS_GUIDE.md)** - Guide des clés Supabase

### Guides

- **[FRONTEND_GUIDE.md](docs/guides/FRONTEND_GUIDE.md)** - Guide du frontend React

## 🔑 Principales fonctionnalités

### Backend

- ✅ **Authentification JWT** - Génération et validation de tokens
- ✅ **API RESTful** - Posts, commentaires, likes
- ✅ **Middleware RBAC** - Contrôle d'accès basé sur les rôles
- ✅ **Administration** - Routes admin pour reset/seed/generate
- ✅ **Supabase** - Intégration complète avec RLS
- ✅ **Validation** - Validation des données entrantes
- ✅ **Gestion d'erreurs** - Gestion centralisée des erreurs

### Frontend

- ✅ **React 18** - Interface utilisateur moderne
- ✅ **Vite** - Build ultra-rapide
- ✅ **Tailwind CSS** - Styling moderne
- ✅ **Context API** - Gestion d'état globale
- ✅ **API Client** - Communication avec le backend
- ✅ **Authentification** - Connexion/déconnexion
- ✅ **CRUD Posts** - Création, édition, suppression
- ✅ **Commentaires & Likes** - Interactions sociales
- ✅ **Panel Admin** - Interface d'administration

## 🛠️ Technologies utilisées

### Backend

- **Express.js** - Framework web
- **Supabase** - Base de données PostgreSQL
- **JWT** - Authentification
- **dotenv** - Variables d'environnement
- **CORS** - Gestion des origines

### Frontend

- **React** - Bibliothèque UI
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **Lucide React** - Icônes

## 📡 Routes API principales

### Authentification

- `POST /api/auth/generate-token` - Générer un token utilisateur
- `POST /api/auth/generate-admin-token` - Générer un token admin
- `GET /api/auth/verify` - Vérifier un token
- `GET /api/auth/me` - Informations utilisateur

### Posts

- `GET /api/posts` - Liste des posts
- `POST /api/posts` - Créer un post 🔒
- `GET /api/posts/:id` - Détails d'un post
- `PATCH /api/posts/:id` - Modifier un post 🔒
- `DELETE /api/posts/:id` - Supprimer un post 🔒

### Admin

- `POST /api/admin/reset` - Vider les tables 🔒👑
- `POST /api/admin/seed` - Seed données 🔒👑
- `POST /api/admin/generate` - Générer données 🔒👑
- `GET /api/admin/diagnostics` - Diagnostics 🔒👑

🔒 = Authentification requise  
👑 = Rôle admin requis

## 🧪 Tests

Utilisez la collection Postman fournie dans le dossier `postman/` pour tester l'API :

1. Importez `ynov-express-auth-complete.postman_collection.json`
2. Importez `ynov-express-auth.postman_environment.json`
3. Lancez le Collection Runner pour tester automatiquement

## 🔐 Sécurité

- ✅ JWT avec expiration (24h)
- ✅ Variables d'environnement sécurisées
- ✅ Row Level Security (RLS) sur Supabase
- ✅ Séparation clés ANON / SERVICE_ROLE
- ✅ Validation des données
- ✅ Protection CORS

## 📝 Licence

ISC

## 👤 Auteur

Projet Ynov - Formation Express.js

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.
