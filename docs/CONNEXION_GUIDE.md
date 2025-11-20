# 🔐 Guide de Connexion - Ynov Express

## 📋 Vue d'Ensemble

Le système d'authentification actuel utilise des **tokens JWT** générés directement pour le développement et les tests. Il n'y a pas encore d'authentification complète avec email/mot de passe via Supabase Auth.

## 🚀 Comment Se Connecter

### Méthode 1 : Via l'Interface Web (Frontend)

1. **Démarrer le frontend** :
```bash
cd frontend
npm run dev
```

2. **Ouvrir le navigateur** :
   - Allez sur `http://localhost:5173` (ou le port configuré)

3. **Sur la page de connexion** :
   - Remplissez les champs :
     - **Email** : Votre email (ex: `test@example.com`)
     - **User ID** : Un identifiant unique (optionnel, généré automatiquement si vide)
     - **Rôle** : Choisissez un rôle (`user`, `moderator`, `admin`, `super_admin`)
   - Cliquez sur **"Se connecter"** ou **"S'inscrire"**

4. **Vous êtes connecté !** Le token est automatiquement sauvegardé dans le localStorage.

### Méthode 2 : Via l'API (cURL / Postman)

#### Étape 1 : Générer un Token

```bash
POST http://localhost:3000/api/auth/generate-token
Content-Type: application/json

{
  "userId": "mon-user-id-123",
  "email": "mon-email@example.com",
  "role": "user"
}
```

**Réponse** :
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 86400,
  "expires_at": "2024-01-16T10:30:00.000Z",
  "user": {
    "id": "mon-user-id-123",
    "email": "mon-email@example.com",
    "role": "user"
  }
}
```

#### Étape 2 : Utiliser le Token

Copiez le `access_token` et utilisez-le dans vos requêtes :

```bash
GET http://localhost:3000/api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Méthode 3 : Token Admin Rapide

Pour obtenir un token administrateur directement :

```bash
POST http://localhost:3000/api/auth/generate-admin-token
Content-Type: application/json

{
  "userId": "admin-123",
  "email": "admin@example.com"
}
```

Le rôle `admin` sera automatiquement attribué.

## 🎯 Rôles Disponibles

| Rôle | Description | Permissions |
|------|-------------|-------------|
| `guest` | Invité (lecture seule) | Lire posts, commentaires, likes |
| `user` | Utilisateur standard | CRUD sur son propre contenu |
| `moderator` | Modérateur | Modérer tout le contenu |
| `admin` | Administrateur | Accès admin complet |
| `super_admin` | Super admin | Accès total sans restriction |

## 📝 Exemples de Connexion

### Exemple 1 : Utilisateur Standard

```bash
curl -X POST http://localhost:3000/api/auth/generate-token \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "jean-dupont",
    "email": "jean.dupont@example.com",
    "role": "user"
  }'
```

### Exemple 2 : Modérateur

```bash
curl -X POST http://localhost:3000/api/auth/generate-token \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "marie-moderator",
    "email": "marie@example.com",
    "role": "moderator"
  }'
```

### Exemple 3 : Administrateur

```bash
curl -X POST http://localhost:3000/api/auth/generate-admin-token \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "admin-paul",
    "email": "paul.admin@example.com"
  }'
```

## ✅ Vérifier sa Connexion

### Vérifier le Token

```bash
GET http://localhost:3000/api/auth/verify
Authorization: Bearer <VOTRE_TOKEN>
```

### Obtenir ses Informations

```bash
GET http://localhost:3000/api/auth/me
Authorization: Bearer <VOTRE_TOKEN>
```

**Réponse** :
```json
{
  "success": true,
  "user": {
    "id": "mon-user-id-123",
    "email": "mon-email@example.com",
    "role": "user",
    "authenticatedAt": "2024-01-15T10:30:00.000Z",
    "expiresAt": "2024-01-16T10:30:00.000Z"
  }
}
```

### Vérifier ses Permissions

```bash
GET http://localhost:3000/api/auth/permissions
Authorization: Bearer <VOTRE_TOKEN>
```

## 🔄 Rafraîchir le Token

Si votre token est sur le point d'expirer, vous pouvez le rafraîchir :

```bash
POST http://localhost:3000/api/auth/refresh
Authorization: Bearer <VOTRE_TOKEN>
```

