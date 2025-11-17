# Guide OpenAPI et DTOs - Documentation Swagger

## 📋 Vue d'ensemble

Ce document décrit l'implémentation de la documentation OpenAPI avec Swagger JSDoc et Swagger UI Express, ainsi que la définition des DTOs (Data Transfer Objects) pour l'API Ynov Express.

## 🛠️ Technologies utilisées

- **swagger-jsdoc** (v6.2.8) : Génération automatique de la spécification OpenAPI à partir de commentaires JSDoc
- **swagger-ui-express** (v5.0.1) : Interface utilisateur interactive pour explorer et tester l'API

## 📁 Structure des fichiers

```
backend/
├── src/
│   ├── config/
│   │   └── swagger.config.js          # Configuration principale Swagger
│   ├── docs/
│   │   └── swagger.schemas.js         # Définitions des DTOs et schémas
│   └── features/
│       ├── auth/
│       │   └── auth.routes.js         # Routes avec annotations Swagger
│       ├── posts/
│       │   └── posts.routes.js        # Routes avec annotations Swagger
│       └── admin/
│           └── admin.routes.js        # Routes avec annotations Swagger
└── index.js                           # Intégration Swagger UI
```

## 🔧 Configuration Swagger

### Fichier `swagger.config.js`

Ce fichier configure la spécification OpenAPI de base :

- **Version OpenAPI** : 3.0.3
- **Titre** : Ynov Express API
- **Version API** : 3.0.0
- **Sécurité** : Authentification Bearer JWT
- **Serveurs** : Configuration dynamique via variable d'environnement `API_URL`

Les routes sont automatiquement scannées depuis :
- `./src/features/**/*.routes.js`
- `./src/docs/**/*.js`

## 📦 DTOs (Data Transfer Objects) définis

Tous les DTOs sont définis dans `swagger.schemas.js` et réutilisables dans toute la documentation.

### 🔐 Authentification

#### `AuthTokenRequest`
DTO pour la génération de tokens (DEV ONLY)

```yaml
properties:
  userId: string (optionnel)
  email: string (requis)
  role: enum [user, moderator, admin] (requis)
```

#### `AuthTokenResponse`
Réponse standardisée pour les tokens

```yaml
properties:
  success: boolean
  access_token: string
  token_type: "Bearer"
  expires_in: integer (secondes)
  expires_at: date-time
  user: PublicUser
```

#### `PasswordResetRequest`
Demande de réinitialisation de mot de passe

```yaml
properties:
  email: string (format: email, requis)
```

#### `PasswordUpdateRequest`
Mise à jour du mot de passe avec token

```yaml
properties:
  token: string (requis)
  password: string (minLength: 6, requis)
```

#### `PublicUser`
Informations publiques d'un utilisateur

```yaml
properties:
  id: string
  email: string (format: email)
  role: enum [user, moderator, admin]
```

### 📝 Posts

#### `Post`
Modèle complet d'un post

```yaml
properties:
  id: string
  title: string
  content: string
  is_published: boolean
  published_at: date-time (nullable)
  user_id: string
  created_at: date-time
  updated_at: date-time
```

#### `CreatePostInput`
DTO pour la création d'un post

```yaml
properties:
  title: string (requis)
  content: string (requis)
```

#### `UpdatePostInput`
DTO pour la mise à jour d'un post

```yaml
properties:
  title: string (optionnel)
  content: string (optionnel)
```

### 💬 Commentaires

#### `Comment`
Modèle complet d'un commentaire

```yaml
properties:
  id: string
  post: string (ID du post)
  content: string
  user_id: string
  created_at: date-time
```

#### `CreateCommentInput`
DTO pour la création d'un commentaire

```yaml
properties:
  content: string (minLength: 2, maxLength: 280, requis)
```

### ❤️ Likes

#### `Like`
Modèle complet d'un like

```yaml
properties:
  id: string
  post: string (ID du post)
  user_id: string
```

### 🔧 Administration

#### `AdminSeedRequest`
DTO pour le seed de données

```yaml
properties:
  mode: string (ex: "demo")
  force: boolean
```

### ⚠️ Erreurs

#### `ErrorResponse`
Réponse standardisée pour les erreurs

