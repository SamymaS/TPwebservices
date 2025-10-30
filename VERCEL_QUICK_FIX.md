# ⚡ Solution rapide pour faire fonctionner Vercel

Votre site **t-pwebservices.vercel.app** ne fonctionne pas car :

1. ❌ Le frontend ne sait pas où trouver l'API backend
2. ❌ Le backend n'est pas déployé (ou pas accessible)
3. ❌ Le domaine Vercel n'est pas autorisé dans CORS

## 🚀 Solution en 3 étapes

### Étape 1 : Déployer le backend sur Railway

**Railway est GRATUIT et super simple !**

1. Allez sur **[railway.app](https://railway.app)**
2. Cliquez sur **"Start a New Project"**
3. Connectez votre compte GitHub
4. Sélectionnez **"Deploy from GitHub repo"**
5. Choisissez votre repo `ynov-express`
6. Cliquez sur **"Add variables"** et ajoutez :

```env
NODE_ENV=production
PORT=3000
SUPABASE_URL=votre_url_supabase
SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
JWT_SECRET=votre_secret_jwt
ALLOWED_ORIGINS=https://t-pwebservices.vercel.app
```

7. Dans **Settings**, configurez :
   - **Root Directory** : `backend`
   - **Start Command** : `npm start`

8. Railway vous donnera une URL comme : `https://ynov-express-production.up.railway.app`

**📝 NOTEZ CETTE URL !**

### Étape 2 : Configurer Vercel

1. Allez sur votre dashboard Vercel
2. Sélectionnez votre projet **t-pwebservices**
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez :

```
Name:  VITE_API_URL
Value: https://ynov-express-production.up.railway.app
```

(Remplacez par votre vraie URL Railway)

5. Allez dans **Settings** → **General**
6. Vérifiez :
   - **Root Directory** : `frontend`
   - **Framework Preset** : `Vite`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`

### Étape 3 : Redéployer

1. Dans Vercel, allez dans **Deployments**
2. Cliquez sur les `...` (trois points) à côté de votre dernier déploiement
3. Cliquez sur **"Redeploy"**

## ✅ Vérification

### Tester le backend

Ouvrez dans votre navigateur :
```
https://votre-backend.railway.app/health
```

Vous devriez voir :
```json
{
  "success": true,
  "status": "ok",
  "message": "✨ API Ynov Express fonctionnelle"
}
```

### Tester le frontend

Ouvrez :
```
https://t-pwebservices.vercel.app
```

Ça devrait fonctionner ! 🎉

## 🆘 Si ça ne marche toujours pas

### Erreur CORS

Si vous voyez "CORS error" dans la console :

1. Allez dans Railway
2. Variables → Modifiez `ALLOWED_ORIGINS`
3. Ajoutez : `https://t-pwebservices.vercel.app`
4. Sauvegardez et attendez le redéploiement

### Erreur "Failed to fetch"

Si vous voyez "Failed to fetch" :

1. Vérifiez que `VITE_API_URL` est bien configuré dans Vercel
2. Vérifiez que le backend Railway est bien déployé et accessible
3. Testez l'URL du backend directement dans votre navigateur

### Page blanche

Si la page est blanche :

1. Ouvrez la console (F12)
2. Regardez les erreurs
3. Vérifiez les logs Vercel dans **Deployments** → **View Function Logs**

## 💡 Alternative : Backend local temporaire

Si vous voulez tester rapidement sans Railway :

1. Utilisez **ngrok** pour exposer votre backend local
2. Installez ngrok : `npm install -g ngrok`
3. Démarrez votre backend : `cd backend && npm start`
4. Dans un autre terminal : `ngrok http 3000`
5. Ngrok vous donnera une URL : `https://abc123.ngrok.io`
6. Utilisez cette URL comme `VITE_API_URL` dans Vercel

⚠️ **Mais attention** : ngrok est temporaire, l'URL change à chaque redémarrage !

## 📚 Documentation complète

Pour plus de détails, consultez : **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**

---

**Questions ?** Relisez ce guide ou consultez la documentation Railway/Vercel.

