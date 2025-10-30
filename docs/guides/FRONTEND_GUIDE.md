# 🎨 Guide du Frontend - Ynov Express

## 🎯 Vue d'ensemble

Vous avez maintenant un **frontend React complet** pour tester visuellement toutes les fonctionnalités de votre API !

## ✨ Fonctionnalités implémentées

### 🔐 Authentification complète
- ✅ Page de connexion/inscription
- ✅ Génération de tokens JWT (user + admin)
- ✅ Gestion de session (localStorage)
- ✅ Vérification automatique du token
- ✅ Déconnexion
- ✅ Comptes démo pour test rapide

### 📝 Gestion des posts
- ✅ Créer des posts (brouillon)
- ✅ Modifier titre et contenu
- ✅ Publier les brouillons
- ✅ Supprimer des posts
- ✅ Recherche par titre
- ✅ Filtres (tous / publiés)
- ✅ Tri (date, titre)

### 💬 Commentaires
- ✅ Afficher les commentaires
- ✅ Ajouter un commentaire
- ✅ Supprimer un commentaire
- ✅ Horodatage

### ❤️ Likes
- ✅ Liker un post
- ✅ Compteur de likes
- ✅ Mise à jour en temps réel

### 👤 Profil
- ✅ Informations utilisateur
- ✅ Token JWT affiché
- ✅ Permissions détaillées
- ✅ Différence user/admin

### 👑 Panneau Admin
- ✅ Diagnostics base de données
- ✅ Statistiques (posts, comments, likes)
- ✅ Seed de données
- ✅ Génération automatique
- ✅ Reset des données

## 🚀 Lancement rapide

### 1. Terminal Backend (3000)

```bash
# À la racine du projet
npm start
```

Attendez :
```
🚀 Serveur démarré avec succès!
📡 URL: http://localhost:3000
```

### 2. Terminal Frontend (5173)

```bash
# Dans le dossier client/
cd client
npm run dev
```

Vous verrez :
```
  VITE v5.x.x  ready in Xms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 3. Ouvrir le navigateur

```
http://localhost:5173
```

## 🎮 Guide d'utilisation

### Première utilisation

1. **Page d'accueil** : Vous arrivez sur la page de connexion
2. **Choisir un mode** :
   - 👤 **User** : Pour tester les fonctionnalités utilisateur
   - 👑 **Admin** : Pour tester les fonctionnalités admin
3. **Connexion rapide** : Utilisez les boutons "Compte démo"

### Scénario 1 : Utilisateur standard

```
📝 Créer un post
  ├─ Onglet "Posts"
  ├─ Remplir le formulaire en haut
  └─ Cliquer "Créer (brouillon)"

📢 Publier le post
  ├─ Trouver votre post dans la liste
  └─ Cliquer "Publier"

💬 Commenter
  ├─ Cliquer "Commentaires" sur un post
  ├─ Écrire dans le champ texte
  └─ Cliquer "Envoyer"

❤️ Liker
  └─ Cliquer "Like" sur un post

✏️ Modifier
  ├─ Cliquer "Modifier" sur un post
  ├─ Changer le titre ou contenu
  └─ Cliquer "Enregistrer"

🗑️ Supprimer
  └─ Cliquer "Supprimer" (confirmation demandée)
```

### Scénario 2 : Administrateur

```
👑 Accéder au panneau admin
  ├─ Se connecter en mode Admin
  └─ Onglet "Admin"

📊 Voir les statistiques
  └─ Diagnostics en haut de page

🌱 Créer des données de test
  ├─ Seed : 2 posts + comments + likes
  └─ Génération : 1-20 posts automatiques

🔄 Gérer les données
  └─ Reset : Supprimer toutes les données
```

### Scénario 3 : Recherche et filtres

```
🔍 Rechercher
  ├─ Taper au moins 2 caractères
  └─ Résultats filtrés automatiquement

📂 Filtrer
  └─ Cocher "Publiés uniquement"

📅 Trier
  ├─ Plus récents / Plus anciens
  └─ Titre A→Z / Titre Z→A

🔄 Actualiser
  └─ Bouton "Actualiser" pour recharger
```

## 📐 Architecture

### Structure des composants

```
App.jsx (root)
└── AuthProvider (context)
    ├── AuthPage (non connecté)
    │   ├── Formulaire login/signup
    │   ├─ Toggle user/admin
    │   └── Boutons démo
    │
    └── HomePage (connecté)
        ├── Header
        │   ├── Navigation (Posts/Profil/Admin)
        │   └── Info user + Déconnexion
        │
        ├── [Tab: Posts]
        │   ├── CreatePost
        │   │   └── Formulaire
        │   └── PostsList
        │       ├── Filtres + Tri
        │       └── PostCard[]
        │           ├── Actions
        │           ├── Commentaires
        │           └── Likes
        │
        ├── [Tab: Profil]
        │   └── Profile
        │       ├── Infos user
        │       ├── Token JWT
        │       └── Permissions
        │
        └── [Tab: Admin]
            └── AdminPanel
                ├── Diagnostics
                ├── Seed
                ├── Génération
                └── Reset
```

### Gestion de l'état

```javascript
// Global (Context API)
AuthContext
├── user          // Infos utilisateur
├── token         // JWT token
├── login()       // Se connecter
├── signup()      // S'inscrire
├── logout()      // Se déconnecter
└── refreshUser() // Actualiser

