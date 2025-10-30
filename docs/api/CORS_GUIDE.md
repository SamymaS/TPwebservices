# 🔐 Guide CORS - Sécurisation des origines

## 📖 Qu'est-ce que CORS ?

**CORS (Cross-Origin Resource Sharing)** est un mécanisme de sécurité qui permet de contrôler quelles origines (domaines) peuvent accéder à votre API.

## ✅ Configuration actuelle

Votre backend utilise maintenant une configuration CORS sécurisée située dans `backend/src/config/cors.config.js`.

### 🔧 Fonctionnement

#### Développement

Par défaut, ces origines sont autorisées en mode développement :

- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative)
- `http://127.0.0.1:5173`
- `http://127.0.0.1:3000`

#### Production

En production, vous devez **explicitement** définir les origines autorisées via la variable d'environnement `ALLOWED_ORIGINS`.

## 🚀 Configuration

### 1. Variables d'environnement

Ajoutez dans votre fichier `backend/.env` :

```env
# Environnement (development, production)
NODE_ENV=development

# Origines autorisées (séparées par des virgules)
ALLOWED_ORIGINS=https://monapp.com,https://www.monapp.com
```

### 2. Exemples de configuration

#### Développement local

```env
NODE_ENV=development
# Pas besoin de ALLOWED_ORIGINS, localhost est autorisé par défaut
```

#### Production simple

```env
NODE_ENV=production
ALLOWED_ORIGINS=https://votre-frontend.vercel.app
```

#### Production avec plusieurs domaines

```env
NODE_ENV=production
ALLOWED_ORIGINS=https://monapp.com,https://www.monapp.com,https://admin.monapp.com
```

#### Production avec domaines dynamiques (staging + prod)

```env
NODE_ENV=production
ALLOWED_ORIGINS=https://monapp-staging.vercel.app,https://monapp.com
```

## 📋 Options CORS configurées

### Méthodes HTTP autorisées

```javascript
GET, POST, PUT, PATCH, DELETE, OPTIONS
```

### Headers autorisés

```javascript
- Content-Type
- Authorization
- X-Requested-With
- Accept
- Origin
```

### Credentials

```javascript
credentials: true // Autorise les cookies et authentification
```

### Cache Preflight

```javascript
maxAge: 86400 // 24 heures
```

## 🔍 Vérification

Au démarrage du serveur, vous verrez :

```
🔐 CORS - Origines autorisées:
   ✓ http://localhost:5173
   ✓ http://localhost:3000
   ✓ https://monapp.com
```

## 🐛 Débogage CORS

### Erreur : "Origine non autorisée"

Si vous voyez cette erreur dans les logs :

```
❌ Origine non autorisée: https://example.com
```

**Solution :** Ajoutez cette origine dans `ALLOWED_ORIGINS` :

```env
ALLOWED_ORIGINS=https://example.com
```

### Erreur : "No 'Access-Control-Allow-Origin' header"

**Causes possibles :**

1. L'origine n'est pas dans la liste autorisée
2. La variable `ALLOWED_ORIGINS` est mal formatée
3. Le serveur backend n'est pas démarré

**Solution :**

```bash
# Vérifiez vos variables d'environnement
cd backend
cat .env | grep ALLOWED_ORIGINS

# Redémarrez le serveur
npm start
```

### Tester avec curl

```bash
# Test sans origine (autorisé)
curl -X GET http://localhost:3000/health

# Test avec origine autorisée
curl -X GET http://localhost:3000/health \
  -H "Origin: http://localhost:5173"

# Test avec origine non autorisée (devrait échouer)
curl -X GET http://localhost:3000/health \
  -H "Origin: https://malicious-site.com"
```

## 🔐 Bonnes pratiques

### ✅ À faire

1. **Toujours définir `ALLOWED_ORIGINS` en production**
2. **Utiliser HTTPS en production** (jamais HTTP)
3. **Lister uniquement vos domaines** (pas de wildcards `*`)
4. **Séparer les environnements** (dev, staging, prod)
5. **Surveiller les logs** pour détecter les tentatives d'accès non autorisées

### ❌ À éviter

1. **Ne jamais utiliser `cors()` sans options en production**
2. **Ne pas utiliser `*` comme origine** (accepte tout le monde)
3. **Ne pas exposer de secrets** dans les headers CORS
4. **Ne pas autoriser des domaines non HTTPS** en production

## 📊 Exemple de déploiement

### Frontend Vercel + Backend Railway

**Frontend (Vercel) :**

- URL : `https://monapp.vercel.app`

**Backend (Railway) `.env` :**

```env
NODE_ENV=production
ALLOWED_ORIGINS=https://monapp.vercel.app
```

### Frontend Netlify + Backend Render

**Frontend (Netlify) :**

- URL production : `https://monapp.netlify.app`
- URL preview : `https://deploy-preview-123--monapp.netlify.app`

**Backend (Render) `.env` :**

```env
NODE_ENV=production
ALLOWED_ORIGINS=https://monapp.netlify.app,https://deploy-preview-123--monapp.netlify.app
```

## 🧪 Tests automatisés

Pour tester CORS avec Postman :

1. **Collection Runner** → Importer `postman/ynov-express-auth-complete.postman_collection.json`
2. **Headers** → Ajouter `Origin: http://localhost:5173`
3. **Vérifier** que les réponses contiennent `Access-Control-Allow-Origin`

## 📚 Ressources

- [MDN - CORS](https://developer.mozilla.org/fr/docs/Web/HTTP/CORS)
- [npm cors package](https://www.npmjs.com/package/cors)
- [Express CORS middleware](https://expressjs.com/en/resources/middleware/cors.html)

## 🆘 Support

Si vous rencontrez des problèmes CORS :

1. Vérifiez les logs du serveur
2. Inspectez les headers de la requête dans DevTools
3. Vérifiez `ALLOWED_ORIGINS` dans `.env`
4. Testez avec curl pour isoler le problème

---

**Note :** Cette configuration CORS est conçue pour être sécurisée par défaut tout en restant flexible pour le développement et la production.

