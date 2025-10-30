# 📮 Dossier Postman - Ynov Express

Tous les fichiers nécessaires pour tester l'API avec Postman.

## 📁 Fichiers disponibles

### 🆕 Nouveaux fichiers (avec authentification JWT)

| Fichier | Description | Utilisation |
|---------|-------------|-------------|
| **`ynov-express-auth-complete.postman_collection.json`** | Collection complète avec auth JWT + tests automatiques | ⭐ À UTILISER |
| **`ynov-express-auth.postman_environment.json`** | Environnement avec variables auth (tokens, IDs) | ⭐ À UTILISER |
| **`QUICK_START.md`** | Guide de démarrage rapide (3 minutes) | 📖 Lire en premier |
| **`RUNNER_GUIDE.md`** | Guide complet du Postman Runner | 📖 Guide détaillé |

### 📦 Anciens fichiers (legacy)

| Fichier | Description | Status |
|---------|-------------|--------|
| `ynov-express.postman_collection.json` | Ancienne collection sans auth | ⚠️ Déprécié |
| `local.postman_environment.json` | Ancien environnement basique | ⚠️ Déprécié |
| `cloud.postman_environment.json` | Environnement cloud | ⚠️ Déprécié |

## 🚀 Démarrage rapide

### 1. Importer dans Postman

**Collection :**
```
Postman → Import → Glisser "ynov-express-auth-complete.postman_collection.json"
```

**Environnement :**
```
Postman → Import → Glisser "ynov-express-auth.postman_environment.json"
```

### 2. Activer l'environnement

```
Menu déroulant (en haut à droite) → "Ynov Express - Auth (Local)"
```

### 3. Lancer le serveur

```bash
npm start
```

### 4. Run la collection

```
Collection → Run → Run Ynov Express - Auth Complete
```

## 📊 Ce qui sera testé

La collection complète teste **22 endpoints** répartis en 6 catégories :

### 0. Health Check ✅
- Vérification que l'API fonctionne

### 1. Authentication (5 routes) 🔐
- Génération token user
- Génération token admin
- Vérification token
- Info utilisateur connecté
- Rafraîchissement token

### 2. Admin - Setup (5 routes) 👑
- Health check admin
- Diagnostics base de données
- Reset des données
- Seed données de démo
- Génération de posts automatiques

### 3. Posts (Public) (3 routes) 📰
- Lister tous les posts
- Lister posts publiés
- Voir un post par ID

### 4. Posts (Protected) (3 routes) 🔒
- Créer un post (auth requise)
- Modifier un post (auth requise)
- Publier un post (auth requise)

### 5. Comments (2 routes) 💬
- Lister les commentaires
- Créer un commentaire (auth requise)

### 6. Likes (3 routes) ❤️
- Lister les likes
- Compter les likes
- Ajouter un like (auth requise)

## 🎯 Variables d'environnement

L'environnement contient ces variables qui seront automatiquement remplies :

| Variable | Valeur initiale | Remplie par |
|----------|----------------|-------------|
| `baseUrl` | `http://localhost:3000` | Manuel |
| `authToken` | (vide) | Generate User Token |
| `adminToken` | (vide) | Generate Admin Token |
| `tokenExpiry` | (vide) | Generate Token |
| `userId` | `test-user-123` | Manuel |
| `userEmail` | `test@example.com` | Manuel |
| `adminId` | `admin-123` | Manuel |
| `adminEmail` | `admin@example.com` | Manuel |
| `postId` | (vide) | Get All Posts |
| `commentId` | (vide) | Create Comment |
| `likeId` | (vide) | Add Like |

## 📋 Ordre d'exécution recommandé

Le Runner exécute automatiquement dans cet ordre :

```
1. Health Check
   └─ Vérifie que l'API répond
   
2. Authentication
   ├─ Generate User Token → sauvegarde authToken
   ├─ Generate Admin Token → sauvegarde adminToken
   ├─ Verify Token
   ├─ Get User Info
   └─ Refresh Token
   
3. Admin - Setup (nécessite adminToken)
   ├─ Admin Health
   ├─ Diagnostics
   ├─ Reset (vide les tables)
   ├─ Seed (crée 2 posts + comments + likes)
   └─ Generate (crée 5 posts supplémentaires)
   
4. Posts Public (pas d'auth)
   ├─ Get All Posts → sauvegarde postId
   ├─ Get Published Posts
   └─ Get Post by ID
   
5. Posts Protected (nécessite authToken)
   ├─ Create Post
   ├─ Update Post
   └─ Publish Post
   
6. Comments (mix public/protected)
   ├─ Get Comments → sauvegarde commentId
   └─ Create Comment (auth)
   
7. Likes (mix public/protected)
   ├─ Get Likes → sauvegarde likeId
   ├─ Get Likes Count
   └─ Add Like (auth)
```

