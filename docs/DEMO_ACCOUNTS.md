# 🎭 Comptes Démo - Explication

## ❓ Différence : Compte Démo vs Rôles

### 🤔 Quelle est la différence ?

**"Compte démo"** et **"Rôle"** sont deux concepts différents :

| Concept | Description | Exemple |
|---------|-------------|---------|
| **Compte Démo** | Un compte de test pré-configuré | "Démo User" ou "Démo Admin" |
| **Rôle** | Le niveau de permission du compte | `user`, `moderator`, `admin`, etc. |

### 🎯 Dans le frontend

Quand vous cliquez sur **"Démo User"** ou **"Démo Admin"** :
```javascript
// Bouton "Démo User"
createDemoUser() {
  return {
    userId: "demo-user-123",
    email: "demo-user@example.com",
    role: "user"  // ← Le RÔLE du compte démo
  }
}

// Bouton "Démo Admin"
createDemoAdmin() {
  return {
    userId: "demo-admin-456",
    email: "demo-admin@example.com",
    role: "admin"  // ← Le RÔLE du compte démo
  }
}
```

### 📊 Tableau explicatif

| Bouton Frontend | ID | Email | Rôle | Permissions |
|----------------|-------|-------|------|-------------|
| **Démo User** | `demo-user-123` | `demo-user@example.com` | `user` | CRUD sur son contenu |
| **Démo Admin** | `demo-admin-456` | `demo-admin@example.com` | `admin` | Accès admin complet |

## 🎨 Dans votre frontend actuel

### Fichier : `frontend/src/components/AuthPage.jsx`

```jsx
// Bouton "Démo User"
<button onClick={() => handleDemoLogin('user')}>
  Démo User
</button>

// Bouton "Démo Admin"
<button onClick={() => handleDemoLogin('admin')}>
  Démo Admin
</button>

// Fonction qui génère le token
const handleDemoLogin = async (role) => {
  const demoData = {
    userId: `demo-${role}-${Date.now()}`,
    email: `demo-${role}@example.com`,
    role: role  // ← Le RÔLE est passé ici
  }
  
  // Appel API pour générer le token
  const response = await authAPI.generateToken(demoData)
  // ...
}
```

## 🆕 Nouveaux rôles disponibles

Maintenant que vous avez **5 rôles**, vous pouvez créer **5 boutons démo** :

### Option 1 : Boutons séparés

```jsx
<button onClick={() => handleDemoLogin('guest')}>
  🔓 Démo Guest (lecture seule)
</button>

<button onClick={() => handleDemoLogin('user')}>
  👤 Démo User (standard)
</button>

<button onClick={() => handleDemoLogin('moderator')}>
  👮 Démo Moderator (modération)
</button>

<button onClick={() => handleDemoLogin('admin')}>
  🛡️ Démo Admin (administration)
</button>

<button onClick={() => handleDemoLogin('super_admin')}>
  👑 Démo Super Admin (tout)
</button>
```

### Option 2 : Menu déroulant

```jsx
<select onChange={(e) => handleDemoLogin(e.target.value)}>
  <option value="">Choisir un rôle démo...</option>
  <option value="guest">🔓 Guest (lecture)</option>
  <option value="user">👤 User (standard)</option>
  <option value="moderator">👮 Moderator</option>
  <option value="admin">🛡️ Admin</option>
  <option value="super_admin">👑 Super Admin</option>
</select>
```

## 🔍 Vérifier son rôle

Une fois connecté, vous pouvez vérifier votre rôle :

### Dans le frontend
```jsx
// Depuis le context
const { user } = useAuth()
console.log(user.role)  // 'user', 'admin', 'moderator', etc.
```

### Via l'API
```bash
GET http://localhost:3000/api/auth/me
Authorization: Bearer <votre_token>

# Réponse
{
  "user": {
    "id": "demo-user-123",
    "email": "demo-user@example.com",
    "role": "user"  // ← Votre rôle actuel
  }
}
```

### Voir toutes vos permissions
```bash
GET http://localhost:3000/api/auth/permissions
Authorization: Bearer <votre_token>

# Réponse
{
  "user": {
    "role": "user"
  },
  "permissions": [
    "posts:read",
    "posts:create",
    "posts:update:own",
    "posts:delete:own",
    "comments:read",
    "comments:create",
    "..."
  ]
}
```

## 💡 Exemples d'utilisation

### Tester en tant que User
```jsx
// Frontend
<button onClick={() => handleDemoLogin('user')}>
  Tester comme User
</button>

// Résultat : Peut créer des posts mais pas accéder à /admin
```

### Tester en tant que Moderator
```jsx
<button onClick={() => handleDemoLogin('moderator')}>
  Tester comme Moderator
</button>

// Résultat : Peut supprimer n'importe quel post mais pas accéder aux routes admin
```

### Tester en tant que Admin
```jsx
<button onClick={() => handleDemoLogin('admin')}>
  Tester comme Admin
</button>

// Résultat : Accès à /admin/reset, /admin/seed, etc.
```

## 🎓 Pour les Professeurs

Ce système permet de démontrer :

1. **Séparation des préoccupations**
   - Compte (identité) ≠ Rôle (permissions)

2. **Principe du moindre privilège**
   - Chaque utilisateur a juste les permissions nécessaires

3. **Hiérarchie claire**
   - guest < user < moderator < admin < super_admin

4. **Tests faciles**
   - Boutons démo pour chaque rôle
   - Pas besoin de vraie base utilisateurs

## 📝 Résumé

```
Compte Démo = Un utilisateur de test
            ↓
         avec un
            ↓
         Rôle = Niveau de permission
            ↓
         qui donne
            ↓
    Permissions = Actions autorisées
```

**Exemple concret** :
```
"Démo Admin" = Compte de test
               avec rôle "admin"
               qui donne permissions [posts:*, comments:*, admin:*]
               donc peut tout faire
```

---

**Prochaine étape** : Mettez à jour votre frontend pour ajouter les nouveaux rôles ! 🚀

