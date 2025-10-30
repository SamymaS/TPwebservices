# Configuration de l'authentification JWT

## 📋 Prérequis

Votre projet utilise désormais une **authentification par token JWT** pour protéger les routes sensibles.

## 🔧 Configuration

### 1. Configurer les clés dans `.env`

Votre fichier `.env` à la racine du projet doit contenir **4 variables** :

```env
# URL de votre projet Supabase
SUPABASE_URL=https://qdxezzqkxjpqzwuyrhfu.supabase.co

# Clé publique (peut être exposée côté client)
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Clé privée admin (NE JAMAIS exposer côté client !)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT Secret pour l'authentification
JWT_SECRET=tSSAabPP1LPZISaDqHHxk8AgMWZAdspUbOeVMnkMSeBfQWzGC22JhiiAwlGvfWwgLUMoGPWNnO/yZyQb8KOQkA==
```

**Où trouver ces clés dans Supabase ?**
1. Allez sur [supabase.com](https://supabase.com)
2. Ouvrez votre projet
3. **Settings** (⚙️) → **API**
4. Section **Project API keys** :
   - `anon` `public` → **SUPABASE_ANON_KEY**
   - `service_role` `secret` → **SUPABASE_SERVICE_ROLE_KEY**

### 2. Redémarrer le serveur

```bash
npm start
```

## 🔐 Routes protégées

Les routes suivantes nécessitent maintenant un token JWT valide dans le header `Authorization: Bearer <token>` :

### Posts
- ✅ `POST /api/posts` - Créer un post
- ✅ `PATCH /api/posts/:id` - Modifier un post
- ✅ `PATCH /api/posts/:id/publish` - Publier un post
- ✅ `DELETE /api/posts/:id` - Supprimer un post

### Commentaires
- ✅ `POST /api/posts/:id/comments` - Ajouter un commentaire
- ✅ `DELETE /api/posts/:postId/comments/:commentId` - Supprimer un commentaire

### Likes
- ✅ `POST /api/posts/:id/likes` - Ajouter un like
- ✅ `DELETE /api/posts/:postId/likes/:likeId` - Supprimer un like

### Admin
- ✅ `POST /api/admin/reset` - Réinitialiser les données
- ✅ `POST /api/admin/seed` - Créer des données de démonstration
- ✅ `POST /api/admin/generate` - Générer des données aléatoires
- ✅ `GET /api/admin/diagnostics` - Vérifier la connexion

### Routes publiques (sans authentification)
- 🔓 `GET /api/posts` - Lister les posts
- 🔓 `GET /api/posts/:id` - Voir un post
- 🔓 `GET /api/posts/:id/comments` - Lister les commentaires
- 🔓 `GET /api/posts/:id/likes` - Lister les likes
- 🔓 `GET /api/posts/:id/likes-count` - Compter les likes
- 🔓 `GET /health` - Health check
- 🔓 `GET /api/admin/health` - Health check admin

## 🧪 Tester l'authentification

### Méthode 1 : Générer un token de test

Une route spéciale est disponible pour générer des tokens de test :

```bash
# Générer un token
curl -X POST http://localhost:3000/api/auth/generate-token \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "email": "test@example.com",
    "role": "user"
  }'
```

Réponse :
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 86400,
  "user": {
    "id": "test-user-123",
    "email": "test@example.com",
    "role": "user"
  }
}
```

### Méthode 2 : Utiliser le token pour accéder aux routes protégées

```bash
# Créer un post avec le token
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <VOTRE_TOKEN>" \
  -d '{
    "title": "Mon premier post authentifié",
    "content": "Contenu du post"
  }'
```

### Méthode 3 : Vérifier un token

```bash
# Vérifier si un token est valide
curl -X GET http://localhost:3000/api/auth/verify \
  -H "Authorization: Bearer <VOTRE_TOKEN>"
```

## 📮 Utilisation avec Postman

### 1. Générer un token
1. Créez une requête POST vers `http://localhost:3000/api/auth/generate-token`
2. Dans l'onglet "Tests", ajoutez ce script pour sauvegarder automatiquement le token :
```javascript
pm.test("Token generated", function () {
    var jsonData = pm.response.json();
    pm.environment.set("authToken", jsonData.access_token);
});
```

### 2. Utiliser le token dans les autres requêtes
1. Dans l'onglet "Authorization" de vos requêtes
2. Type : "Bearer Token"
3. Token : `{{authToken}}`

Ou manuellement dans les Headers :
- Key: `Authorization`
- Value: `Bearer {{authToken}}`

## ⚠️ Erreurs possibles

### 401 Unauthorized
```json
{
  "error": "Token d'authentification requis",
  "message": "Veuillez fournir un token dans le header Authorization: Bearer <token>"
}
```
➡️ Vous n'avez pas fourni de token. Ajoutez le header `Authorization: Bearer <token>`

### 403 Forbidden - Token invalide
```json
{
  "error": "Token invalide",
  "message": "Le token fourni n'est pas valide"
}
```
➡️ Le token est malformé ou le JWT_SECRET est incorrect

### 401 Unauthorized - Token expiré
```json
{
  "error": "Token expiré",
  "message": "Votre session a expiré, veuillez vous reconnecter"
}
```
➡️ Le token a expiré (durée de vie : 24h). Générez un nouveau token

## 🚨 Sécurité - IMPORTANT

⚠️ **La route `/api/auth/generate-token` est uniquement pour le développement/test !**

En production, vous devriez :
1. Supprimer cette route ou la sécuriser
2. Utiliser l'authentification Supabase complète avec `supabase.auth.signIn()`
3. Les tokens seraient alors générés par Supabase directement
4. Implémenter un système de login/register approprié

## 📚 Ressources

- [JWT.io](https://jwt.io/) - Décodeur de tokens JWT
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth) - Documentation Supabase Auth
- [Express Middleware](https://expressjs.com/en/guide/using-middleware.html) - Guide des middlewares Express

