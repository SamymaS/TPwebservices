# Guide de Test Swagger/OpenAPI

## 🚀 Démarrage rapide

### 1. Démarrer le serveur backend

```bash
cd backend
npm run dev
```

Le serveur démarre sur `http://localhost:3000` (ou le port défini dans `PORT`).

### 2. Accéder à l'interface Swagger

Ouvrez votre navigateur et allez sur :

- **Interface Swagger UI** : http://localhost:3000/docs
- **Spécification JSON** : http://localhost:3000/docs.json

## 📋 Scénarios de test

### Test 1 : Vérifier que Swagger fonctionne

1. Ouvrez http://localhost:3000/docs
2. Vous devriez voir l'interface Swagger avec tous les endpoints organisés par tags
3. Cliquez sur "Authorize" en haut à droite
4. Vérifiez que vous pouvez voir les 3 sections : **Auth**, **Posts**, **Admin**

### Test 2 : Générer un token (DEV)

1. Dans Swagger UI, trouvez `POST /api/auth/generate-token`
2. Cliquez sur "Try it out"
3. Utilisez ce body :
```json
{
  "email": "test@example.com",
  "role": "user"
}
```
4. Cliquez sur "Execute"
5. Copiez le `access_token` de la réponse

### Test 3 : S'authentifier dans Swagger

1. Cliquez sur le bouton **"Authorize"** en haut à droite
2. Dans le champ "Value", collez votre token (sans "Bearer")
3. Cliquez sur "Authorize"
4. Fermez la fenêtre
5. Tous les endpoints protégés sont maintenant accessibles

### Test 4 : Tester un endpoint protégé

1. Trouvez `GET /api/auth/me`
2. Cliquez sur "Try it out"
3. Cliquez sur "Execute"
4. Vous devriez recevoir les informations de l'utilisateur connecté

### Test 5 : Créer un post

1. Trouvez `POST /api/posts`
2. Cliquez sur "Try it out"
3. Utilisez ce body :
```json
{
  "title": "Mon premier post via Swagger",
  "content": "Ce post a été créé depuis l'interface Swagger UI"
}
```
4. Cliquez sur "Execute"
5. Vérifiez que le post est créé avec un `id` et `is_published: false`

### Test 6 : Lister les posts

1. Trouvez `GET /api/posts`
2. Cliquez sur "Try it out"
3. Vous pouvez tester les paramètres optionnels :
   - `is_published`: `true` (filtrer les posts publiés)
   - `q`: `"premier"` (recherche par titre)
4. Cliquez sur "Execute"
5. Vérifiez que vous recevez une liste de posts

### Test 7 : Modifier un post

1. Trouvez `PATCH /api/posts/{id}`
2. Cliquez sur "Try it out"
3. Entrez l'ID d'un post que vous avez créé
4. Utilisez ce body :
```json
{
  "title": "Titre modifié",
  "content": "Contenu modifié"
}
```
5. Cliquez sur "Execute"
6. Vérifiez que le post est mis à jour

### Test 8 : Créer un commentaire

1. Trouvez `POST /api/posts/{id}/comments`
2. Cliquez sur "Try it out"
3. Entrez l'ID d'un post
4. Utilisez ce body :
```json
{
  "content": "Super post !"
}
```
5. Cliquez sur "Execute"
6. Vérifiez que le commentaire est créé

### Test 9 : Tester les permissions RBAC

1. Générez un token avec `role: "user"`
2. Authentifiez-vous dans Swagger
3. Essayez `PATCH /api/posts/{id}/publish`
4. Vous devriez recevoir une erreur 403 (Permission refusée)
5. Générez un token avec `role: "moderator"`
6. Réessayez - cela devrait fonctionner

### Test 10 : Vérifier la spécification JSON

1. Ouvrez http://localhost:3000/docs.json
2. Vérifiez que c'est un JSON valide
3. Vérifiez que tous les schémas sont présents :
   - `AuthTokenRequest`
   - `Post`
   - `Comment`
   - `Like`
   - etc.

## 🔍 Vérifications à faire

### ✅ Checklist de validation

- [ ] L'interface Swagger s'affiche correctement
- [ ] Tous les endpoints sont visibles et organisés par tags
- [ ] Les DTOs sont correctement documentés (cliquez sur "Schemas" en bas)
- [ ] L'authentification Bearer fonctionne
- [ ] Les exemples de requêtes sont présents
- [ ] Les réponses sont documentées avec les bons codes HTTP
- [ ] Les paramètres requis sont marqués
- [ ] Les contraintes de validation sont visibles (minLength, maxLength, etc.)

## 🐛 Dépannage

### Problème : Swagger UI ne s'affiche pas

**Solution** :
1. Vérifiez que le serveur est démarré
2. Vérifiez la console pour les erreurs
3. Vérifiez que les dépendances sont installées : `npm install`

### Problème : Les routes ne s'affichent pas

**Solution** :
1. Vérifiez que les fichiers de routes contiennent les annotations `@swagger`
2. Vérifiez que `swagger.config.js` scanne les bons fichiers
3. Redémarrez le serveur

### Problème : Erreur 401 sur les endpoints protégés

**Solution** :
1. Assurez-vous d'avoir cliqué sur "Authorize"
2. Vérifiez que le token est valide (non expiré)
3. Le token doit être collé sans le préfixe "Bearer"

### Problème : Les DTOs ne s'affichent pas dans Schemas

**Solution** :
1. Vérifiez que `swagger.schemas.js` est bien importé dans la config
2. Vérifiez la syntaxe YAML dans les commentaires JSDoc
3. Redémarrez le serveur

## 📝 Exemples de requêtes complètes

### Créer un post et le publier

```bash
# 1. Générer un token moderator
POST /api/auth/generate-token
{
  "email": "moderator@example.com",
  "role": "moderator"
}

# 2. Créer un post
POST /api/posts
Authorization: Bearer <token>
{
  "title": "Post à publier",
  "content": "Contenu du post"
}

# 3. Publier le post
PATCH /api/posts/{id}/publish
Authorization: Bearer <token>
```

### Workflow complet : Post + Commentaire + Like

```bash
# 1. Créer un post
POST /api/posts
{
  "title": "Mon post",
  "content": "Contenu"
}

# 2. Ajouter un commentaire
POST /api/posts/{postId}/comments
{
  "content": "Excellent post !"
}

# 3. Ajouter un like
POST /api/posts/{postId}/likes

# 4. Vérifier les likes
GET /api/posts/{postId}/likes-count
```

## 🎯 Tests automatisés (optionnel)

Vous pouvez aussi tester avec `curl` ou Postman en utilisant la spécification JSON :

```bash
# Récupérer la spécification
curl http://localhost:3000/docs.json > swagger.json

# Importer dans Postman
# Postman > Import > Upload Files > swagger.json
```

## 📚 Ressources

- [Documentation Swagger UI](https://swagger.io/tools/swagger-ui/)
- [OpenAPI Specification](https://swagger.io/specification/)
- Guide complet : `docs/api/OPENAPI_DTO_GUIDE.md`

