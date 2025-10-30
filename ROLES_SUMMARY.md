# 👥 Résumé des Rôles - Ynov Express

## 🎯 Système actuel

### Avant (2 rôles simples)
```
USER → Peut créer/modifier ses posts
ADMIN → Accès admin complet
```

### Maintenant (5 rôles hiérarchiques) ✨

```
GUEST → Lecture seule
  ↓
USER → CRUD sur son contenu
  ↓
MODERATOR → Modérer tout le contenu
  ↓
ADMIN → Administration complète
  ↓
SUPER_ADMIN → Accès total
```

## 📋 Comparaison rapide

| Rôle | Niveau | Description | Exemple |
|------|--------|-------------|---------|
| **Guest** | 0 | 🔓 Lecture seule | Visiteur non connecté |
| **User** | 1 | 👤 Utilisateur standard | Jean qui crée des posts |
| **Moderator** | 2 | 👮 Modérateur | Marie qui supprime le spam |
| **Admin** | 3 | 🛡️ Administrateur | Paul qui gère le site |
| **Super Admin** | 4 | 👑 Propriétaire | Vous (développeur) |

## 🔑 Permissions par rôle

### 🔓 Guest
```
✅ Lire posts
✅ Lire commentaires
✅ Lire likes
❌ Créer/Modifier/Supprimer
```

### 👤 User
```
✅ Tout ce que Guest peut faire
✅ Créer posts
✅ Modifier SES posts
✅ Supprimer SES posts
✅ Créer commentaires
✅ Supprimer SES commentaires
✅ Ajouter likes
✅ Retirer SES likes
❌ Modifier/Supprimer le contenu des autres
```

### 👮 Moderator
```
✅ Tout ce que User peut faire
✅ Modifier TOUS les posts
✅ Supprimer TOUS les posts
✅ Publier TOUS les posts
✅ Supprimer TOUS les commentaires
✅ Retirer TOUS les likes
❌ Accès routes admin
```

### 🛡️ Admin
```
✅ Tout ce que Moderator peut faire
✅ Routes admin (seed, generate, reset)
✅ Diagnostics système
✅ Gestion complète du contenu
```

### 👑 Super Admin
```
✅ TOUT sans restriction
✅ Toutes les permissions présentes et futures
```

## 🧪 Test des rôles

### 1. Créer un token avec un rôle

```bash
POST http://localhost:3000/api/auth/generate-token
Content-Type: application/json

{
  "userId": "test-123",
  "email": "test@example.com",
  "role": "moderator"
}
```

Rôles disponibles : `guest`, `user`, `moderator`, `admin`, `super_admin`

### 2. Vérifier vos permissions

```bash
GET http://localhost:3000/api/auth/permissions
Authorization: Bearer <votre_token>
```

Vous verrez toutes vos permissions listées !

## 💡 Cas d'usage

### Scenario Blog

| Personne | Rôle | Peut faire |
|----------|------|------------|
| Visiteur | Guest | Lire articles |
| Auteur | User | Écrire articles |
| Rédacteur en chef | Moderator | Valider/modifier articles |
| Propriétaire | Admin | Gérer le site |

### Scenario Forum

| Personne | Rôle | Peut faire |
|----------|------|------------|
| Anonyme | Guest | Lire discussions |
| Membre | User | Créer discussions |
| Modérateur | Moderator | Supprimer spam |
| Administrateur | Admin | Configuration |

## 📚 Documentation complète

Pour plus de détails, consultez : **[docs/RBAC_GUIDE.md](docs/RBAC_GUIDE.md)**

## 🎓 Pour les Professeurs

Ce système RBAC complet permet de démontrer :
- ✅ Authentification JWT
- ✅ Contrôle d'accès granulaire
- ✅ Hiérarchie de rôles
- ✅ Bonnes pratiques de sécurité
- ✅ Architecture scalable

---

**Besoin d'aide ?** Consultez la documentation complète dans `docs/RBAC_GUIDE.md` 📖

