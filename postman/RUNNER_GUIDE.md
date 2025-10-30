# 🏃‍♂️ Guide du Postman Runner - Ynov Express

## 📋 Vue d'ensemble

Ce guide vous explique comment utiliser le **Postman Runner** pour tester automatiquement toute votre API en une seule fois.

## 🚀 Préparation

### 1. Importer les fichiers dans Postman

#### Importer la collection
1. Ouvrez Postman
2. Cliquez sur **Import** (en haut à gauche)
3. Glissez le fichier **`ynov-express-auth-complete.postman_collection.json`**
4. Cliquez sur **Import**

#### Importer l'environnement
1. Cliquez sur **Import** à nouveau
2. Glissez le fichier **`ynov-express-auth.postman_environment.json`**
3. Cliquez sur **Import**

### 2. Activer l'environnement

1. En haut à droite de Postman, cliquez sur le menu déroulant des environnements
2. Sélectionnez **"Ynov Express - Auth (Local)"**
3. Vérifiez que `baseUrl` est bien défini à `http://localhost:3000`

### 3. Démarrer votre serveur

```bash
cd c:/Users/SamyB/Dev/stikwebservices/ynov-express
npm start
```

Attendez de voir :
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Serveur démarré avec succès!
📡 URL: http://localhost:3000
🔐 Auth: JWT activé
🗄️  Database: Supabase connecté
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🏃 Lancer le Runner

### Méthode 1 : Runner complet (recommandé)

1. Dans Postman, cliquez sur la collection **"Ynov Express - Auth Complete"**
2. Cliquez sur le bouton **"Run"** (en haut à droite ou icône ▶️)
3. Une nouvelle fenêtre "Collection Runner" s'ouvre

#### Configuration du Runner

```
┌────────────────────────────────────────────┐
│ Collection Runner                           │
├────────────────────────────────────────────┤
│                                             │
│ Collection: ✓ Ynov Express - Auth Complete │
│ Environment: ✓ Ynov Express - Auth (Local) │
│                                             │
│ Iterations: 1                               │
│ Delay: 0 ms                                 │
│ Data: None                                  │
│                                             │
│ ☑ Save responses                           │
│ ☑ Keep variable values                     │
│ ☑ Run collection without using stored...   │
│                                             │
│         [Run Ynov Express - Auth...]        │
│                                             │
└────────────────────────────────────────────┘
```

4. Vérifiez que toutes les requêtes sont cochées
5. Cliquez sur **"Run Ynov Express - Auth Complete"**

### Méthode 2 : Runner par sections

Vous pouvez aussi exécuter seulement certaines parties :

#### Workflow recommandé (exécution séquentielle)

1. **Étape 1 : Setup initial**
   - Exécuter le dossier "1. Authentication"
   - Exécuter le dossier "2. Admin - Setup"
   
2. **Étape 2 : Tests des posts**
   - Exécuter "3. Posts (Public)"
   - Exécuter "4. Posts (Protected)"
   
3. **Étape 3 : Tests interactions**
   - Exécuter "5. Comments"
   - Exécuter "6. Likes"

## 📊 Résultats attendus

### ✅ Exécution réussie

Vous devriez voir quelque chose comme :

```
┌─────────────────────────────────────────────┐
│ Run Summary                                  │
├─────────────────────────────────────────────┤
│                                              │
│ ✓ Health Check                    200 OK    │
│ ✓ Generate User Token             200 OK    │
│ ✓ Generate Admin Token            200 OK    │
│ ✓ Verify Token                    200 OK    │
│ ✓ Get User Info (Me)              200 OK    │
│ ✓ Refresh Token                   200 OK    │
│ ✓ Admin - Health Check            200 OK    │
│ ✓ Admin - Diagnostics             200 OK    │
│ ✓ Admin - Reset                   200 OK    │
│ ✓ Admin - Seed                    201 Created│
│ ✓ Admin - Generate Posts          201 Created│
│ ✓ Get All Posts                   200 OK    │
│ ✓ Get Published Posts Only        200 OK    │
│ ✓ Get Post by ID                  200 OK    │
│ ✓ Create Post                     201 Created│
│ ✓ Update Post                     200 OK    │
│ ✓ Publish Post                    204 No Content│
│ ✓ Get Comments                    200 OK    │
│ ✓ Create Comment                  201 Created│
│ ✓ Get Likes                       200 OK    │
│ ✓ Get Likes Count                 200 OK    │
│ ✓ Add Like                        201 Created│
│                                              │
├─────────────────────────────────────────────┤
│ Total Requests: 22                           │
│ Passed: 22 (100%)                           │
│ Failed: 0                                    │
│ Duration: ~5s                                │
└─────────────────────────────────────────────┘
```

### 📝 Console logs

Dans le panneau "Console" (en bas de Postman), vous verrez des logs détaillés :

```
🏥 API Status: ✨ API Ynov Express fonctionnelle
🔑 Token user sauvegardé
👤 User: test@example.com - Role: user
👑 Token admin sauvegardé
👤 Admin: admin@example.com
✓ Token vérifié - Expire dans: 86399 secondes
👤 User ID: test-user-123
📧 Email: test@example.com
🎭 Role: user
🔄 Nouveau token sauvegardé
🔧 API Admin fonctionnelle
📊 Tables: {...}
🗑️ Toutes les tables ont été vidées
🌱 Données de démonstration créées
✨ 5 posts générés avec succès
📝 Posts trouvés: 7
🆔 Premier post ID sauvegardé: xxx-xxx-xxx
💬 Commentaire ajouté
❤️ Like ajouté
```

## 🔍 Tests automatiques inclus

Chaque requête contient des tests automatiques :

