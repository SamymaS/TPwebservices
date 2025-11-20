# 🔐 Améliorations de Sécurité - Gestion des Rôles

## 📋 Vue d'Ensemble

Ce document décrit les améliorations de sécurité apportées au système d'authentification, notamment la gestion des rôles utilisateurs.

## ⚠️ Problème Identifié

**Avant** : Le rôle de l'utilisateur était stocké directement dans le JWT (JSON Web Token). Cela posait plusieurs problèmes de sécurité :

1. **Rôle obsolète** : Si un administrateur changeait le rôle d'un utilisateur, le token restait valide avec l'ancien rôle jusqu'à son expiration (jusqu'à 24h)
2. **Pas de révocation immédiate** : Impossible de révoquer immédiatement les permissions d'un utilisateur
3. **Sécurité compromise** : Un utilisateur avec un token volé conservait ses permissions même après un changement de rôle

## ✅ Solution Implémentée

### 1. Suppression du Rôle du JWT

Le JWT ne contient plus le rôle de l'utilisateur. Il contient uniquement :
- `sub` : ID de l'utilisateur
- `email` : Email de l'utilisateur
- `aud` : Audience
- `iat` : Date d'émission
- `exp` : Date d'expiration

### 2. Table `user_profiles`

Une nouvelle table `user_profiles` a été créée pour stocker les rôles des utilisateurs :

```sql
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);
```

**Avantages** :
- Source de vérité unique pour les rôles
- Modification immédiate des permissions
- Historique des changements (via `updated_at`)
- Possibilité d'ajouter d'autres métadonnées utilisateur

### 3. Service `user.service.js`

Un nouveau service a été créé pour gérer les profils utilisateurs :

- `getUserProfile(userId)` : Récupère le profil avec le rôle depuis la DB
- `createOrUpdateUserProfile(userId, email, role)` : Crée ou met à jour un profil
- `updateUserRole(userId, newRole)` : Met à jour uniquement le rôle
- `getUserRole(userId)` : Récupère rapidement le rôle

### 4. Middleware d'Authentification Amélioré

Le middleware `authenticateToken` :
1. Vérifie la validité du JWT
2. **Récupère le rôle depuis la base de données** à chaque requête
3. Crée automatiquement un profil par défaut si l'utilisateur n'existe pas
4. Attache les informations utilisateur (avec le rôle à jour) à `req.user`

**Avantages** :
- Le rôle est **toujours à jour** à chaque requête
- Les changements de rôle sont **immédiatement effectifs**
- Pas besoin de régénérer le token après un changement de rôle

## 🔄 Flux d'Authentification

### Avant (Ancien Système)
```
1. Client envoie JWT avec rôle inclus
2. Serveur vérifie JWT et utilise le rôle du token
3. ❌ Problème : Rôle peut être obsolète
```

### Maintenant (Nouveau Système)
```
1. Client envoie JWT (sans rôle)
2. Serveur vérifie JWT
3. Serveur récupère le rôle depuis la DB
4. ✅ Rôle toujours à jour
```

## 📝 Changements dans le Code

### JWT Génération

**Avant** :
```javascript
const token = jwt.sign({
  sub: userId,
  email: email,
  role: role, // ❌ Rôle dans le JWT
  // ...
}, secret)
```

**Maintenant** :
```javascript
// Créer le profil dans la DB
await createOrUpdateUserProfile(userId, email, role)

const token = jwt.sign({
  sub: userId,
  email: email,
  // ✅ Rôle supprimé du JWT
  // ...
}, secret)
```

### Middleware d'Authentification

**Avant** :
```javascript
const decoded = jwt.verify(token, secret)
req.user = decoded // Rôle depuis le JWT
```

**Maintenant** :
```javascript
const decoded = jwt.verify(token, secret)
const userProfile = await getUserProfile(decoded.sub) // Rôle depuis la DB
req.user = {
  ...decoded,
  role: userProfile.role // ✅ Rôle toujours à jour
}
```

## 🛡️ Sécurité Renforcée

### Avantages

