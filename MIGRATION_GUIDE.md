# 🔄 Guide de migration - Nouvelle architecture

## ✨ Ce qui a changé

Le projet a été complètement réorganisé avec une architecture professionnelle séparant clairement le backend et le frontend.

### 📐 Nouvelle structure

```
ynov-express/
├── backend/                       # 🆕 Backend isolé
│   ├── src/
│   │   ├── features/              # Architecture par fonctionnalités
│   │   │   ├── auth/              # Routes + Controllers + Services Auth
│   │   │   ├── posts/             # Routes + Controllers Posts
│   │   │   └── admin/             # Routes + Controllers Admin
│   │   ├── config/                # Configuration centralisée
│   │   ├── middleware/            # Middlewares
│   │   ├── utils/                 # Utilitaires
│   │   └── services/              # Services (Supabase)
│   ├── index.js                   # Point d'entrée backend
│   ├── package.json               # Dépendances backend
│   ├── .env                       # Variables d'environnement
│   └── node_modules/              # Modules backend
│
├── frontend/                      # 🆕 Frontend isolé (ex-client/)
│   ├── src/
│   ├── package.json
│   └── node_modules/
│
├── docs/                          # 🆕 Documentation organisée
│   ├── api/                       # Docs API
│   ├── database/                  # Docs database
│   └── guides/                    # Guides
│
├── database/                      # 🆕 Schémas SQL
│   ├── schema.sql
│   └── demo_schema.sql
│
└── postman/                       # Tests Postman (inchangé)
```

## 🚀 Migration des commandes

### Avant (ancienne structure)

```bash
# À la racine
npm install
npm start

# Frontend
cd client
npm install
npm run dev
```

### Après (nouvelle structure)

```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm run dev
```

## 📝 Changements de code

### Imports Backend

**Avant :**
```javascript
import { supabase } from "../supabaseClient.js"
import { authenticateToken } from "../middleware/auth.js"
```

**Après :**
```javascript
import { supabase } from '../../services/supabase.service.js'
import { authenticateToken } from '../../middleware/auth.middleware.js'
```

### Structure des routes

**Avant :** Tout dans `api/posts.js`, `api/admin.js`, etc.

**Après :** Séparation Routes + Controllers
- `features/posts/posts.routes.js` - Définition des routes
- `features/posts/posts.controller.js` - Logique métier

## 🔧 Configuration

### Variables d'environnement

Le fichier `.env` doit maintenant être dans `backend/.env` :

```env
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
JWT_SECRET=...
PORT=3000
```

## ✅ Avantages de la nouvelle architecture

1. **Séparation claire** - Backend et frontend complètement isolés
2. **Scalabilité** - Architecture par fonctionnalités (features)
3. **Maintenabilité** - Code mieux organisé et plus facile à maintenir
4. **Déploiement** - Possibilité de déployer backend et frontend séparément
5. **Documentation** - Centralisée dans `docs/`
6. **Tests** - Plus facile à tester avec la séparation controllers/routes

## 📦 Déploiement

### Backend (exemple Render/Railway)

```bash
cd backend
# Build command: npm install
# Start command: npm start
```

### Frontend (exemple Vercel/Netlify)

```bash
cd frontend
# Build command: npm run build
# Output directory: dist
```

## 🐛 Problèmes courants

### "Cannot find module"

**Solution :** Vérifiez que vous êtes dans le bon dossier (backend/ ou frontend/) et que vous avez bien fait `npm install`.

### "JWT_SECRET not defined"

**Solution :** Vérifiez que le fichier `.env` est bien dans `backend/.env`.

### Le frontend ne se connecte pas au backend

**Solution :** Vérifiez l'URL de l'API dans `frontend/src/services/api.js` (devrait être `http://localhost:3000`).

## 📚 Documentation

Consultez la documentation complète dans le dossier `docs/` :

- [README principal](README.md)
- [Documentation API](docs/api/)
- [Documentation base de données](docs/database/)
- [Guides](docs/guides/)

## 🎉 Prêt à démarrer !

1. ✅ Backend : `cd backend && npm install && npm start`
2. ✅ Frontend : `cd frontend && npm install && npm run dev`
3. ✅ Testez : Ouvrez `http://localhost:5173`

---

**Note :** Cette migration a été effectuée automatiquement. Tous les anciens fichiers ont été déplacés ou supprimés. Les fonctionnalités restent identiques, seule l'organisation a changé.