```yaml
properties:
  success: boolean (false)
  error: string
  message: string
  code: string
```

## 🏷️ Tags organisés

Les routes sont organisées en 3 tags principaux :

1. **Auth** : Authentification JWT, permissions et gestion des tokens
2. **Posts** : Gestion des posts, commentaires et likes
3. **Admin** : Outils d'administration et diagnostics

## 🚀 Utilisation

### Accéder à la documentation interactive

Une fois le serveur démarré, accédez à :

- **Interface Swagger UI** : `http://localhost:3000/docs`
- **Spécification JSON** : `http://localhost:3000/docs.json`

### Tester les endpoints

1. Ouvrez l'interface Swagger UI
2. Cliquez sur "Authorize" en haut à droite
3. Entrez votre token JWT (format : `Bearer <token>` ou juste `<token>`)
4. Explorez les endpoints et testez-les directement depuis l'interface

### Exemple d'utilisation d'un DTO

Dans les routes, les DTOs sont référencés ainsi :

```javascript
/**
 * @swagger
 * /api/posts:
 *   post:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostInput'
 *     responses:
 *       201:
 *         description: Post créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
```

## 📚 Routes documentées

### Authentification (`/api/auth/*`)

- `POST /auth/generate-token` - Générer un token (DEV)
- `POST /auth/generate-admin-token` - Générer un token admin (DEV)
- `GET /auth/verify` - Vérifier un token
- `GET /auth/me` - Obtenir les infos de l'utilisateur connecté
- `GET /auth/permissions` - Obtenir les permissions de l'utilisateur
- `POST /auth/logout` - Déconnexion (client-side)
- `POST /auth/refresh` - Rafraîchir le token
- `POST /auth/forgot-password` - Demander une réinitialisation
- `POST /auth/reset-password` - Réinitialiser le mot de passe

### Posts (`/api/posts/*`)

- `GET /posts` - Lister tous les posts (avec filtres optionnels)
- `GET /posts/:id` - Obtenir un post par ID
- `POST /posts` - Créer un post (authentifié + permission)
- `PATCH /posts/:id` - Modifier un post (own/any)
- `PATCH /posts/:id/publish` - Publier un post (moderator+)
- `DELETE /posts/:id` - Supprimer un post (own/any)
- `GET /posts/:id/comments` - Lister les commentaires
- `POST /posts/:id/comments` - Créer un commentaire
- `DELETE /posts/:postId/comments/:commentId` - Supprimer un commentaire
- `GET /posts/:id/likes` - Lister les likes
- `GET /posts/:id/likes-count` - Compter les likes
- `POST /posts/:id/likes` - Ajouter un like
- `DELETE /posts/:postId/likes/:likeId` - Retirer un like

### Administration (`/api/admin/*`)

- `GET /admin/health` - Health check admin
- `POST /admin/reset` - Réinitialiser la base (admin)
- `POST /admin/seed` - Peupler la base (permission)
- `POST /admin/generate` - Générer des données (permission)
- `GET /admin/diagnostics` - Diagnostics système (permission)

## 🔒 Sécurité documentée

Toutes les routes protégées sont marquées avec :

```yaml
security:
  - bearerAuth: []
```

L'authentification Bearer JWT est configurée globalement dans `swagger.config.js`.

## 📝 Bonnes pratiques

1. **Réutilisation des schémas** : Utilisez `$ref` pour référencer les DTOs existants
2. **Validation** : Les contraintes (required, minLength, maxLength) sont documentées dans les DTOs
3. **Exemples** : Chaque DTO contient des exemples pour faciliter les tests
4. **Cohérence** : Les DTOs reflètent la structure réelle des données de l'API

## 🔄 Maintenance

Pour ajouter un nouveau DTO :

1. Définir le schéma dans `swagger.schemas.js`
2. Référencer le DTO dans les routes concernées avec `$ref: '#/components/schemas/NomDuDTO'`
3. Redémarrer le serveur pour voir les changements

## 📖 Ressources

- [Documentation OpenAPI 3.0](https://swagger.io/specification/)
- [Swagger JSDoc](https://github.com/Surnet/swagger-jsdoc)
- [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express)