// Local (useState)
Chaque composant gère son état local
- Posts : liste, loading, filtres
- Comments : liste, nouveau commentaire
- Likes : count, liste
```

### API Service Layer

```javascript
// services/api.js
authAPI      // Auth operations
postsAPI     // Posts CRUD
commentsAPI  // Comments CRUD
likesAPI     // Likes operations
adminAPI     // Admin operations
```

## 🎨 Personnalisation

### Couleurs

Modifier `tailwind.config.js` :

```javascript
theme: {
  extend: {
    colors: {
      primary: '#0ea5e9',    // sky-500
      secondary: '#f59e0b',  // amber-500
      danger: '#f43f5e',     // rose-500
      success: '#10b981',    // emerald-500
    }
  }
}
```

### Textes et labels

Tous les textes sont en français et modifiables directement dans les composants.

### Logo

Modifier dans `Header.jsx` :

```jsx
<div className="text-2xl font-bold">
  ✨ Votre Logo
</div>
```

## 🔧 Configuration avancée

### Changer le port

`vite.config.js` :

```javascript
server: {
  port: 3001,  // Au lieu de 5173
  proxy: {
    '/api': 'http://localhost:3000'
  }
}
```

### URL du backend

Si le backend n'est pas sur localhost:3000, modifier `vite.config.js` :

```javascript
proxy: {
  '/api': 'http://votre-backend.com'
}
```

## 📱 Responsive Design

Le frontend est **responsive** et fonctionne sur :

- 💻 Desktop (1920px+)
- 💻 Laptop (1366px - 1920px)
- 📱 Tablet (768px - 1366px)
- 📱 Mobile (320px - 768px)

Les composants s'adaptent automatiquement grâce à Tailwind CSS.

## ⚡ Performances

### Optimisations implémentées

- ✅ **React.memo** sur les composants lourds
- ✅ **useMemo** pour les calculs coûteux
- ✅ **useEffect** optimisés avec dépendances
- ✅ **Lazy loading** des détails (comments/likes)
- ✅ **Debounce** sur la recherche (implémentable)

### Build optimisé

```bash
npm run build
```

Génère un bundle optimisé dans `dist/` :
- Code splitting
- Tree shaking
- Minification
- Compression

## 🐛 Débogage

### Console du navigateur (F12)

```javascript
// Voir le token actuel
console.log(localStorage.getItem('authToken'))

// Voir l'état du Context
// (ajouter dans AuthContext)
console.log('User:', user)
console.log('Token:', token)
```

### React DevTools

Extension Chrome/Firefox pour inspecter :
- Component tree
- Props
- State
- Context

### Network Tab

Voir toutes les requêtes API :
- Méthode (GET, POST, etc.)
- URL
- Headers (Authorization)
- Response

## 🎯 Tests manuels

### Checklist complète

**Authentification** :
- [ ] Connexion en mode user
- [ ] Connexion en mode admin
- [ ] Inscription
- [ ] Déconnexion
- [ ] Token sauvegardé
- [ ] Token expiré géré

**Posts** :
- [ ] Créer un post
- [ ] Voir la liste
- [ ] Voir un post
- [ ] Modifier un post
- [ ] Publier un post
- [ ] Supprimer un post

**Filtres** :
- [ ] Recherche par titre
- [ ] Filtre publiés
- [ ] Tri par date
- [ ] Tri par titre

**Interactions** :
- [ ] Ajouter un commentaire
- [ ] Supprimer un commentaire
- [ ] Liker un post
- [ ] Compteur de likes

**Admin** :
- [ ] Voir diagnostics
- [ ] Seed données
- [ ] Générer posts
- [ ] Reset données

**Profil** :
- [ ] Voir ses infos
- [ ] Voir son token
- [ ] Voir ses permissions

## 🚀 Déploiement

### Build

```bash
cd client
npm run build
```

Fichiers générés dans `dist/`.

### Hébergement

Options recommandées :
- **Vercel** : `vercel deploy`
- **Netlify** : Drag & drop `dist/`
- **GitHub Pages** : Via Actions
- **Railway** : Avec le backend

### Variables d'environnement

En production, configurer :

```bash
VITE_API_URL=https://votre-backend.com
```

Et utiliser dans `api.js` :

```javascript
const API_BASE = import.meta.env.VITE_API_URL || '/api'
```

## 📚 Documentation technique

### Dépendances principales

```json
{
  "react": "^18.3.1",           // UI Framework
  "react-dom": "^18.3.1",       // DOM rendering
  "vite": "^5.4.8",             // Build tool
  "tailwindcss": "^3.4.10",     // CSS framework
  "autoprefixer": "^10.4.19",   // CSS prefixes
  "postcss": "^8.4.47"          // CSS processing
}
```

### APIs utilisées

- **Fetch API** : Requêtes HTTP
- **LocalStorage API** : Stockage du token
- **Context API** : État global
- **Hooks API** : useState, useEffect, useContext, useMemo

## 💡 Tips

1. **Utilisez les comptes démo** pour tester rapidement
2. **F12 → Network** pour voir les requêtes API
3. **F12 → Console** pour voir les erreurs
4. **Ctrl+R** pour recharger en cas de bug
5. **Ctrl+Shift+R** pour vider le cache

## 🎉 Résultat

Vous avez maintenant un **frontend complet et moderne** qui permet de :

- ✅ **Tester visuellement** toutes les fonctionnalités
- ✅ **Créer des comptes** et gérer l'authentification
- ✅ **CRUD complet** sur les posts
- ✅ **Interactions** (comments, likes)
- ✅ **Administration** (diagnostics, seed, generate, reset)
- ✅ **Recherche et filtres** avancés
- ✅ **UI/UX moderne** et responsive

---

**Prêt à tester ? Lancez `npm run dev` et amusez-vous ! 🚀**