1. **Révocation Immédiate** : Un changement de rôle est effectif immédiatement
2. **Source de Vérité Unique** : Le rôle est stocké uniquement dans la base de données
3. **Audit Trail** : Possibilité de tracer les changements de rôles (via `updated_at`)
4. **Protection contre les Tokens Volés** : Un token volé peut être invalidé en changeant le rôle

### Nouvelles Routes Admin

Des routes admin ont été ajoutées pour gérer les utilisateurs :

- `GET /api/admin/users` : Liste tous les utilisateurs
- `GET /api/admin/users/:userId` : Obtenir un utilisateur spécifique
- `PATCH /api/admin/users/:userId/role` : Mettre à jour le rôle d'un utilisateur
- `POST /api/admin/users` : Créer ou mettre à jour un profil utilisateur

**Protection** : Toutes ces routes nécessitent le rôle `admin` ou supérieur.

## 📊 Migration

### Étape 1 : Appliquer la Migration SQL

Exécuter la migration `004_create_user_profiles.sql` dans Supabase :

```sql
-- Voir database/migrations/004_create_user_profiles.sql
```

### Étape 2 : Migrer les Utilisateurs Existants

Si vous avez des utilisateurs existants avec des tokens contenant des rôles, vous devez :

1. Créer leurs profils dans `user_profiles`
2. Les utilisateurs devront se reconnecter pour obtenir un nouveau token (sans rôle)

### Étape 3 : Mise à Jour du Frontend

Le frontend n'a pas besoin de changements majeurs, mais :
- Les tokens existants continueront de fonctionner
- Les nouveaux tokens ne contiendront plus le rôle
- Le rôle sera récupéré automatiquement par le backend

## ⚡ Performance

### Impact sur les Performances

- **Requête DB supplémentaire** : Chaque requête authentifiée fait maintenant une requête supplémentaire à la base de données
- **Optimisation** : Un index a été créé sur `user_id` pour optimiser les requêtes
- **Cache possible** : Pour améliorer les performances, on pourrait ajouter un cache Redis (optionnel)

### Recommandations

Pour les applications à très fort trafic, considérer :
- Cache Redis pour les profils utilisateurs (TTL de 5-10 minutes)
- Pool de connexions DB optimisé
- Monitoring des temps de réponse

## 🔍 Tests

### Tester le Nouveau Système

1. **Créer un token** :
```bash
POST /api/auth/generate-token
{
  "userId": "test-123",
  "email": "test@example.com",
  "role": "user"
}
```

2. **Vérifier que le token fonctionne** :
```bash
GET /api/auth/me
Authorization: Bearer <token>
```

3. **Changer le rôle** (en tant qu'admin) :
```bash
PATCH /api/admin/users/test-123/role
Authorization: Bearer <admin-token>
{
  "role": "moderator"
}
```

4. **Vérifier que le nouveau rôle est effectif immédiatement** :
```bash
GET /api/auth/me
Authorization: Bearer <même-token-qu'avant>
# Le rôle devrait maintenant être "moderator"
```

## 📚 Ressources

- Migration SQL : `database/migrations/004_create_user_profiles.sql`
- Service utilisateur : `backend/src/services/user.service.js`
- Middleware auth : `backend/src/middleware/auth.middleware.js`
- Routes admin : `backend/src/features/admin/admin.routes.js`

## 🎯 Prochaines Étapes (Optionnelles)

1. **Blacklist de tokens** : Système pour invalider des tokens spécifiques
2. **Cache Redis** : Cache des profils utilisateurs pour améliorer les performances
3. **Audit Log** : Table pour tracer tous les changements de rôles
4. **Notifications** : Notifier l'utilisateur lors d'un changement de rôle
5. **Rate Limiting** : Limiter les changements de rôles par admin

## ✅ Checklist de Déploiement

- [ ] Appliquer la migration SQL `004_create_user_profiles.sql`
- [ ] Vérifier que les nouveaux tokens ne contiennent plus le rôle
- [ ] Tester que les changements de rôles sont immédiats
- [ ] Migrer les utilisateurs existants si nécessaire
- [ ] Monitorer les performances (temps de réponse)
- [ ] Documenter les changements pour l'équipe

---

**Date de mise en œuvre** : 2024
**Auteur** : Équipe de développement
**Version** : 1.0