**Note** : Le nouveau token ne contiendra pas le rôle (il sera récupéré depuis la DB).

## 🚪 Se Déconnecter

### Côté Frontend

Le token est stocké dans le `localStorage`. Pour se déconnecter :

```javascript
localStorage.removeItem('authToken')
// Ou utiliser la fonction logout() du AuthContext
```

### Côté API

```bash
POST http://localhost:3000/api/auth/logout
Authorization: Bearer <VOTRE_TOKEN>
```

**Note** : Le token reste techniquement valide jusqu'à expiration. La déconnexion consiste à supprimer le token côté client.

## 🔐 Important : Nouveau Système de Sécurité

Avec les dernières améliorations de sécurité :

- ✅ Le **rôle n'est plus stocké dans le JWT**
- ✅ Le rôle est **récupéré depuis la base de données** à chaque requête
- ✅ Les **changements de rôle sont immédiats** (pas besoin de régénérer le token)

### Création Automatique du Profil

Si vous générez un token avec un `userId` qui n'existe pas encore :
- Un profil utilisateur sera **automatiquement créé** dans la table `user_profiles`
- Le rôle par défaut sera `user` si non spécifié

### Changer le Rôle d'un Utilisateur (Admin)

Si vous êtes admin, vous pouvez changer le rôle d'un utilisateur :

```bash
PATCH http://localhost:3000/api/admin/users/:userId/role
Authorization: Bearer <TOKEN_ADMIN>
Content-Type: application/json

{
  "role": "moderator"
}
```

Le changement sera **immédiatement effectif** pour toutes les requêtes suivantes de cet utilisateur.

## 🛠️ Utilisation avec Postman

### Configuration

1. **Créer une requête POST** vers `http://localhost:3000/api/auth/generate-token`
2. **Body** (raw JSON) :
```json
{
  "userId": "test-user",
  "email": "test@example.com",
  "role": "user"
}
```

3. **Dans l'onglet "Tests"**, ajoutez ce script pour sauvegarder automatiquement le token :
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("authToken", jsonData.access_token);
    console.log("Token sauvegardé :", jsonData.access_token);
}
```

4. **Utiliser le token** dans les autres requêtes :
   - Onglet **Authorization** → Type : **Bearer Token**
   - Token : `{{authToken}}`

## ⚠️ Erreurs Courantes

### Erreur : "Profil utilisateur introuvable"

**Cause** : Le profil n'existe pas dans la table `user_profiles` et la création automatique a échoué.

**Solution** :
1. Vérifier que la migration `004_create_user_profiles.sql` a été appliquée
2. Vérifier la connexion à Supabase
3. Créer manuellement le profil via `/api/admin/users`

### Erreur : "Token expiré"

**Cause** : Le token a expiré (durée de vie : 24h).

**Solution** : Générer un nouveau token avec `/api/auth/generate-token`

### Erreur : "Token invalide"

**Cause** : Le token est malformé ou le `JWT_SECRET` est incorrect.

**Solution** :
1. Vérifier que le token est bien copié en entier
2. Vérifier la variable d'environnement `JWT_SECRET`

## 📚 Prochaines Étapes

Pour une authentification complète en production, vous devriez :

1. **Implémenter Supabase Auth** :
   - Utiliser `supabase.auth.signUp()` pour l'inscription
   - Utiliser `supabase.auth.signInWithPassword()` pour la connexion
   - Les tokens seraient générés par Supabase

2. **Sécuriser les routes de génération de token** :
   - Supprimer `/api/auth/generate-token` en production
   - Ou la protéger avec une clé API secrète

3. **Ajouter la gestion des sessions** :
   - Refresh tokens
   - Blacklist de tokens révoqués
   - Gestion des déconnexions

## 🎯 Résumé Rapide

1. **Générer un token** : `POST /api/auth/generate-token`
2. **Utiliser le token** : Ajouter `Authorization: Bearer <token>` dans les headers
3. **Vérifier** : `GET /api/auth/me`
4. **Rafraîchir** : `POST /api/auth/refresh`
5. **Déconnexion** : Supprimer le token côté client

---

**Besoin d'aide ?** Consultez la documentation dans `docs/SECURITY_IMPROVEMENTS.md` pour plus de détails sur le système de sécurité.

