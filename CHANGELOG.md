# 📝 Changelog

## Version 3.1.0 - Système RBAC Complet

### 🔐 Rôles et Permissions (NEW)
- ✅ 5 rôles hiérarchiques (guest → user → moderator → admin → super_admin)
- ✅ Système de permissions granulaires (resource:action:scope)
- ✅ Middlewares RBAC (requirePermission, requireRole, requireAnyRole)
- ✅ Route de debug des permissions (/api/auth/permissions)
- ✅ Documentation complète (RBAC_GUIDE.md)

### 📚 Documentation
- ✅ Guide RBAC complet avec exemples
- ✅ Résumé des rôles (ROLES_SUMMARY.md)
- ✅ Tableaux comparatifs des permissions

---

## Version 3.0.0 - Architecture Professionnelle

### 🏗️ Restructuration complète
- ✅ Séparation backend/frontend
- ✅ Architecture feature-based (auth, posts, admin)
- ✅ Documentation organisée dans `docs/`
- ✅ Configuration CORS sécurisée
- ✅ Variables d'environnement par dossier

### 🔐 Sécurité
- ✅ Authentification JWT complète
- ✅ Middleware RBAC (Role-Based Access Control)
- ✅ CORS configuré par environnement
- ✅ Protection des routes sensibles
- ✅ Variables d'environnement sécurisées

### ✨ Fonctionnalités
- ✅ API REST complète (Posts, Commentaires, Likes)
- ✅ Frontend React moderne avec Tailwind CSS
- ✅ Panel d'administration
- ✅ Système de filtres et recherche
- ✅ Tests Postman automatisés

### 📚 Documentation
- ✅ README.md amélioré
- ✅ Guides de configuration (Auth, CORS, Supabase)
- ✅ Guide de déploiement (Vercel, Railway, Render)
- ✅ Documentation API complète

---

## Utilisation

### Installation locale
```bash
# Backend
cd backend && npm install && npm start

# Frontend
cd frontend && npm install && npm run dev
```

### Déploiement
Consultez [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)

