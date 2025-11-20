# 🧪 Guide de Configuration des Tests

## 📋 Installation

### Backend

```bash
cd backend
npm install
```

Cela installera automatiquement :
- `jest` - Framework de test
- `supertest` - Tests d'API HTTP

### Frontend

```bash
cd frontend
npm install
```

Cela installera automatiquement :
- `jest` - Framework de test
- `@testing-library/react` - Utilitaires pour tester React
- `@testing-library/jest-dom` - Matchers Jest pour le DOM
- `@testing-library/user-event` - Simulation d'événements utilisateur
- `babel-jest` - Transpilation pour Jest

## 🚀 Lancer les Tests

### Backend

```bash
cd backend

# Lancer tous les tests
npm test

# Mode watch (relance automatique)
npm run test:watch

# Avec rapport de couverture
npm run test:coverage
```

### Frontend

```bash
cd frontend

# Lancer tous les tests
npm test

# Mode watch (relance automatique)
npm run test:watch

# Avec rapport de couverture
npm run test:coverage
```

## 📁 Structure des Tests

### Backend

```
backend/
├── src/
│   ├── middleware/
│   │   └── __tests__/
│   │       └── auth.middleware.test.js
│   ├── features/
│   │   └── auth/
│   │       └── __tests__/
│   │           └── auth.controller.test.js
│   ├── services/
│   │   └── __tests__/
│   │       └── user.service.test.js
│   └── config/
│       └── __tests__/
│           └── constants.test.js
└── coverage/          # Généré après npm run test:coverage
```

### Frontend

```
frontend/
├── src/
│   ├── components/
│   │   └── __tests__/
│   │       └── PostCard.test.jsx
│   └── services/
│       └── __tests__/
│           └── api.test.js
└── coverage/          # Généré après npm run test:coverage
```

## ✅ Tests Créés

### Backend

1. **auth.middleware.test.js** - Tests du middleware d'authentification
   - Vérification du token manquant
   - Vérification du token valide
   - Gestion des tokens expirés
   - Gestion des tokens invalides
   - Création automatique de profil
   - Tests du middleware requireAdmin

2. **auth.controller.test.js** - Tests des contrôleurs d'authentification
   - Génération de token
   - Vérification de token
   - Récupération des infos utilisateur
   - Gestion des erreurs

3. **user.service.test.js** - Tests du service utilisateur
   - Récupération de profil
   - Création/mise à jour de profil
   - Mise à jour de rôle
   - Gestion des erreurs

4. **constants.test.js** - Tests des constantes
   - Vérification des rôles
   - Vérification de la hiérarchie
   - Vérification des permissions

### Frontend

1. **PostCard.test.jsx** - Tests du composant PostCard
   - Affichage du titre
   - Affichage du contenu
   - Affichage du statut publié

2. **api.test.js** - Tests du service API
   - Génération de token
   - Vérification de token
   - Gestion des erreurs réseau

## 🎯 Exemples de Tests

### Test Backend

```javascript
test('devrait retourner 401 si aucun token fourni', async () => {
  req.headers.authorization = undefined;

  await authenticateToken(req, res, next);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(next).not.toHaveBeenCalled();
});
```

### Test Frontend

```javascript
test('devrait afficher le titre du post', () => {
  render(<PostCard post={mockPost} />);
  expect(screen.getByText('Test Post Title')).toBeInTheDocument();
});
```

## 📊 Rapport de Couverture

Après avoir lancé `npm run test:coverage`, vous pouvez :

1. **Voir le rapport dans le terminal**
2. **Ouvrir le rapport HTML** :
   - Backend : `backend/coverage/lcov-report/index.html`
   - Frontend : `frontend/coverage/lcov-report/index.html`

Le rapport montre :
- **Statements** : Pourcentage de lignes exécutées
- **Branches** : Pourcentage de branches testées
- **Functions** : Pourcentage de fonctions appelées
- **Lines** : Pourcentage de lignes couvertes

## 🔧 Configuration

### Variables d'Environnement pour les Tests

Les tests utilisent des valeurs par défaut définies dans `jest.setup.js`. Vous pouvez créer un fichier `.env.test` pour personnaliser :

```env
JWT_SECRET=test-secret-key
SUPABASE_URL=http://localhost:54321
NODE_ENV=test
```

## 🐛 Dépannage

### Erreur : "Cannot find module"

Assurez-vous d'avoir installé toutes les dépendances :
```bash
npm install
```

### Erreur : "SyntaxError: Unexpected token"

Vérifiez que vous utilisez la bonne version de Node.js (18+).

### Les tests ne se lancent pas

Vérifiez que les scripts sont bien dans `package.json` :
```json
{
  "scripts": {
    "test": "NODE_OPTIONS=--experimental-vm-modules jest"
  }
}
```

## 📚 Prochaines Étapes

1. **Ajouter plus de tests** pour augmenter la couverture
2. **Tests d'intégration** avec Supertest pour les routes API
3. **Tests E2E** pour les scénarios complets
4. **Intégration CI/CD** pour lancer les tests automatiquement

## 🎉 C'est Prêt !

Vous pouvez maintenant lancer les tests avec :

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

