# 🚀 Ynov Express - Plateforme Full Stack avec RBAC

Application web complète avec **système de rôles et permissions avancé**, backend Express.js, frontend React et authentification JWT.

![Version](https://img.shields.io/badge/version-3.0-blue)
![Node](https://img.shields.io/badge/node-18+-green)
![License](https://img.shields.io/badge/license-ISC-orange)

---

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Test Rapide](#-test-rapide-5-minutes)
- [Installation Complète](#-installation-complète)
- [Rôles et Permissions](#-rôles-et-permissions)
- [Routes API](#-routes-api)
- [Technologies](#-technologies)
- [Documentation](#-documentation)

---

## ✨ Fonctionnalités

### 🔐 Système RBAC Complet (Role-Based Access Control)

**5 rôles hiérarchiques** avec permissions granulaires :

| Rôle | Emoji | Permissions |
|------|-------|-------------|
| **Guest** | 🔓 | Lecture seule (posts, commentaires, likes) |
| **User** | 👤 | CRUD sur **ses propres** contenus |
| **Moderator** | 👮 | Modération : CRUD sur **tous** les contenus |
| **Admin** | 🛡️ | Administration : Seed, Reset, Diagnostics |
| **Super Admin** | 👑 | Accès total sans restriction |

### 🎯 Fonctionnalités Principales

#### Backend (Express.js)
- ✅ **Authentification JWT** avec tokens sécurisés (24h d'expiration)
- ✅ **RBAC strict** : Vérification des permissions côté serveur
- ✅ **API RESTful** complète (Posts, Commentaires, Likes)
- ✅ **Ownership tracking** : Chaque ressource tracée par utilisateur
- ✅ **Routes admin** : Seed, Reset, Generate, Diagnostics
- ✅ **CORS** configuré par environnement
- ✅ **Validation** des données entrantes
- ✅ **Error handling** avec codes standardisés

#### Frontend (React)
- ✅ **Interface moderne** et responsive (Tailwind CSS)
- ✅ **5 comptes démo** avec boutons de connexion rapide
- ✅ **Permissions UI** : Boutons masqués selon le rôle
- ✅ **Gestion des posts** : Création, édition, suppression
- ✅ **Système de commentaires** avec ownership
- ✅ **Système de likes** avec ownership
- ✅ **Panel d'administration** (admin uniquement)
- ✅ **Filtres et recherche** en temps réel
- ✅ **Indicateur de rôle** toujours visible

#### Sécurité
- ✅ **Double vérification** : Middleware + Controller
- ✅ **Own vs Any** : Permissions différenciées propriétaire/modérateur
- ✅ **Messages explicites** : Erreurs 403 détaillées
- ✅ **RLS Supabase** : Row Level Security activable
- ✅ **Variables d'environnement** pour secrets

---

## ⚡ Test Rapide (5 minutes)

### 1. Prérequis

- **Node.js 18+** ([Télécharger](https://nodejs.org))
- **npm** (inclus avec Node.js)
- **Compte Supabase** gratuit ([Créer un compte](https://supabase.com))

### 2. Cloner et installer

```bash
# Cloner le projet
git clone https://github.com/votre-username/ynov-express.git
cd ynov-express

# Installer les dépendances
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 3. Configuration rapide

**A. Créer la base de données Supabase** :

1. Allez sur https://supabase.com/dashboard
2. Créez un nouveau projet (attendez ~2 min)
3. Allez dans **SQL Editor**
4. Copiez-collez le contenu de `database/demo_schema.sql`
5. Cliquez sur **RUN**
6. Copiez-collez le contenu de `database/migrations/003_add_user_id_columns.sql`
7. Cliquez sur **RUN**

**B. Configurer le backend** :

Créez `backend/.env` :

```env
# Supabase (Settings → API dans votre dashboard)
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre_anon_key_ici
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key_ici

# JWT (générer avec: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=votre_secret_jwt_tres_long_et_securise_ici

# Serveur
PORT=3000
NODE_ENV=development
```

**C. Configurer le frontend** :

Créez `frontend/.env` :

```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Démarrer l'application

**Terminal 1 - Backend** :
```bash
cd backend
npm start
```

✅ Backend démarré sur http://localhost:3000

**Terminal 2 - Frontend** :
```bash
cd frontend
npm run dev
```

✅ Frontend démarré sur http://localhost:5173

### 5. Tester avec les comptes démo

1. Ouvrez http://localhost:5173
2. Cliquez sur un des **5 boutons démo** :

   - 🔓 **Guest** → Lecture seule
   - 👤 **User** → CRUD sur ses contenus
   - 👮 **Moderator** → Modération complète
   - 🛡️ **Admin** → Administration
   - 👑 **Super Admin** → Tout

3. **Testez les différences** :
   - En tant que **Guest** : Essayez de créer un post → ❌ Interdit
   - En tant que **User** : Créez un post → ✅ Autorisé
   - En tant que **Moderator** : Supprimez le post d'un autre → ✅ Autorisé
   - En tant que **Admin** : Accédez au panel Admin → ✅ Autorisé

---

## 🔧 Installation Complète

### Structure du projet

```
ynov-express/
├── backend/                   # Backend Express.js
│   ├── src/
│   │   ├── features/          # Architecture feature-based
│   │   │   ├── auth/          # Authentification JWT
│   │   │   ├── posts/         # Gestion des posts
│   │   │   └── admin/         # Routes admin
│   │   ├── config/            # Configuration centralisée
│   │   │   ├── constants.js   # Rôles, permissions, messages
│   │   │   └── cors.config.js # Configuration CORS
│   │   ├── middleware/        # Middlewares
│   │   │   ├── auth.middleware.js        # Authentification
│   │   │   ├── permissions.middleware.js # RBAC
│   │   │   └── rbac.helpers.js          # Helpers RBAC
│   │   ├── services/          # Services externes
│   │   │   └── supabase.service.js
│   │   └── utils/             # Utilitaires
│   ├── index.js               # Point d'entrée
│   ├── .env                   # Variables d'environnement (à créer)
│   └── package.json
│
├── frontend/                  # Frontend React + Vite
│   ├── src/
│   │   ├── components/        # Composants React
│   │   │   ├── AuthPage.jsx       # Page de connexion (5 boutons démo)
│   │   │   ├── HomePage.jsx       # Page principale
│   │   │   ├── PostCard.jsx       # Carte de post avec permissions
│   │   │   ├── CreatePost.jsx     # Formulaire de création
│   │   │   ├── AdminPanel.jsx     # Panel admin
│   │   │   └── Header.jsx         # En-tête avec rôle
│   │   ├── contexts/          # Context API
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/             # Hooks personnalisés
│   │   │   └── usePermissions.js  # Hook RBAC
│   │   ├── services/          # API client
│   │   │   └── api.js
│   │   └── App.jsx            # Composant racine
│   ├── .env                   # Variables d'environnement (à créer)
│   └── package.json
│
├── database/                  # Base de données
│   ├── demo_schema.sql        # Schéma des tables
│   └── migrations/            # Migrations SQL
│       └── 003_add_user_id_columns.sql
│
├── docs/                      # Documentation
│   ├── api/                   # Documentation API
│   ├── database/              # Documentation BDD
│   ├── guides/                # Guides d'utilisation
│   └── RBAC_GUIDE.md          # Guide RBAC complet
│
├── postman/                   # Collection Postman
│   ├── ynov-express-auth-complete.postman_collection.json
│   └── ynov-express-auth.postman_environment.json
│
├── ROLES_SUMMARY.md           # Résumé des rôles
├── CHANGELOG.md               # Historique des versions
└── README.md                  # Ce fichier
```

### Installation étape par étape

#### 1. Backend

```bash
cd backend
npm install
```

Créez `backend/.env` avec vos clés Supabase (voir section Test Rapide).

Démarrez :
```bash
npm start
# OU pour le développement avec auto-reload
npm run dev
```

Le backend sera accessible sur **http://localhost:3000**

#### 2. Frontend

```bash
cd frontend
npm install
```

Créez `frontend/.env` :
```env
VITE_API_URL=http://localhost:3000/api
```

Démarrez :
```bash
npm run dev
```

Le frontend sera accessible sur **http://localhost:5173**

#### 3. Base de données

Exécutez les scripts SQL dans l'ordre :

1. **`database/demo_schema.sql`** → Crée les tables
2. **`database/migrations/003_add_user_id_columns.sql`** → Ajoute les colonnes user_id

Via **Supabase SQL Editor** ou via un client PostgreSQL.

---

## 👥 Rôles et Permissions

### Tableau complet des permissions

| Action | Guest 🔓 | User 👤 | Moderator 👮 | Admin 🛡️ | Super Admin 👑 |
|--------|----------|---------|--------------|----------|----------------|
| **POSTS** |
| Voir posts | ✅ | ✅ | ✅ | ✅ | ✅ |
| Créer post | ❌ | ✅ | ✅ | ✅ | ✅ |
| Modifier son post | ❌ | ✅ | ✅ | ✅ | ✅ |
| Modifier post autre | ❌ | ❌ | ✅ | ✅ | ✅ |
| Supprimer son post | ❌ | ✅ | ✅ | ✅ | ✅ |
| Supprimer post autre | ❌ | ❌ | ✅ | ✅ | ✅ |
| Publier post | ❌ | ❌ | ✅ | ✅ | ✅ |
| **COMMENTAIRES** |
| Voir commentaires | ✅ | ✅ | ✅ | ✅ | ✅ |
| Créer commentaire | ❌ | ✅ | ✅ | ✅ | ✅ |
| Supprimer son commentaire | ❌ | ✅ | ✅ | ✅ | ✅ |
| Supprimer commentaire autre | ❌ | ❌ | ✅ | ✅ | ✅ |
| **LIKES** |
| Voir likes | ✅ | ✅ | ✅ | ✅ | ✅ |
| Créer like | ❌ | ✅ | ✅ | ✅ | ✅ |
| Supprimer son like | ❌ | ✅ | ✅ | ✅ | ✅ |
| Supprimer like autre | ❌ | ❌ | ✅ | ✅ | ✅ |
| **ADMINISTRATION** |
| Panel Admin | ❌ | ❌ | ❌ | ✅ | ✅ |
| Seed / Reset | ❌ | ❌ | ❌ | ✅ | ✅ |
| Diagnostics | ❌ | ❌ | ❌ | ✅ | ✅ |

### Permissions détaillées par rôle

#### 🔓 Guest (Visiteur)
```javascript
permissions: [
  'posts:read',
  'comments:read',
  'likes:read'
]
```
- Peut **uniquement lire** les contenus
- Aucune création, modification, ou suppression
- Aucun accès au panel admin

#### 👤 User (Utilisateur standard)
```javascript
permissions: [
  'posts:read',
  'posts:create',
  'posts:update:own',    // Ses posts seulement
  'posts:delete:own',    // Ses posts seulement
  'comments:read',
  'comments:create',
  'comments:delete:own', // Ses commentaires seulement
  'likes:read',
  'likes:create',
  'likes:delete:own'     // Ses likes seulement
]
```
- Peut **créer** des posts, commentaires, likes
- Peut **modifier/supprimer** uniquement **ses propres** contenus
- Ne peut pas toucher aux contenus des autres
- Aucun accès au panel admin

#### 👮 Moderator (Modérateur)
```javascript
permissions: [
  'posts:read',
  'posts:create',
  'posts:update:own',
  'posts:update:any',    // Tous les posts
  'posts:delete:own',
  'posts:delete:any',    // Tous les posts
  'posts:publish:any',   // Publier n'importe quel post
  'comments:read',
  'comments:create',
  'comments:delete:own',
  'comments:delete:any', // Tous les commentaires
  'likes:read',
  'likes:create',
  'likes:delete:own',
  'likes:delete:any'     // Tous les likes
]
```
- Tout ce que User peut faire
- Peut **modifier/supprimer n'importe quel** contenu (modération)
- Peut **publier** n'importe quel post
- Toujours pas d'accès au panel admin

#### 🛡️ Admin (Administrateur)
```javascript
permissions: [
  'posts:*',           // Toutes les actions sur posts
  'comments:*',        // Toutes les actions sur commentaires
  'likes:*',           // Toutes les actions sur likes
  'admin:seed',        // Seed données
  'admin:generate',    // Générer données
  'admin:diagnostics'  // Voir diagnostics
]
```
- Tout ce que Moderator peut faire
- **Accès au panel admin**
- Peut **seed, reset, générer** des données
- Accès aux **diagnostics système**

#### 👑 Super Admin
```javascript
permissions: ['*']  // Tout sans restriction
```
- **Accès total** à toutes les fonctionnalités
- Aucune restriction
- Niveau le plus élevé

### Hiérarchie des rôles

```
Super Admin 👑  (Niveau 4)
    ↓
  Admin 🛡️      (Niveau 3)
    ↓
Moderator 👮    (Niveau 2)
    ↓
  User 👤       (Niveau 1)
    ↓
 Guest 🔓       (Niveau 0)
```

Chaque niveau **hérite** des permissions du niveau inférieur.

---

## 📡 Routes API

### Base URL
```
http://localhost:3000/api
```

### Authentification

| Méthode | Route | Description | Auth | Rôle |
|---------|-------|-------------|------|------|
| `POST` | `/auth/generate-token` | Générer un token (DEV) | ❌ | - |
| `POST` | `/auth/generate-admin-token` | Générer un token admin (DEV) | ❌ | - |
| `GET` | `/auth/verify` | Vérifier un token | ❌ | - |
| `GET` | `/auth/me` | Infos utilisateur | ✅ | - |
| `GET` | `/auth/permissions` | Voir ses permissions | ✅ | - |
| `POST` | `/auth/logout` | Se déconnecter | ✅ | - |
| `POST` | `/auth/refresh` | Rafraîchir le token | ✅ | - |

### Posts

| Méthode | Route | Description | Auth | Permission |
|---------|-------|-------------|------|------------|
| `GET` | `/posts` | Liste des posts | ❌ | `posts:read` |
| `GET` | `/posts/:id` | Détails d'un post | ❌ | `posts:read` |
| `POST` | `/posts` | Créer un post | ✅ | `posts:create` |
| `PATCH` | `/posts/:id` | Modifier un post | ✅ | `posts:update:own` / `:any` |
| `DELETE` | `/posts/:id` | Supprimer un post | ✅ | `posts:delete:own` / `:any` |
| `PATCH` | `/posts/:id/publish` | Publier un post | ✅ | Moderator+ |

### Commentaires

| Méthode | Route | Description | Auth | Permission |
|---------|-------|-------------|------|------------|
| `GET` | `/posts/:id/comments` | Liste des commentaires | ❌ | `comments:read` |
| `POST` | `/posts/:id/comments` | Créer un commentaire | ✅ | `comments:create` |
| `DELETE` | `/posts/:postId/comments/:id` | Supprimer un commentaire | ✅ | `comments:delete:own` / `:any` |

### Likes

| Méthode | Route | Description | Auth | Permission |
|---------|-------|-------------|------|------------|
| `GET` | `/posts/:id/likes` | Liste des likes | ❌ | `likes:read` |
| `GET` | `/posts/:id/likes-count` | Nombre de likes | ❌ | `likes:read` |
| `POST` | `/posts/:id/likes` | Ajouter un like | ✅ | `likes:create` |
| `DELETE` | `/posts/:postId/likes/:id` | Supprimer un like | ✅ | `likes:delete:own` / `:any` |

### Admin

| Méthode | Route | Description | Auth | Rôle |
|---------|-------|-------------|------|------|
| `GET` | `/admin/health` | Health check | ❌ | - |
| `POST` | `/admin/reset` | Vider toutes les tables | ✅ | Admin |
| `POST` | `/admin/seed` | Seed données de test | ✅ | Admin |
| `POST` | `/admin/generate` | Générer données aléatoires | ✅ | Admin |
| `GET` | `/admin/diagnostics` | Diagnostics système | ✅ | Admin |

### Exemples de requêtes

**Créer un token (DEV uniquement)** :
```bash
curl -X POST http://localhost:3000/api/auth/generate-token \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "role": "user"
  }'
```

**Créer un post** :
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mon premier post",
    "content": "Contenu du post"
  }'
```

**Voir ses permissions** :
```bash
curl -X GET http://localhost:3000/api/auth/permissions \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

---

## 🛠️ Technologies

### Backend
- **[Express.js](https://expressjs.com/)** - Framework web minimaliste
- **[Node.js](https://nodejs.org/)** - Runtime JavaScript
- **[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)** - Authentification JWT
- **[dotenv](https://github.com/motdotla/dotenv)** - Variables d'environnement
- **[cors](https://github.com/expressjs/cors)** - CORS middleware
- **[@supabase/supabase-js](https://supabase.com/docs/reference/javascript)** - Client Supabase

### Frontend
- **[React 18](https://react.dev/)** - Bibliothèque UI
- **[Vite](https://vitejs.dev/)** - Build tool ultra-rapide
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Lucide React](https://lucide.dev/)** - Icônes modernes

### Base de données
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service (PostgreSQL)
- **PostgreSQL** - Base de données relationnelle

### DevOps
- **[Postman](https://www.postman.com/)** - Tests API
- **[Vercel](https://vercel.com/)** - Déploiement frontend
- **[Railway](https://railway.app/)** - Déploiement backend

---

## 📚 Documentation

### Guides d'utilisation

- **[ROLES_SUMMARY.md](ROLES_SUMMARY.md)** ⭐ - Résumé rapide des 5 rôles
- **[docs/RBAC_GUIDE.md](docs/RBAC_GUIDE.md)** - Guide complet du système RBAC
- **[docs/guides/FRONTEND_GUIDE.md](docs/guides/FRONTEND_GUIDE.md)** - Guide d'utilisation du frontend
- **[CHANGELOG.md](CHANGELOG.md)** - Historique des versions

### Documentation API

- **[docs/api/AUTH_SETUP.md](docs/api/AUTH_SETUP.md)** - Configuration authentification JWT
- **[docs/api/CORS_GUIDE.md](docs/api/CORS_GUIDE.md)** - Configuration CORS pour production
- **[docs/api/POSTMAN_AUTH_GUIDE.md](docs/api/POSTMAN_AUTH_GUIDE.md)** - Tester l'API avec Postman

### Documentation Base de données

- **[docs/database/SUPABASE_KEYS_GUIDE.md](docs/database/SUPABASE_KEYS_GUIDE.md)** - Récupérer vos clés Supabase
- **[database/demo_schema.sql](database/demo_schema.sql)** - Schéma complet des tables

### Déploiement

- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Guide de déploiement complet

---

## 🧪 Tests

### Avec Postman

1. Importez la collection : `postman/ynov-express-auth-complete.postman_collection.json`
2. Importez l'environnement : `postman/ynov-express-auth.postman_environment.json`
3. Configurez l'URL dans l'environnement : `http://localhost:3000/api`
4. Lancez le **Collection Runner**
5. Tous les tests devraient passer ✅

### Tests manuels avec les comptes démo

#### Test 1 : Guest (Lecture seule)
1. Connectez-vous avec 🔓 **Guest**
2. Essayez de créer un post → ❌ Message : "Vous n'avez pas la permission"
3. Essayez de liker → ❌ Bouton masqué
4. Vous pouvez lire les posts → ✅

#### Test 2 : User (CRUD propre contenu)
1. Connectez-vous avec 👤 **User**
2. Créez un post → ✅ Autorisé
3. Modifiez votre post → ✅ Autorisé
4. Essayez de modifier le post d'un autre → ❌ Boutons masqués
5. Supprimez votre post → ✅ Autorisé

#### Test 3 : Moderator (Modération)
1. Connectez-vous avec 👮 **Moderator**
2. Créez un post → ✅ Autorisé
3. Modifiez le post d'un autre → ✅ Autorisé (bouton visible)
4. Supprimez le post d'un autre → ✅ Autorisé (bouton visible)
5. Publiez un post → ✅ Autorisé
6. Essayez d'accéder au panel admin → ❌ Refusé

#### Test 4 : Admin (Administration)
1. Connectez-vous avec 🛡️ **Admin**
2. Cliquez sur l'onglet **Admin** → ✅ Visible et accessible
3. Seedez des données → ✅ Autorisé
4. Resetez la base → ✅ Autorisé
5. Voir les diagnostics → ✅ Autorisé

#### Test 5 : Super Admin (Tout)
1. Connectez-vous avec 👑 **Super Admin**
2. Tout est accessible sans restriction → ✅

---

## 🚀 Déploiement

### Backend sur Railway

1. Créez un compte sur [Railway.app](https://railway.app)
2. Créez un nouveau projet
3. Connectez votre repo GitHub
4. Configurez :
   ```
   Root Directory: backend
   Start Command: npm start
   ```
5. Ajoutez les variables d'environnement :
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
   - `NODE_ENV=production`
6. Déployez !

### Frontend sur Vercel

1. Créez un compte sur [Vercel.com](https://vercel.com)
2. Importez votre repo GitHub
3. Configurez :
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```
4. Ajoutez la variable d'environnement :
   ```
   VITE_API_URL=https://votre-backend-railway.up.railway.app/api
   ```
5. Déployez !

**Documentation complète** : [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. **Fork** le projet
2. Créez une **branche** : `git checkout -b feature/nouvelle-fonctionnalite`
3. **Commitez** : `git commit -m 'Ajout d'une nouvelle fonctionnalité'`
4. **Push** : `git push origin feature/nouvelle-fonctionnalite`
5. Ouvrez une **Pull Request**

---

## 🐛 Problèmes fréquents

### Le backend ne démarre pas

**Erreur** : `secretOrPrivateKey must have a value`

**Solution** : Vérifiez que `JWT_SECRET` est bien défini dans `backend/.env`

---

### Le frontend ne se connecte pas au backend

**Erreur** : `Network Error` ou `CORS error`

**Solution** :
1. Vérifiez que le backend est bien démarré sur le port 3000
2. Vérifiez que `VITE_API_URL=http://localhost:3000/api` dans `frontend/.env`
3. Redémarrez le frontend

---

### Erreur 403 sur les routes

**Erreur** : `Permission refusée`

**Solution** :
1. Vérifiez votre rôle (affiché dans le header)
2. Consultez le [ROLES_SUMMARY.md](ROLES_SUMMARY.md) pour voir les permissions
3. Utilisez un compte démo avec le bon rôle

---

## 📝 Licence

ISC - Projet éducatif Ynov

---

## 👤 Auteur

Projet réalisé dans le cadre de la formation **Ynov - Express.js**

---

## 🆘 Support

Pour toute question ou problème :

1. **Documentation** : Consultez les fichiers dans `docs/`
2. **Résumé des rôles** : Lisez [ROLES_SUMMARY.md](ROLES_SUMMARY.md)
3. **Issues** : Ouvrez une issue sur GitHub
4. **Formateur** : Contactez votre formateur Ynov

---

## 🎉 Démarrage rapide - Récapitulatif

```bash
# 1. Cloner
git clone https://github.com/votre-username/ynov-express.git
cd ynov-express

# 2. Installer
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 3. Configurer
# - Créez backend/.env avec vos clés Supabase
# - Créez frontend/.env avec VITE_API_URL
# - Exécutez les scripts SQL sur Supabase

# 4. Démarrer
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend
cd frontend && npm run dev

# 5. Tester
# Ouvrez http://localhost:5173
# Cliquez sur un bouton démo (🔓 👤 👮 🛡️ 👑)
```

**🎊 Bon développement !**

Pour plus de détails, consultez [ROLES_SUMMARY.md](ROLES_SUMMARY.md) ou [docs/RBAC_GUIDE.md](docs/RBAC_GUIDE.md)
