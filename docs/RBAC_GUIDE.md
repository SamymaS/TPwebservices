# 🔐 Guide RBAC - Système de Rôles et Permissions

## 📖 Vue d'ensemble

Ce projet utilise un système RBAC (Role-Based Access Control) complet avec **5 rôles hiérarchiques** et des **permissions granulaires**.

## 👥 Rôles disponibles

### 1. 🔓 Guest (Invité)
**Niveau** : 0 (Lecture seule)

- Peut **lire** les posts publics
- Peut **lire** les commentaires
- Peut **lire** les likes
- **Ne peut pas** créer, modifier ou supprimer

**Use case** : Visiteur non authentifié qui navigue sur le site

### 2. 👤 User (Utilisateur)
**Niveau** : 1 (Standard)

**Peut faire tout ce qu'un Guest peut faire, PLUS** :
- ✅ Créer des posts
- ✅ Modifier **ses propres** posts
- ✅ Supprimer **ses propres** posts
- ✅ Créer des commentaires
- ✅ Supprimer **ses propres** commentaires
- ✅ Ajouter des likes
- ✅ Retirer **ses propres** likes

**Use case** : Utilisateur standard enregistré

### 3. 👮 Moderator (Modérateur)
**Niveau** : 2 (Modération)

**Peut faire tout ce qu'un User peut faire, PLUS** :
- ✅ Modifier **tous** les posts (même ceux des autres)
- ✅ Supprimer **tous** les posts
- ✅ Publier **tous** les posts
- ✅ Supprimer **tous** les commentaires (modération)
- ✅ Retirer **tous** les likes

**Use case** : Modérateur de contenu qui surveille et nettoie le site

### 4. 🛡️ Admin (Administrateur)
**Niveau** : 3 (Administration)

**Peut faire tout ce qu'un Moderator peut faire, PLUS** :
- ✅ Toutes les actions sur posts, commentaires, likes (wildcard `*`)
- ✅ Accès aux routes admin : seed, generate
- ✅ Accès aux diagnostics
- ✅ Réinitialiser la base de données

**Use case** : Administrateur du site avec accès aux outils de gestion

### 5. 👑 Super Admin (Super Administrateur)
**Niveau** : 4 (Accès total)

**Permissions** : `*` (Tout)
- ✅ Accès **illimité** à toutes les ressources
- ✅ Toutes les permissions existantes et futures
- ✅ Peut tout faire sans restriction

**Use case** : Propriétaire du site ou développeur principal

## 📊 Tableau comparatif

| Permission | Guest | User | Moderator | Admin | Super Admin |
|-----------|-------|------|-----------|-------|-------------|
| **Posts** |
| Lire | ✅ | ✅ | ✅ | ✅ | ✅ |
| Créer | ❌ | ✅ | ✅ | ✅ | ✅ |
| Modifier les siens | ❌ | ✅ | ✅ | ✅ | ✅ |
| Modifier tous | ❌ | ❌ | ✅ | ✅ | ✅ |
| Supprimer les siens | ❌ | ✅ | ✅ | ✅ | ✅ |
| Supprimer tous | ❌ | ❌ | ✅ | ✅ | ✅ |
| Publier tous | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Commentaires** |
| Lire | ✅ | ✅ | ✅ | ✅ | ✅ |
| Créer | ❌ | ✅ | ✅ | ✅ | ✅ |
| Supprimer les siens | ❌ | ✅ | ✅ | ✅ | ✅ |
| Supprimer tous | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Likes** |
| Lire | ✅ | ✅ | ✅ | ✅ | ✅ |
| Ajouter | ❌ | ✅ | ✅ | ✅ | ✅ |
| Retirer les siens | ❌ | ✅ | ✅ | ✅ | ✅ |
| Retirer tous | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Admin** |
| Seed données | ❌ | ❌ | ❌ | ✅ | ✅ |
| Générer données | ❌ | ❌ | ❌ | ✅ | ✅ |
| Reset DB | ❌ | ❌ | ❌ | ✅ | ✅ |
| Diagnostics | ❌ | ❌ | ❌ | ✅ | ✅ |

## 🔑 Système de permissions

### Format des permissions

```
ressource:action:scope
```

**Exemples** :
- `posts:read` - Lire les posts
- `posts:create` - Créer des posts
- `posts:update:own` - Modifier ses propres posts
- `posts:update:any` - Modifier tous les posts
- `posts:*` - Toutes les actions sur les posts
- `*` - Toutes les permissions

### Wildcards

- `posts:*` → Équivaut à `posts:read`, `posts:create`, `posts:update`, etc.
- `*` → Toutes les permissions (Super Admin uniquement)

## 🛠️ Utilisation dans le code

