# 📦 Résumé : Déploiement Vercel

## 🎯 Problème actuel

Votre site **https://t-pwebservices.vercel.app** ne fonctionne pas car :

```
❌ Frontend (Vercel) → cherche l'API à /api (relatif)
❌ Backend (nulle part) → pas déployé
❌ Résultat : Failed to fetch / CORS error
```

## ✅ Solution

```
✅ Frontend (Vercel) → https://t-pwebservices.vercel.app
                          ↓ appelle
✅ Backend (Railway) → https://votre-backend.railway.app/api
                          ↓ utilise
✅ Database (Supabase) → https://votre-projet.supabase.co
```

## 🚀 Actions à faire (dans l'ordre)

### 1️⃣ Déployer le backend sur Railway (5 min)

1. **Aller sur** : https://railway.app
2. **Se connecter** avec GitHub
3. **New Project** → Deploy from GitHub repo
4. **Choisir** votre repo `ynov-express`
5. **Settings** :
   - Root Directory: `backend`
   - Start Command: `npm start`
6. **Variables** (Add all) :
   ```env
   NODE_ENV=production
   PORT=3000
   SUPABASE_URL=https://votre-projet.supabase.co
   SUPABASE_ANON_KEY=votre_anon_key_supabase
   SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
   JWT_SECRET=votre_secret_jwt
   ALLOWED_ORIGINS=https://t-pwebservices.vercel.app
   ```
7. **Deploy** → Copier l'URL Railway générée

### 2️⃣ Configurer Vercel (2 min)

1. **Dashboard Vercel** → votre projet
2. **Settings** → **Environment Variables**
3. **Ajouter** :
   ```
   VITE_API_URL=https://votre-backend.railway.app
   ```
   (Remplacez par votre vraie URL Railway !)
4. **Settings** → **General** → Vérifier :
   - Root Directory: `frontend`
   - Framework: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### 3️⃣ Redéployer Vercel (1 min)

1. **Deployments** → `...` (trois points)
2. **Redeploy**
3. Attendre 1-2 minutes

## 🎉 C'est prêt !

Ouvrez : **https://t-pwebservices.vercel.app**

Ça devrait fonctionner ! 🚀

## 🧪 Tests

### Backend
```
https://votre-backend.railway.app/health
```
→ Doit retourner `{"success": true, "status": "ok"}`

### Frontend
```
https://t-pwebservices.vercel.app
```
→ Doit afficher l'application

## 🐛 Si ça ne marche pas

### Erreur : "Failed to fetch"
→ Vérifiez `VITE_API_URL` dans Vercel
→ Vérifiez que le backend Railway est accessible

### Erreur : "CORS blocked"
→ Vérifiez `ALLOWED_ORIGINS` dans Railway
→ Doit contenir : `https://t-pwebservices.vercel.app`

### Page blanche
→ F12 → Console → Regardez les erreurs
→ Vérifiez les logs Vercel

## 📚 Documentation complète

- **[VERCEL_QUICK_FIX.md](VERCEL_QUICK_FIX.md)** - Guide pas à pas
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Guide détaillé complet

## 💰 Coût

**GRATUIT** pour :
- Railway : $5 crédit/mois (largement suffisant)
- Vercel : 100 GB bandwidth/mois
- Supabase : 500 MB database

## 📝 Checklist

- [ ] Backend déployé sur Railway
- [ ] URL Railway notée
- [ ] Variables Railway configurées
- [ ] `ALLOWED_ORIGINS` contient le domaine Vercel
- [ ] `/health` accessible
- [ ] `VITE_API_URL` configuré dans Vercel
- [ ] Vercel redéployé
- [ ] Application fonctionne

---

**⏱️ Temps total : ~10 minutes**

Bon déploiement ! 🚀

