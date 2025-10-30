# 🚀 Guide de déploiement - Vercel + Railway

Ce guide vous explique comment déployer votre application complète sur Vercel (frontend) et Railway (backend).

## 📋 Prérequis

- ✅ Compte GitHub avec le repo à jour
- ✅ Compte Vercel (gratuit)
- ✅ Compte Railway (gratuit) ou Render
- ✅ Base de données Supabase configurée

## 🎯 Architecture de déploiement

```
┌─────────────────┐
│   Frontend      │  → Vercel
│   (React/Vite)  │     https://t-pwebservices.vercel.app
└────────┬────────┘
         │
         │ API Calls
         ↓
┌─────────────────┐
│   Backend       │  → Railway/Render
│   (Express.js)  │     https://votre-backend.railway.app
└────────┬────────┘
         │
         │ Database
         ↓
┌─────────────────┐
│   Supabase      │  → Cloud
│   (PostgreSQL)  │     https://supabase.com
└─────────────────┘
```

## 🔧 Étape 1 : Déployer le Backend sur Railway

### 1.1 Créer un compte Railway

1. Allez sur [railway.app](https://railway.app)
2. Connectez-vous avec GitHub
3. Cliquez sur "New Project"

### 1.2 Déployer depuis GitHub

1. Sélectionnez "Deploy from GitHub repo"
2. Choisissez votre repository `ynov-express`
3. Railway détectera automatiquement le backend

### 1.3 Configurer le projet

Dans Railway, configurez :

**Root Directory** : `backend`

**Build Command** : `npm install`

**Start Command** : `npm start`

### 1.4 Variables d'environnement

Dans Railway, allez dans **Variables** et ajoutez :

```env
NODE_ENV=production
PORT=3000

# Supabase
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key

# JWT
JWT_SECRET=votre_secret_jwt_super_securise

# CORS - IMPORTANT : Ajoutez votre domaine Vercel
ALLOWED_ORIGINS=https://t-pwebservices.vercel.app,https://www.t-pwebservices.vercel.app
```

### 1.5 Déployer

Railway déploiera automatiquement. Vous obtiendrez une URL comme :

```
https://ynov-express-production.up.railway.app
```

**🔔 Notez cette URL, vous en aurez besoin !**

## 🎨 Étape 2 : Déployer le Frontend sur Vercel

### 2.1 Configurer le projet Vercel

Dans votre dashboard Vercel :

1. Sélectionnez votre projet
2. Allez dans **Settings** → **General**
3. Configurez :

**Root Directory** : `frontend`

**Framework Preset** : `Vite`

**Build Command** : `npm run build`

**Output Directory** : `dist`

### 2.2 Variables d'environnement Vercel

Dans **Settings** → **Environment Variables**, ajoutez :

```env
VITE_API_URL=https://ynov-express-production.up.railway.app
```

⚠️ **Remplacez par l'URL de votre backend Railway !**

### 2.3 Redéployer

1. Allez dans **Deployments**
2. Cliquez sur les `...` du dernier déploiement
3. Cliquez sur **Redeploy**

## ✅ Étape 3 : Vérification

### 3.1 Tester le Backend

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

### 3.2 Vérifier CORS

Dans les logs Railway, vous devriez voir :

```
🔐 CORS - Origines autorisées:
   ✓ https://t-pwebservices.vercel.app
```

### 3.3 Tester le Frontend

Ouvrez :

```
https://t-pwebservices.vercel.app
```

Vous devriez voir votre application fonctionner !

## 🐛 Résolution de problèmes

### Problème : "Failed to fetch"

**Cause** : Le frontend ne peut pas contacter le backend

**Solutions** :

1. Vérifiez que `VITE_API_URL` est bien configuré dans Vercel
2. Vérifiez que le backend est déployé et accessible
3. Vérifiez les logs Railway pour les erreurs

### Problème : "CORS error"

**Cause** : Le domaine Vercel n'est pas autorisé dans CORS

**Solution** :

Dans Railway, ajoutez votre domaine Vercel dans `ALLOWED_ORIGINS` :

```env
ALLOWED_ORIGINS=https://t-pwebservices.vercel.app
```

### Problème : "401 Unauthorized"

**Cause** : JWT_SECRET n'est pas défini ou différent

**Solution** :

Vérifiez que `JWT_SECRET` est identique dans :
- Votre `.env` local
- Railway (variables d'environnement)

### Problème : Page blanche

**Cause** : Erreur JavaScript ou routing

**Solutions** :

1. Ouvrez la console du navigateur (F12)
2. Vérifiez les erreurs dans les logs Vercel
3. Vérifiez que `vercel.json` est bien configuré

## 📊 Monitoring

### Railway

- **Logs** : Railway → Votre projet → Deployments → View Logs
- **Métriques** : CPU, RAM, Requêtes/s
- **URL** : Domaine automatique fourni

### Vercel

- **Analytics** : Dashboard → Analytics
- **Logs** : Project → Deployments → Logs
- **Performance** : Lighthouse scores automatiques

## 🔐 Sécurité en Production

### Backend Railway

- ✅ Variables d'environnement sécurisées
- ✅ CORS configuré pour Vercel uniquement
- ✅ HTTPS automatique
- ✅ JWT avec secret fort

### Frontend Vercel

- ✅ HTTPS automatique
- ✅ Headers de sécurité (configurés dans `vercel.json`)
- ✅ Variables d'environnement privées
- ✅ CDN global

## 💰 Coûts

### Gratuit (Tier gratuit)

- **Vercel** : 100 GB bandwidth/mois
- **Railway** : $5 crédit/mois (500h de compute)
- **Supabase** : 500 MB database, 1 GB bandwidth

### Si vous dépassez

- **Vercel Pro** : $20/mois
- **Railway** : Pay-as-you-go ($0.000463/GB-sec)
- **Supabase Pro** : $25/mois

## 🎯 Domaine personnalisé (Optionnel)

### Sur Vercel

1. Allez dans **Settings** → **Domains**
2. Ajoutez votre domaine : `monapp.com`
3. Suivez les instructions DNS
4. Mettez à jour `ALLOWED_ORIGINS` dans Railway

### Exemple avec domaine personnalisé

```env
# Railway
ALLOWED_ORIGINS=https://monapp.com,https://www.monapp.com
```

## 🔄 Workflow de déploiement

### Développement → Production

1. **Développement local**
   ```bash
   cd backend && npm start
   cd frontend && npm run dev
   ```

2. **Commit & Push**
   ```bash
   git add .
   git commit -m "feat: nouvelle fonctionnalité"
   git push origin main
   ```

3. **Déploiement automatique**
   - Railway redéploie le backend automatiquement
   - Vercel redéploie le frontend automatiquement

4. **Vérification**
   - Testez sur les URLs de production

## 📚 Ressources

- [Documentation Railway](https://docs.railway.app/)
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Supabase](https://supabase.com/docs)

## ✅ Checklist de déploiement

### Backend (Railway)

- [ ] Compte créé
- [ ] Projet connecté à GitHub
- [ ] Root directory configuré (`backend`)
- [ ] Variables d'environnement configurées
- [ ] `ALLOWED_ORIGINS` contient le domaine Vercel
- [ ] Backend accessible via l'URL Railway
- [ ] `/health` retourne 200

### Frontend (Vercel)

- [ ] Projet connecté à GitHub
- [ ] Root directory configuré (`frontend`)
- [ ] `VITE_API_URL` configuré avec l'URL Railway
- [ ] `vercel.json` présent
- [ ] Redéploiement après ajout des variables
- [ ] Application accessible et fonctionnelle
- [ ] Pas d'erreurs CORS dans la console

### Supabase

- [ ] Base de données créée
- [ ] Tables créées (via `database/schema.sql`)
- [ ] RLS configuré (optionnel)
- [ ] Clés copiées dans Railway

---

**🎉 Votre application est maintenant en production !**

URL Frontend : https://t-pwebservices.vercel.app
URL Backend : https://votre-backend.railway.app

