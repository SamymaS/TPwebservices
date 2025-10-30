# Guide d'utilisation de l'authentification avec Postman

## 🎯 Vue d'ensemble

Votre API utilise maintenant l'authentification JWT (JSON Web Token). Ce guide vous montre comment tester l'API avec Postman.

## 🚀 Démarrage rapide

### 1. Générer un token d'authentification

**Requête :**
```
POST http://localhost:3000/api/auth/generate-token
Content-Type: application/json
```

**Body (optionnel) :**
```json
{
  "userId": "mon-user-123",
  "email": "moi@example.com",
  "role": "user"
}
```

Si vous n'envoyez pas de body, des valeurs par défaut seront utilisées.

**Réponse :**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 86400,
  "user": {
    "id": "mon-user-123",
    "email": "moi@example.com",
    "role": "user"
  }
}
```

### 2. Sauvegarder automatiquement le token dans Postman

Dans l'onglet **Tests** de votre requête `generate-token`, ajoutez ce script :

```javascript
pm.test("Sauvegarde du token", function () {
    var jsonData = pm.response.json();
    pm.environment.set("authToken", jsonData.access_token);
    console.log("Token sauvegardé: " + jsonData.access_token.substring(0, 20) + "...");
});
```

### 3. Utiliser le token dans vos requêtes

#### Méthode A : Authorization Tab (Recommandé)

1. Dans votre requête, allez dans l'onglet **Authorization**
2. Type : Sélectionnez **Bearer Token**
3. Token : Entrez `{{authToken}}`

#### Méthode B : Headers

Ajoutez ce header à vos requêtes :
```
Authorization: Bearer {{authToken}}
```

## 📋 Collection Postman mise à jour

Voici les requêtes à ajouter à votre collection :

### 1. Auth - Generate Token
```
POST {{baseUrl}}/api/auth/generate-token
Content-Type: application/json

Body (raw JSON):
{
  "userId": "test-123",
  "email": "test@example.com"
}

Tests:
pm.test("Token généré", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.environment.set("authToken", jsonData.access_token);
});
```

### 2. Auth - Verify Token
```
GET {{baseUrl}}/api/auth/verify
Authorization: Bearer {{authToken}}

Tests:
pm.test("Token valide", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.valid).to.be.true;
});
```

### 3. Posts - Create (Authentifié)
```
POST {{baseUrl}}/api/posts
Authorization: Bearer {{authToken}}
Content-Type: application/json

Body:
{
  "title": "Mon post authentifié",
  "content": "Contenu du post"
}
```

## 🔐 Routes protégées vs publiques

### Routes publiques (pas de token requis)
- ✅ `GET /api/posts` - Lister les posts
- ✅ `GET /api/posts/:id` - Voir un post
- ✅ `GET /api/posts/:id/comments` - Commentaires
- ✅ `GET /api/posts/:id/likes` - Likes
- ✅ `GET /health` - Health check

### Routes protégées (token JWT requis ⚠️)
- 🔒 `POST /api/posts` - Créer un post
- 🔒 `PATCH /api/posts/:id` - Modifier un post
- 🔒 `PATCH /api/posts/:id/publish` - Publier
- 🔒 `DELETE /api/posts/:id` - Supprimer
- 🔒 `POST /api/posts/:id/comments` - Ajouter commentaire
- 🔒 `DELETE /api/posts/:postId/comments/:commentId` - Supprimer commentaire
- 🔒 `POST /api/posts/:id/likes` - Liker
- 🔒 `DELETE /api/posts/:postId/likes/:likeId` - Unliker
- 🔒 `POST /api/admin/reset` - Reset données
- 🔒 `POST /api/admin/seed` - Seed données
- 🔒 `POST /api/admin/generate` - Générer données
- 🔒 `GET /api/admin/diagnostics` - Diagnostics

## 🔄 Workflow complet dans Postman

1. **Générer un token**
   - Exécuter `POST /api/auth/generate-token`
   - Le token est automatiquement sauvegardé dans `{{authToken}}`

2. **Tester une route publique**
   - `GET /api/posts` (pas de token nécessaire)
   
3. **Tester une route protégée**
   - `POST /api/posts` avec Authorization: Bearer {{authToken}}
   
4. **Vérifier le token**
   - `GET /api/auth/verify` pour voir les infos du token

## ❌ Gestion des erreurs

### 401 Unauthorized - Token manquant
```json
{
  "error": "Token d'authentification requis",
  "message": "Veuillez fournir un token dans le header Authorization: Bearer <token>"
}
```
➡️ **Solution :** Ajoutez le header Authorization avec votre token

### 403 Forbidden - Token invalide
```json
{
  "error": "Token invalide",
  "message": "Le token fourni n'est pas valide"
}
```
➡️ **Solution :** Générez un nouveau token

### 401 Unauthorized - Token expiré
```json
{
  "error": "Token expiré",
  "message": "Votre session a expiré, veuillez vous reconnecter"
}
```
➡️ **Solution :** Générez un nouveau token (durée de vie : 24h)

## 💡 Tips

1. **Variables d'environnement Postman** : Créez `authToken` dans votre environnement
2. **Pre-request Script** : Pour générer automatiquement un token si expiré
3. **Durée de vie** : Les tokens sont valides 24 heures
4. **Décodage** : Visitez [jwt.io](https://jwt.io) pour décoder vos tokens

## 🔧 Configuration avancée

### Pre-request Script automatique

Ajoutez ceci dans les Pre-request Scripts de votre collection pour gérer l'expiration automatiquement :

```javascript
// Vérifie si le token existe et n'est pas expiré
const token = pm.environment.get("authToken");
const tokenExpiry = pm.environment.get("tokenExpiry");
const now = Math.floor(Date.now() / 1000);

if (!token || !tokenExpiry || tokenExpiry < now) {
    // Générer un nouveau token
    pm.sendRequest({
        url: pm.environment.get("baseUrl") + "/api/auth/generate-token",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: {
            mode: "raw",
            raw: JSON.stringify({
                userId: "auto-user",
                email: "auto@example.com"
            })
        }
    }, function (err, res) {
        if (!err) {
            const jsonData = res.json();
            pm.environment.set("authToken", jsonData.access_token);
            pm.environment.set("tokenExpiry", now + jsonData.expires_in);
            console.log("✅ Nouveau token généré automatiquement");
        }
    });
}
```

## 📚 Ressources

- Documentation JWT : https://jwt.io
- Documentation Postman : https://learning.postman.com/
- Fichier AUTH_SETUP.md pour plus de détails

