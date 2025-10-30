# ⚡ Quick Start - Test API en 3 minutes

## 🎯 Objectif
Tester toute votre API automatiquement avec Postman Runner en moins de 3 minutes !

## 📦 Étape 1 : Import (30 secondes)

### Dans Postman :

1. **Importer la collection**
   - Cliquez sur **Import**
   - Glissez `ynov-express-auth-complete.postman_collection.json`
   - ✅ Importé

2. **Importer l'environnement**
   - Cliquez sur **Import**
   - Glissez `ynov-express-auth.postman_environment.json`
   - ✅ Importé

3. **Activer l'environnement**
   - Menu déroulant en haut à droite
   - Sélectionnez **"Ynov Express - Auth (Local)"**
   - ✅ Activé

## 🚀 Étape 2 : Démarrer le serveur (10 secondes)

```bash
npm start
```

Attendez de voir :
```
🚀 Serveur démarré avec succès!
📡 URL: http://localhost:3000
```

## ▶️ Étape 3 : Lancer le Runner (30 secondes)

1. Dans Postman, cliquez sur la collection **"Ynov Express - Auth Complete"**
2. Cliquez sur **"Run"** (bouton bleu ou icône ▶️)
3. Vérifiez :
   - Environment: **Ynov Express - Auth (Local)** ✓
   - Toutes les requêtes cochées ✓
4. Cliquez sur **"Run Ynov Express - Auth Complete"**

## ✅ Résultat attendu (1-2 minutes)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Run Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Requests: 22
Passed: 22 (100%) ✅
Failed: 0
Duration: ~5s

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🎉 C'est tout !

Votre API est testée de A à Z automatiquement ! 🚀

## 📊 Ce qui est testé

- ✅ Health check
- ✅ Génération de tokens (user + admin)
- ✅ Vérification d'authentification
- ✅ Routes admin (reset, seed, generate, diagnostics)
- ✅ CRUD Posts (public + protégé)
- ✅ Commentaires
- ✅ Likes

## 🔄 Pour relancer

1. Ouvrez le Runner Postman
2. Cliquez sur **"Run Again"**
3. C'est reparti ! 🎯

## 📚 Besoin de plus ?

Consultez **`RUNNER_GUIDE.md`** pour :
- Tests avancés
- Débogage
- Scénarios personnalisés
- Export de résultats

---

**Total : 3 minutes pour tester toute l'API !** ⚡