## ✅ Tests automatiques

Chaque requête contient des tests automatiques qui vérifient :

- ✅ Code de statut HTTP correct
- ✅ Structure de la réponse JSON
- ✅ Présence des champs obligatoires
- ✅ Sauvegarde automatique des IDs pour les requêtes suivantes

### Exemple de test

```javascript
pm.test('✅ Token généré', function () {
    pm.response.to.have.status(200);
    const json = pm.response.json();
    pm.expect(json.success).to.be.true;
    pm.environment.set('authToken', json.access_token);
    console.log('🔑 Token sauvegardé');
});
```

## 🔍 Console logs

Pendant l'exécution, vous verrez dans la console Postman :

```
🏥 API Status: ✨ API Ynov Express fonctionnelle
🔑 Token user sauvegardé
👤 User: test@example.com - Role: user
👑 Token admin sauvegardé
👤 Admin: admin@example.com
✓ Token vérifié - Expire dans: 86399 secondes
🔧 API Admin fonctionnelle
📊 Tables: {...}
🗑️ Toutes les tables ont été vidées
🌱 Données de démonstration créées
✨ 5 posts générés avec succès
📝 Posts trouvés: 7
💬 Commentaire ajouté
❤️ Like ajouté
```

## 🛠️ Personnalisation

### Modifier le nombre de posts générés

Dans la requête "Admin - Generate Posts", changez le body :

```json
{
  "count": 10  // Au lieu de 5
}
```

### Modifier les données de test

Dans l'environnement, changez :
- `userId` : ID de l'utilisateur de test
- `userEmail` : Email de l'utilisateur de test
- `adminEmail` : Email de l'admin

### Ajouter vos propres tests

Dans l'onglet "Tests" de chaque requête, ajoutez :

```javascript
pm.test("Mon test personnalisé", function () {
    const json = pm.response.json();
    // Vos vérifications ici
});
```

## 📖 Documentation

- **`QUICK_START.md`** - Commencez ici ! (3 minutes)
- **`RUNNER_GUIDE.md`** - Guide complet et avancé
- **`../AUTH_SETUP.md`** - Configuration de l'authentification
- **`../POSTMAN_AUTH_GUIDE.md`** - Guide détaillé Postman

## 🐛 Problèmes courants

### ❌ ECONNREFUSED
**Cause** : Serveur non démarré
**Solution** : `npm start`

### ❌ AUTH_TOKEN_MISSING
**Cause** : Token non généré/sauvegardé
**Solution** : Lancer d'abord "Generate User Token"

### ❌ ADMIN_REQUIRED
**Cause** : Token user utilisé au lieu d'admin
**Solution** : Lancer "Generate Admin Token" et utiliser `{{adminToken}}`

### ❌ 404 Not Found
**Cause** : URL ou route incorrecte
**Solution** : Vérifier que `baseUrl` = `http://localhost:3000`

## 📊 Export des résultats

Après l'exécution, vous pouvez :

1. **Exporter en JSON**
   ```
   Runner → Export Results → JSON
   ```

2. **Exporter en HTML**
   ```
   Runner → Export Results → HTML
   ```

Le rapport HTML contient :
- Taux de réussite
- Temps de réponse
- Graphiques
- Détails de chaque test

## 🎓 Tips

1. **Exécution partielle** : Décochez les requêtes non désirées
2. **Iterations** : Lancez plusieurs fois pour tester la stabilité
3. **Delay** : Ajoutez un délai entre les requêtes si nécessaire
4. **Console** : Ouvrez la console Postman pour voir les logs détaillés

## ✅ Checklist

Avant de lancer le Runner :

- [ ] Serveur démarré (`npm start`)
- [ ] Collection importée
- [ ] Environnement importé et activé
- [ ] Base de données Supabase accessible
- [ ] Variables d'environnement `.env` configurées

## 🚀 Prêt à tester ?

Consultez **`QUICK_START.md`** et lancez le Runner en 3 minutes ! ⚡

---

**Dernière mise à jour** : Janvier 2025
**Version** : 2.0.0 (Auth JWT)

