# 🔧 Backend - Ynov Express API

API REST avec Express.js, authentification JWT et Supabase.

## 📁 Structure

```
backend/
├── src/
│   ├── features/           # Fonctionnalités (architecture feature-based)
│   │   ├── auth/           # Authentification JWT
│   │   │   ├── auth.routes.js
│   │   │   └── auth.controller.js
│   │   ├── posts/          # Gestion des posts
│   │   │   ├── posts.routes.js
│   │   │   └── posts.controller.js
│   │   └── admin/          # Administration
│   │       ├── admin.routes.js
│   │       └── admin.controller.js
│   ├── config/             # Configuration
│   │   └── constants.js
│   ├── middleware/         # Middlewares
│   │   └── auth.middleware.js
│   ├── utils/              # Utilitaires
│   │   └── validators.js
│   └── services/           # Services
│       └── supabase.service.js
├── index.js                # Point d'entrée
├── package.json
└── .env                    # Variables d'environnement
```

## 🚀 Installation

```bash
npm install
```

## ⚙️ Configuration

Créez un fichier `.env` :

```env
SUPABASE_URL=votre_url_supabase
SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
JWT_SECRET=votre_secret_jwt
PORT=3000
```

## 🏃 Démarrage

```bash
# Production
npm start

# Développement (avec auto-reload)
npm run dev
```

Le serveur sera accessible sur `http://localhost:3000`.

## 📡 Routes principales

### Authentification (`/api/auth`)

- `POST /auth/generate-token` - Générer un token utilisateur
- `POST /auth/generate-admin-token` - Générer un token admin
- `GET /auth/verify` - Vérifier un token
- `GET /auth/me` - Informations utilisateur 🔒

### Posts (`/api/posts`)

- `GET /posts` - Liste des posts
- `POST /posts` - Créer un post 🔒
- `GET /posts/:id` - Détails d'un post
- `PATCH /posts/:id` - Modifier un post 🔒
- `DELETE /posts/:id` - Supprimer un post 🔒

### Commentaires

- `GET /posts/:id/comments` - Liste des commentaires
- `POST /posts/:id/comments` - Créer un commentaire 🔒
- `DELETE /posts/:postId/comments/:commentId` - Supprimer un commentaire 🔒

### Likes

- `GET /posts/:id/likes` - Liste des likes
- `GET /posts/:id/likes-count` - Nombre de likes
- `POST /posts/:id/likes` - Ajouter un like 🔒
- `DELETE /posts/:postId/likes/:likeId` - Supprimer un like 🔒

### Admin (`/api/admin`)

- `GET /admin/health` - Health check admin
- `POST /admin/reset` - Vider les tables 🔒👑
- `POST /admin/seed` - Seed données 🔒👑
- `POST /admin/generate` - Générer données 🔒👑
- `GET /admin/diagnostics` - Diagnostics 🔒👑

🔒 = Authentification requise  
👑 = Rôle admin requis

## 🔐 Sécurité

- **JWT** : Tokens avec expiration (24h)
- **CORS** : Protection contre les requêtes cross-origin
- **RLS** : Row Level Security avec Supabase
- **Validation** : Validation des données entrantes
- **Middleware** : Protection des routes sensibles

## 🧪 Tests

Utilisez la collection Postman dans `../postman/` pour tester l'API.

## 📚 Documentation

Consultez la documentation complète dans `../docs/` :

- [Guide d'authentification](../docs/api/AUTH_SETUP.md)
- [Guide Postman](../docs/api/POSTMAN_AUTH_GUIDE.md)
- [Guide Supabase](../docs/database/SUPABASE_KEYS_GUIDE.md)

## 🛠️ Technologies

- **Express.js** - Framework web
- **Supabase** - Base de données PostgreSQL
- **JWT** - Authentification
- **dotenv** - Variables d'environnement
- **CORS** - Gestion des origines

## 📝 Architecture

Cette API suit une **architecture feature-based** où chaque fonctionnalité (feature) est isolée dans son propre dossier avec :

- `*.routes.js` - Définition des routes
- `*.controller.js` - Logique métier

Avantages :
- ✅ Scalable
- ✅ Maintenable
- ✅ Testable
- ✅ Organisé

## 🐛 Debug

Pour activer les logs de debug :

```bash
DEBUG=* npm start
```

## 📦 Déploiement

### Render / Railway

```yaml
build: npm install
start: npm start
env:
  - SUPABASE_URL
  - SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY
  - JWT_SECRET
  - PORT
```

### Docker

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Assurez-vous de suivre l'architecture feature-based existante.

