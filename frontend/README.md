# 🎨 Frontend - Ynov Express

Interface utilisateur React avec Vite, Tailwind CSS et authentification JWT.

## 📁 Structure

```
frontend/
├── src/
│   ├── components/         # Composants React
│   │   ├── AuthPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── Header.jsx
│   │   ├── CreatePost.jsx
│   │   ├── PostsList.jsx
│   │   ├── PostCard.jsx
│   │   ├── Profile.jsx
│   │   └── AdminPanel.jsx
│   ├── contexts/           # Context API
│   │   └── AuthContext.jsx
│   ├── services/           # Services
│   │   └── api.js
│   ├── App.jsx             # Composant principal
│   └── main.jsx            # Point d'entrée
├── public/
├── index.html
└── package.json
```

## 🚀 Installation

```bash
npm install
```

## 🏃 Démarrage

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`.

## 🔧 Configuration

### URL de l'API

Modifiez l'URL de l'API dans `src/services/api.js` si nécessaire :

```javascript
const API_URL = 'http://localhost:3000'
```

## ✨ Fonctionnalités

### 🔐 Authentification

- Connexion avec token JWT
- Déconnexion
- Création de comptes démo (user/admin)
- Gestion de session avec Context API

### 📝 Posts

- Liste des posts avec recherche et filtres
- Création de posts
- Édition de posts
- Publication/dépublication
- Suppression de posts

### 💬 Commentaires

- Affichage des commentaires
- Ajout de commentaires
- Suppression de commentaires

### ❤️ Likes

- Affichage du nombre de likes
- Ajout de likes
- Suppression de likes

### 👤 Profil

- Affichage des informations utilisateur
- Token JWT
- Rôle utilisateur

### 👑 Administration (Admin uniquement)

- Reset de la base de données
- Seed de données
- Génération de données aléatoires
- Diagnostics système

## 🎨 Design

### Tailwind CSS

Le projet utilise Tailwind CSS pour le styling. Couleurs principales :

- **Primary** : Blue (600)
- **Success** : Green (500)
- **Danger** : Red (500)
- **Background** : Gray (50)

### Icônes

Utilise **Lucide React** pour les icônes :

```jsx
import { Heart, MessageCircle, Trash2 } from 'lucide-react'
```

## 🔑 Comptes de test

### Utilisateur standard

```json
{
  "userId": "user-123",
  "email": "user@demo.com",
  "role": "user"
}
```

### Administrateur

```json
{
  "userId": "admin-123",
  "email": "admin@demo.com",
  "role": "admin"
}
```

## 🛠️ Technologies

- **React 18** - Bibliothèque UI
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utility-first
- **Context API** - Gestion d'état globale
- **Lucide React** - Icônes
- **Fetch API** - Communication avec le backend

## 📱 Composants principaux

### `<AuthContext>`

Gère l'authentification globale :

```jsx
const { user, login, logout, token } = useAuth()
```

### `<AuthPage>`

Page de connexion avec :
- Connexion manuelle (userId, email, role)
- Boutons démo (user/admin)

### `<HomePage>`

Page principale avec :
- Création de posts
- Liste des posts
- Profil utilisateur
- Panel admin (si admin)

### `<PostCard>`

Affiche un post avec :
- Titre et contenu
- Date de publication
- Commentaires
- Likes
- Actions (éditer, supprimer, publier)

## 🎯 Flux de données

1. **Connexion** → Génère un token JWT via `/api/auth/generate-token`
2. **Requêtes API** → Token inclus dans le header `Authorization: Bearer <token>`
3. **Réponses** → Données affichées dans les composants
4. **Déconnexion** → Token supprimé du localStorage

## 🧪 Tests

Pour tester l'application :

1. Démarrez le backend : `cd ../backend && npm start`
2. Démarrez le frontend : `npm run dev`
3. Ouvrez `http://localhost:5173`
4. Connectez-vous avec un compte démo

## 📦 Build

```bash
npm run build
```

Les fichiers de production seront dans `dist/`.

## 🚀 Déploiement

### Vercel

```bash
vercel --prod
```

### Netlify

```bash
netlify deploy --prod
```

### Configuration

Assurez-vous de configurer l'URL de l'API en production dans `src/services/api.js`.

## 🐛 Debug

### Le frontend ne se connecte pas au backend

Vérifiez que :
- Le backend est démarré sur `http://localhost:3000`
- L'URL de l'API est correcte dans `src/services/api.js`
- CORS est activé sur le backend

### Les requêtes échouent avec 401

Vérifiez que :
- Vous êtes connecté
- Le token JWT est valide
- Le token n'est pas expiré

## 📚 Documentation

Pour plus d'informations, consultez :

- [Guide du frontend](../docs/guides/FRONTEND_GUIDE.md)
- [Guide d'authentification](../docs/api/AUTH_SETUP.md)
- [README principal](../README.md)

## 🤝 Contribution

Les contributions sont les bienvenues ! Assurez-vous de :

- Suivre la structure des composants existante
- Utiliser Tailwind CSS pour le styling
- Tester vos changements localement