### 1. Authentication
- ✅ Génération de token user
- ✅ Génération de token admin
- ✅ Vérification de token
- ✅ Récupération des infos utilisateur
- ✅ Rafraîchissement du token

### 2. Admin
- ✅ Health check admin
- ✅ Diagnostics de la base de données
- ✅ Reset des tables (avec compteurs)
- ✅ Seed de données de démonstration
- ✅ Génération de posts automatiques

### 3. Posts
- ✅ Listing des posts (public)
- ✅ Filtrage des posts publiés
- ✅ Récupération d'un post par ID
- ✅ Création de post (protégé)
- ✅ Modification de post (protégé)
- ✅ Publication de post (protégé)

### 4. Comments & Likes
- ✅ Listing des commentaires
- ✅ Création de commentaire (protégé)
- ✅ Listing des likes
- ✅ Comptage des likes
- ✅ Ajout de like (protégé)

## 🎯 Scénarios de test avancés

### Test 1 : Vérifier que les routes admin nécessitent un token admin

1. Lancez d'abord "1. Authentication" → "Generate User Token"
2. Dans votre environnement, copiez manuellement `authToken` dans `adminToken`
3. Lancez "2. Admin - Setup" → "Admin - Reset"
4. **Résultat attendu** : ❌ 403 Forbidden avec message "ADMIN_REQUIRED"

### Test 2 : Vérifier l'expiration des tokens

1. Dans "1. Authentication" → "Generate User Token"
2. Modifiez temporairement `api/auth.js` pour générer un token expirant dans 5 secondes
3. Attendez 6 secondes
4. Essayez d'utiliser le token
5. **Résultat attendu** : ❌ 401 "Token expiré"

### Test 3 : Test de charge

1. Dans le Runner, configurez :
   - Iterations: **10**
   - Delay: **100 ms**
2. Lancez la collection complète
3. **Résultat attendu** : ✅ Toutes les itérations passent

## 🛠️ Variables d'environnement sauvegardées automatiquement

Les tests sauvegardent automatiquement :

| Variable | Sauvegardée par | Utilisée par |
|----------|----------------|--------------|
| `authToken` | Generate User Token | Toutes les routes protégées |
| `adminToken` | Generate Admin Token | Routes admin |
| `tokenExpiry` | Generate Token | Vérification expiration |
| `postId` | Get All Posts | Get/Update/Delete Post |
| `commentId` | Create Comment | Delete Comment |
| `likeId` | Add Like | Delete Like |

## 📈 Exportation des résultats

### Après l'exécution

1. Cliquez sur **"Export Results"** dans le Runner
2. Choisissez le format :
   - **JSON** : Pour analyse programmatique
   - **HTML** : Pour rapport visuel

### Exemple de rapport HTML

Le rapport inclut :
- ✅ Taux de réussite (Pass %)
- ⏱️ Temps de réponse moyen
- 📊 Graphiques de performance
- 🔍 Détails de chaque test

## 🐛 Débogage

### Si un test échoue

1. **Vérifier le serveur**
   ```bash
   # Le serveur tourne-t-il ?
   curl http://localhost:3000/health
   ```

2. **Vérifier les variables d'environnement**
   - Cliquez sur l'icône 👁️ à côté de l'environnement
   - Vérifiez que `authToken` et `adminToken` ont des valeurs

3. **Consulter la console Postman**
   - Ouvrez la Console (View → Show Postman Console)
   - Vérifiez les erreurs détaillées

4. **Vérifier la base de données**
   - Lancez "Admin - Diagnostics" pour voir l'état des tables

### Erreurs communes

| Erreur | Cause | Solution |
|--------|-------|----------|
| `ECONNREFUSED` | Serveur arrêté | `npm start` |
| `AUTH_TOKEN_MISSING` | Token non sauvegardé | Relancer "Generate Token" |
| `ADMIN_REQUIRED` | Token user utilisé | Utiliser `{{adminToken}}` |
| `404 Not Found` | Route inexistante | Vérifier l'URL |

## 🎓 Tips & Tricks

### 1. Ordre d'exécution

Les requêtes sont ordonnées pour être exécutées séquentiellement :
```
0. Health Check (pas de dépendances)
1. Authentication (génère les tokens)
2. Admin Setup (nécessite token admin)
3-6. Tests CRUD (nécessitent token + postId)
```

### 2. Désactiver certaines requêtes

Pour tester seulement certaines parties :
- Décochez les requêtes non désirées avant de lancer le Runner
- Ou créez une nouvelle collection avec seulement les requêtes voulues

### 3. Tests en parallèle

⚠️ **Ne pas utiliser** : Les requêtes dépendent les unes des autres (authToken, postId, etc.)

### 4. Ajouter vos propres tests

Dans l'onglet "Tests" de chaque requête :

```javascript
pm.test("Mon test personnalisé", function () {
    const json = pm.response.json();
    pm.expect(json.data).to.have.property('monChamp');
    console.log('✅ Mon test réussi !');
});
```

## 📚 Ressources

- [Documentation Postman Runner](https://learning.postman.com/docs/running-collections/intro-to-collection-runs/)
- [Postman Test Scripts](https://learning.postman.com/docs/writing-scripts/test-scripts/)
- [Variables Postman](https://learning.postman.com/docs/sending-requests/variables/)

## ✅ Checklist avant de lancer

- [ ] Serveur démarré (`npm start`)
- [ ] Collection importée dans Postman
- [ ] Environnement importé et activé
- [ ] `baseUrl` = `http://localhost:3000`
- [ ] Base de données Supabase accessible

---

## 🎉 C'est prêt !

Cliquez sur **"Run"** et regardez tous vos tests passer automatiquement ! 🚀