### Middleware : Vérifier une permission

```javascript
import { requirePermission } from '../middleware/permissions.middleware.js'

// Route protégée par permission
router.post('/posts', 
  authenticateToken,
  requirePermission('posts:create'),
  createPost
)
```

### Middleware : Vérifier un rôle minimum

```javascript
import { requireRole } from '../middleware/permissions.middleware.js'

// Route accessible à partir de moderator
router.delete('/posts/:id',
  authenticateToken,
  requireRole('moderator'),
  deletePost
)
```

### Middleware : Vérifier un des rôles

```javascript
import { requireAnyRole } from '../middleware/permissions.middleware.js'

// Route accessible à admin OU super_admin
router.post('/admin/reset',
  authenticateToken,
  requireAnyRole(['admin', 'super_admin']),
  resetDatabase
)
```

### Vérifier les permissions dans un controller

```javascript
import { hasPermission } from '../middleware/permissions.middleware.js'

export const updatePost = async (req, res) => {
  const userRole = req.user.role
  const userId = req.user.sub
  
  // Récupérer le post
  const post = await getPostById(req.params.id)
  
  // Vérifier propriété OU permission globale
  if (post.author_id !== userId && !hasPermission(userRole, 'posts:update:any')) {
    return res.status(403).json({ error: 'Permission refusée' })
  }
  
  // Mettre à jour
  // ...
}
```

## 📡 Routes de test

### Vérifier vos permissions

```bash
GET /api/auth/permissions
Authorization: Bearer <votre_token>
```

**Réponse** :
```json
{
  "success": true,
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "role": "user"
  },
  "permissions": [
    "posts:read",
    "posts:create",
    "posts:update:own",
    "posts:delete:own",
    "..."
  ],
  "roleHierarchy": ["guest", "user", "moderator", "admin", "super_admin"],
  "currentRoleIndex": 1
}
```

## 🧪 Exemples de tokens

### Créer un token User

```bash
POST /api/auth/generate-token
Content-Type: application/json

{
  "userId": "user-123",
  "email": "user@example.com",
  "role": "user"
}
```

### Créer un token Moderator

```bash
POST /api/auth/generate-token
Content-Type: application/json

{
  "userId": "mod-456",
  "email": "moderator@example.com",
  "role": "moderator"
}
```

### Créer un token Admin

```bash
POST /api/auth/generate-admin-token
Content-Type: application/json

{
  "userId": "admin-789",
  "email": "admin@example.com"
}
```

Par défaut, `generate-admin-token` crée un token avec le rôle `admin`.

### Créer un token Super Admin

```bash
POST /api/auth/generate-token
Content-Type: application/json

{
  "userId": "superadmin-000",
  "email": "superadmin@example.com",
  "role": "super_admin"
}
```

## 🔒 Bonnes pratiques

### 1. Principe du moindre privilège

Donnez toujours le **rôle minimum** nécessaire :
- Utilisateurs normaux → `user`
- Modérateurs de contenu → `moderator`
- Gestionnaires du site → `admin`
- Propriétaire unique → `super_admin`

### 2. Vérification côté serveur

❌ **Mauvais** :
```javascript
// Ne faire confiance qu'au rôle dans le token
if (req.user.role === 'admin') {
  // Action sensible
}
```

✅ **Bon** :
```javascript
// Utiliser les middlewares de permissions
router.post('/sensitive', 
  authenticateToken,
  requireRole('admin'),
  sensitiveAction
)
```

### 3. Audit trail

Pour les actions critiques, loggez :
```javascript
console.log(`[AUDIT] ${req.user.email} (${req.user.role}) a effectué: ${action}`)
```

## 🎯 Cas d'usage

### Scenario 1 : Blog public

- **Lecteurs** → `guest` (pas besoin de compte)
- **Auteurs** → `user` (créent des articles)
- **Éditeurs** → `moderator` (valident/modèrent)
- **Gestionnaire** → `admin` (gestion complète)

### Scenario 2 : Forum

- **Visiteurs** → `guest` (lecture seule)
- **Membres** → `user` (posts + commentaires)
- **Modérateurs** → `moderator` (suppression spam)
- **Administrateurs** → `admin` (configuration)

### Scenario 3 : E-commerce (extension possible)

- **Clients** → `user`
- **Vendeurs** → `moderator` (gèrent produits)
- **Support** → `admin` (gèrent commandes)
- **Propriétaire** → `super_admin` (tout)

## 📚 Ressources

- [OWASP - Access Control](https://owasp.org/www-community/Access_Control)
- [NIST RBAC](https://csrc.nist.gov/projects/role-based-access-control)

---

**Développé pour : Ynov Express** 🚀

