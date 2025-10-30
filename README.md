# 🚀 Ynov Express - API Full Stack

Application web complète avec backend Express.js, frontend React et authentification JWT.

## 📋 Présentation

Ce projet est une API REST moderne avec :
- **Backend** : Express.js + JWT + Supabase (PostgreSQL)
- **Frontend** : React + Vite + Tailwind CSS
- **Sécurité** : Authentification JWT, CORS configuré, RLS
- **Architecture** : Feature-based, scalable et maintenable

## 🎯 Fonctionnalités

### Backend
- ✅ Authentification JWT avec tokens sécurisés
- ✅ API RESTful complète (Posts, Commentaires, Likes)
- ✅ Contrôle d'accès par rôles (User / Admin)
- ✅ Routes admin pour gestion de données
- ✅ CORS configuré pour production
- ✅ Validation des données

### Frontend
- ✅ Interface moderne et responsive
- ✅ Authentification complète
- ✅ Gestion des posts (CRUD)
- ✅ Système de commentaires et likes
- ✅ Panel d'administration
- ✅ Filtres et recherche

## 📁 Structure du projet

```
ynov-express/
├── backend/                # Backend Express.js
│   ├── src/
│   │   ├── features/       # Fonctionnalités (auth, posts, admin)
│   │   ├── config/         # Configuration
│   │   ├── middleware/     # Middlewares
│   │   ├── services/       # Services (Supabase)
│   │   └── utils/          # Utilitaires
│   ├── index.js            # Point d'entrée
│   └── package.json
│
├── frontend/               # Frontend React + Vite
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── contexts/       # Context API
│   │   └── services/       # API client
│   └── package.json
│
├── docs/                   # Documentation
├── database/               # Schémas SQL
└── postman/               # Collection Postman
```

## 🚀 Installation

### Prérequis

- Node.js 18+
- Compte Supabase (gratuit)
- npm ou yarn

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/ynov-express.git
cd ynov-express
```

### 2. Configuration Backend

```bash
cd backend
npm install
```

Créez un fichier `.env` :

```env
# Supabase (https://supabase.com/dashboard)
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key

# JWT (générer avec: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=votre_secret_jwt_securise

# Serveur
PORT=3000
NODE_ENV=development
```

Démarrez le backend :

```bash
npm start
```

Le backend sera accessible sur `http://localhost:3000`

### 3. Configuration Frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

## 🗄️ Configuration Supabase

### 1. Créer un projet Supabase

1. Allez sur https://supabase.com
2. Créez un nouveau projet
3. Attendez la création (~2 minutes)

### 2. Créer les tables

Dans l'éditeur SQL de Supabase, exécutez :

```sql
-- Voir database/demo_schema.sql pour le schéma complet
```

### 3. Récupérer les clés

1. Settings → API
2. Copiez :
   - `Project URL` → `SUPABASE_URL`
   - `anon public` → `SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

## 🧪 Tests avec Postman

1. Importez `postman/ynov-express-auth-complete.postman_collection.json`
2. Importez `postman/ynov-express-auth.postman_environment.json`
3. Lancez le Collection Runner

## 📡 Routes API

### Authentification

```
POST   /api/auth/generate-token        Générer un token
POST   /api/auth/generate-admin-token  Générer un token admin
GET    /api/auth/verify                Vérifier un token
GET    /api/auth/me                    Info utilisateur 🔒
```

### Posts

```
GET    /api/posts                      Liste des posts
POST   /api/posts                      Créer un post 🔒
GET    /api/posts/:id                  Détails d'un post
PATCH  /api/posts/:id                  Modifier un post 🔒
DELETE /api/posts/:id                  Supprimer un post 🔒
PATCH  /api/posts/:id/publish          Publier un post 🔒
```

### Commentaires & Likes

```
GET    /api/posts/:id/comments         Liste des commentaires
POST   /api/posts/:id/comments         Ajouter un commentaire 🔒
DELETE /api/posts/:postId/comments/:id Supprimer un commentaire 🔒

GET    /api/posts/:id/likes            Liste des likes
POST   /api/posts/:id/likes            Ajouter un like 🔒
DELETE /api/posts/:postId/likes/:id    Supprimer un like 🔒
```

### Admin

```
GET    /api/admin/health               Health check
POST   /api/admin/reset                Vider les tables 🔒👑
POST   /api/admin/seed                 Seed données 🔒👑
POST   /api/admin/generate             Générer données 🔒👑
GET    /api/admin/diagnostics          Diagnostics 🔒👑
```

🔒 = Authentification requise  
👑 = Rôle admin requis

## 🔐 Sécurité

- ✅ Tokens JWT avec expiration (24h)
- ✅ Mots de passe stockés de manière sécurisée
- ✅ CORS configuré par environnement
- ✅ Variables d'environnement pour les secrets
- ✅ Row Level Security (RLS) sur Supabase
- ✅ Validation des données entrantes

## 🚀 Déploiement

### Backend (Railway/Render)

1. Créez un compte sur [Railway](https://railway.app) ou [Render](https://render.com)
2. Connectez votre repo GitHub
3. Configurez :
   - Root Directory: `backend`
   - Start Command: `npm start`
4. Ajoutez les variables d'environnement
5. Déployez !

### Frontend (Vercel/Netlify)

1. Créez un compte sur [Vercel](https://vercel.com) ou [Netlify](https://netlify.com)
2. Connectez votre repo GitHub
3. Configurez :
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Ajoutez la variable : `VITE_API_URL=https://votre-backend.com`
5. Déployez !

**Voir la documentation complète** : [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)

## 📚 Documentation

- **[docs/api/AUTH_SETUP.md](docs/api/AUTH_SETUP.md)** - Configuration authentification
- **[docs/api/CORS_GUIDE.md](docs/api/CORS_GUIDE.md)** - Configuration CORS
- **[docs/api/POSTMAN_AUTH_GUIDE.md](docs/api/POSTMAN_AUTH_GUIDE.md)** - Guide Postman
- **[docs/database/SUPABASE_KEYS_GUIDE.md](docs/database/SUPABASE_KEYS_GUIDE.md)** - Guide Supabase
- **[docs/guides/FRONTEND_GUIDE.md](docs/guides/FRONTEND_GUIDE.md)** - Guide frontend
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Guide de déploiement

## 🛠️ Technologies utilisées

| Catégorie | Technologies |
|-----------|-------------|
| **Backend** | Express.js, Node.js, JWT |
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Base de données** | Supabase (PostgreSQL) |
| **Authentification** | JWT (JSON Web Tokens) |
| **Style** | Tailwind CSS |
| **Tests** | Postman |

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit vos changements (`git commit -m 'Ajout fonctionnalité'`)
4. Push (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

## 📝 Licence

ISC

## 👤 Auteur

Projet réalisé dans le cadre de la formation Ynov - Express.js

## 🆘 Support

Pour toute question :
- Consultez la documentation dans `docs/`
- Ouvrez une issue sur GitHub
- Contactez votre formateur

---

**🎉 Bon développement !**

Pour démarrer rapidement :
```bash
# Terminal 1 - Backend
cd backend && npm install && npm start

# Terminal 2 - Frontend
cd frontend && npm install && npm run dev
```

Puis ouvrez http://localhost:5173
