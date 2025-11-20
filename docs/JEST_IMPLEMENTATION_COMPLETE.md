# 📋 Documentation Complète - Implémentation Jest

Ce document détaille l'implémentation complète de Jest pour les tests unitaires dans le projet, incluant la configuration, les mocks, les tests écrits et les routes concernées.

---

## 📦 Installation et Configuration

### Backend

#### Dépendances ajoutées (`backend/package.json`)

```json
"devDependencies": {
  "@jest/globals": "^30.2.0",
  "cross-env": "^7.0.3",
  "jest": "^29.7.0",
  "supertest": "^6.3.4"
}
```

#### Scripts npm (`backend/package.json`)

```json
"scripts": {
  "test": "cross-env NODE_OPTIONS=--experimental-vm-modules jest",
  "test:watch": "cross-env NODE_OPTIONS=--experimental-vm-modules jest --watch",
  "test:coverage": "cross-env NODE_OPTIONS=--experimental-vm-modules jest --coverage"
}
```

**Note** : `cross-env` est utilisé pour la compatibilité Windows PowerShell avec `NODE_OPTIONS`.

#### Fichiers de configuration

**`backend/jest.config.js`**
- Environnement : `node`
- Pattern de tests : `**/__tests__/**/*.js` et `**/?(*.)+(spec|test).js`
- Coverage : exclut les fichiers de test eux-mêmes
- Module mapper : gère les imports `.js` pour ESM
- Setup : charge `jest.setup.js` avant les tests

**`backend/jest.setup.js`**
- Charge les variables d'environnement (`.env.test` puis `.env`)
- Définit `JWT_SECRET` par défaut pour les tests
- Définit `NODE_ENV=test`

### Frontend

#### Dépendances ajoutées (`frontend/package.json`)

```json
"devDependencies": {
  "@babel/core": "^7.23.0",
  "@babel/preset-env": "^7.23.0",
  "@babel/preset-react": "^7.22.0",
  "@testing-library/jest-dom": "^6.9.1",
  "@testing-library/react": "^14.3.1",
  "@testing-library/user-event": "^14.5.0",
  "@types/react": "^18.3.5",
  "@types/react-dom": "^18.3.0",
  "babel-jest": "^29.7.0",
  "cross-env": "^7.0.3",
  "identity-obj-proxy": "^3.0.0",
  "jest": "^29.7.0",
  "jest-environment-jsdom": "^29.7.0"
}
```

#### Scripts npm (`frontend/package.json`)

```json
"scripts": {
  "test": "cross-env NODE_OPTIONS=--experimental-vm-modules jest",
  "test:watch": "cross-env NODE_OPTIONS=--experimental-vm-modules jest --watch",
  "test:coverage": "cross-env NODE_OPTIONS=--experimental-vm-modules jest --coverage"
}
```

#### Fichiers de configuration

**`frontend/jest.config.js`**
- Environnement : `jsdom` (pour React)
- Setup files : `jest.setup.js` (avant) et `src/setupTests.js` (après)
- Transform : Babel pour `.js` et `.jsx`
- Module mapper : alias `@/` et gestion des CSS avec `identity-obj-proxy`
- Coverage : exclut les fichiers de test et `main.jsx`

**`frontend/jest.setup.js`**
- Mock de `import.meta.env` pour Vite (définit `globalThis.import.meta.env.VITE_API_URL`)

**`frontend/src/setupTests.js`**
- Importe `@testing-library/jest-dom` pour les matchers DOM

**`frontend/babel.config.js`**
- Presets : `@babel/preset-env` et `@babel/preset-react` (runtime automatique)

**`frontend/src/services/api.js`**
- Fallback pour `import.meta.env` : utilise `process.env.VITE_API_URL` ou `http://localhost:3000` en test

---

## 🧪 Tests Backend

### 1. Middleware d'authentification

**Fichier** : `backend/src/middleware/__tests__/auth.middleware.test.js`

**Mocks utilisés** :
- `jest.unstable_mockModule('../../services/user.service.js')` → mocke `getUserProfile` et `createOrUpdateUserProfile`
- `jest.unstable_mockModule('jsonwebtoken')` → mocke `jwt.verify` et `jwt.sign`

**Tests couverts** :
- ✅ Token manquant → retourne 401
- ✅ Header Authorization mal formaté → retourne 401
- ✅ Token valide → appelle `next()` et attache `req.user`
- ✅ Utilisateur inexistant → crée un profil par défaut avec rôle `user`
- ✅ Token expiré → retourne 401 avec message approprié
- ✅ Token invalide → retourne 403 avec message approprié
- ✅ Middleware `requireAdmin` : utilisateur non authentifié → 401
- ✅ Middleware `requireAdmin` : utilisateur non admin → 403
- ✅ Middleware `requireAdmin` : utilisateur admin → appelle `next()`

**Routes concernées** :
- Toutes les routes protégées utilisant `authenticateToken`
- Routes admin utilisant `requireAdmin`

### 2. Contrôleur d'authentification

**Fichier** : `backend/src/features/auth/__tests__/auth.controller.test.js`

**Mocks utilisés** :
- `jest.unstable_mockModule('../../../services/user.service.js')` → mocke les fonctions de service utilisateur
- `jest.unstable_mockModule('jsonwebtoken')` → mocke `jwt.verify` et `jwt.sign`

**Tests couverts** :
- ✅ `generateToken` : génère un token et crée un profil utilisateur
- ✅ `generateToken` : utilise des valeurs par défaut si champs manquants
- ✅ `generateToken` : retourne erreur si rôle invalide
- ✅ `verifyToken` : retourne 401 si aucun token fourni
- ✅ `verifyToken` : vérifie un token valide et retourne les infos utilisateur
- ✅ `verifyToken` : retourne 403 si token invalide
- ✅ `getMe` : retourne les informations de l'utilisateur connecté

**Routes concernées** :
- `POST /api/auth/generate-token` → `authController.generateToken`
- `POST /api/auth/generate-admin-token` → `authController.generateAdminToken`
- `GET /api/auth/verify` → `authController.verifyToken`
- `GET /api/auth/me` → `authController.getMe`

### 3. Service utilisateur

**Fichier** : `backend/src/services/__tests__/user.service.test.js`

**Mocks utilisés** :
- `jest.mock('../supabase.service.js')` → utilise le mock manuel dans `__mocks__/supabase.service.js`
- Mock en chaîne de Supabase : `from().select().eq().single()`, `from().upsert().select().single()`, `from().update().eq().select().single()`

**Tests couverts** :
- ✅ `getUserProfile` : récupère un profil utilisateur existant
- ✅ `getUserProfile` : retourne `null` si utilisateur inexistant (code `PGRST116`)
- ✅ `getUserProfile` : lance une erreur pour les autres erreurs de base de données
- ✅ `createOrUpdateUserProfile` : crée un nouveau profil utilisateur
- ✅ `createOrUpdateUserProfile` : met à jour un profil existant
- ✅ `createOrUpdateUserProfile` : lance une erreur si rôle invalide
- ✅ `updateUserRole` : met à jour le rôle d'un utilisateur
- ✅ `updateUserRole` : lance une erreur si rôle invalide
- ✅ `updateUserRole` : lance une erreur si utilisateur inexistant

**Routes concernées** :
- Utilisé par toutes les routes d'authentification et d'administration
- `PATCH /api/admin/users/:userId/role` → utilise `updateUserRole`

### 4. Constantes

**Fichier** : `backend/src/config/__tests__/constants.test.js`

**Tests couverts** :
- ✅ `USER_ROLES` : contient tous les rôles attendus (`guest`, `user`, `moderator`, `admin`, `super_admin`)
- ✅ `PERMISSIONS` : contient toutes les permissions attendues
- ✅ `HTTP_STATUS` : contient tous les codes HTTP attendus
- ✅ `ERROR_CODES` : contient tous les codes d'erreur attendus

**Routes concernées** :
- Utilisé par tout le système d'authentification et de permissions

---

## 🧪 Tests Frontend

### 1. Service API

**Fichier** : `frontend/src/services/__tests__/api.test.js`

**Mocks utilisés** :
- `global.fetch = jest.fn()` → mocke les appels HTTP
- `global.import_meta_env` → défini dans `jest.setup.js` pour simuler `import.meta.env`

**Tests couverts** :
- ✅ `authAPI.generateToken` : appelle l'endpoint correct avec les bonnes données
- ✅ `authAPI.generateToken` : gère les erreurs de réseau
- ✅ `authAPI.verify` : envoie le token dans le header `Authorization`

**Routes concernées** :
- `POST /api/auth/generate-token` → `authAPI.generateToken`
- `GET /api/auth/verify` → `authAPI.verify`

### 2. Composant PostCard

**Fichier** : `frontend/src/components/__tests__/PostCard.test.jsx`

**Mocks utilisés** :
- Aucun mock externe nécessaire (test de composant React isolé)

**Tests couverts** :
- ✅ Affiche le titre du post
- ✅ Affiche le contenu du post
- ✅ Affiche le badge "Publié" si le post est publié

**Routes concernées** :
- Composant utilisé dans les pages affichant des posts

---

## 🎭 Mocks et Stratégies de Mocking

### Backend - Modules ES (ESM)

**Problème** : Jest avec modules ES nécessite une approche spéciale pour mocker les modules.

**Solution** : Utilisation de `jest.unstable_mockModule()` avant l'import des modules.

**Exemple** :
```javascript
// Créer les mocks manuellement
const mockGetUserProfile = jest.fn();
const mockJwtVerify = jest.fn();

// Mocker AVANT l'import
jest.unstable_mockModule('../../services/user.service.js', () => ({
  __esModule: true,
  getUserProfile: mockGetUserProfile
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  __esModule: true,
  default: { verify: mockJwtVerify },
  verify: mockJwtVerify
}));

// Importer APRÈS avoir mocké
const { authenticateToken } = await import('../auth.middleware.js');
```

### Backend - Supabase

**Fichier mock** : `backend/src/services/__mocks__/supabase.service.js`

```javascript
export const supabase = {
  from: jest.fn()
};

export const supabaseAdmin = {
  from: jest.fn()
};
```

**Utilisation dans les tests** :
```javascript
jest.mock('../supabase.service.js');

// Setup des mocks en chaîne
const mockSingle = jest.fn();
const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
const mockFrom = jest.fn().mockReturnValue({ select: mockSelect });

supabaseAdmin.from = mockFrom;
```

### Frontend - import.meta.env (Vite)

**Problème** : `import.meta.env` n'existe pas dans l'environnement Node.js de Jest.

**Solution** : Mock dans `frontend/jest.setup.js` :
```javascript
if (typeof globalThis.import === 'undefined') {
  globalThis.import = {
    meta: {
      env: {
        VITE_API_URL: process.env.VITE_API_URL || 'http://localhost:3000'
      }
    }
  };
}
```

**Fallback dans le code** : `frontend/src/services/api.js` :
```javascript
const API_URL =
  (typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_API_URL) ||
  process.env.VITE_API_URL ||
  'http://localhost:3000'
```

### Frontend - fetch

**Mock global** : Dans les tests, `global.fetch` est mocké avec `jest.fn()` :
```javascript
global.fetch = jest.fn();

// Utilisation
global.fetch.mockResolvedValue({
  ok: true,
  json: async () => ({ success: true, data: {} })
});
```

---

## 🛣️ Routes Testées

### Routes Backend

#### Authentification (`/api/auth/*`)

| Route | Méthode | Contrôleur | Testé |
|-------|---------|------------|-------|
| `/api/auth/generate-token` | POST | `generateToken` | ✅ |
| `/api/auth/generate-admin-token` | POST | `generateAdminToken` | ✅ |
| `/api/auth/verify` | GET | `verifyToken` | ✅ |
| `/api/auth/me` | GET | `getMe` | ✅ |

#### Middleware

| Middleware | Utilisé par | Testé |
|------------|-------------|-------|
| `authenticateToken` | Toutes les routes protégées | ✅ |
| `requireAdmin` | Routes admin | ✅ |

#### Administration (`/api/admin/*`)

| Route | Méthode | Service | Testé |
|-------|---------|---------|-------|
| `/api/admin/users/:userId/role` | PATCH | `updateUserRole` | ✅ |

### Routes Frontend

| Service | Endpoint | Testé |
|---------|----------|-------|
| `authAPI.generateToken` | `POST /api/auth/generate-token` | ✅ |
| `authAPI.verify` | `GET /api/auth/verify` | ✅ |

---

## 📁 Structure des Fichiers

### Backend

```
backend/
├── jest.config.js                    # Configuration Jest
├── jest.setup.js                     # Setup avant les tests
├── package.json                      # Scripts et dépendances
└── src/
    ├── middleware/
    │   └── __tests__/
    │       └── auth.middleware.test.js
    ├── features/
    │   └── auth/
    │       └── __tests__/
    │           └── auth.controller.test.js
    ├── services/
    │   ├── __mocks__/
    │   │   └── supabase.service.js   # Mock manuel Supabase
    │   └── __tests__/
    │       └── user.service.test.js
    └── config/
        └── __tests__/
            └── constants.test.js
```

### Frontend

```
frontend/
├── jest.config.js                    # Configuration Jest
├── jest.setup.js                     # Setup avant les tests (import.meta.env)
├── babel.config.js                   # Configuration Babel
├── package.json                      # Scripts et dépendances
└── src/
    ├── setupTests.js                 # Setup après les tests (jest-dom)
    ├── components/
    │   └── __tests__/
    │       └── PostCard.test.jsx
    └── services/
        ├── api.js                     # Service API (avec fallback)
        └── __tests__/
            └── api.test.js
```

---

## 🚀 Commandes Disponibles

### Backend

```bash
cd backend

# Lancer tous les tests
npm test

# Lancer les tests en mode watch
npm run test:watch

# Lancer les tests avec coverage
npm run test:coverage
```

### Frontend

```bash
cd frontend

# Lancer tous les tests
npm test

# Lancer les tests en mode watch
npm run test:watch

# Lancer les tests avec coverage
npm run test:coverage
```

---

## ✅ Résultats

### Backend
- **4 fichiers de test** : `auth.middleware.test.js`, `auth.controller.test.js`, `user.service.test.js`, `constants.test.js`
- **36 tests au total** : tous passent ✅
- **Coverage** : configuré pour exclure les fichiers de test

### Frontend
- **2 fichiers de test** : `api.test.js`, `PostCard.test.jsx`
- **3 tests au total** : tous passent ✅
- **Coverage** : configuré pour exclure les fichiers de test et `main.jsx`

---

## 🔧 Problèmes Résolus

### 1. Modules ES avec Jest
**Problème** : `jest.mock()` ne fonctionne pas correctement avec les modules ES.
**Solution** : Utilisation de `jest.unstable_mockModule()` avec import dynamique `await import()`.

### 2. Windows PowerShell et NODE_OPTIONS
**Problème** : `NODE_OPTIONS=--experimental-vm-modules` ne fonctionne pas sur PowerShell.
**Solution** : Utilisation de `cross-env` pour la compatibilité cross-platform.

### 3. import.meta.env dans Jest
**Problème** : `import.meta.env` n'existe pas dans l'environnement Node.js de Jest.
**Solution** : Mock dans `jest.setup.js` + fallback dans le code source.

### 4. Mocks Supabase en chaîne
**Problème** : Les méthodes Supabase sont chaînées (`from().select().eq().single()`).
**Solution** : Création de mocks en chaîne qui retournent les objets suivants.

### 5. Babel et JSX
**Problème** : Jest doit transformer JSX pour React.
**Solution** : Configuration Babel avec `@babel/preset-react` et `babel-jest`.

---

## 📝 Notes Importantes

1. **ES Modules** : Le projet utilise des modules ES (`"type": "module"` dans `package.json`), ce qui nécessite `NODE_OPTIONS=--experimental-vm-modules` et `jest.unstable_mockModule()`.

2. **Mocks avant imports** : Avec les modules ES, les mocks doivent être définis avant l'import des modules testés.

3. **Coverage** : Les fichiers de test sont exclus du coverage pour éviter de fausser les statistiques.

4. **Variables d'environnement** : Les tests utilisent `.env.test` si disponible, sinon `.env`.

5. **Cross-platform** : `cross-env` garantit que les scripts fonctionnent sur Windows, macOS et Linux.

---

## 🎯 Prochaines Étapes Possibles

1. **Tests d'intégration** : Ajouter des tests d'intégration avec Supertest pour tester les routes complètes.
2. **Tests E2E** : Ajouter des tests end-to-end avec Playwright ou Cypress.
3. **Coverage** : Augmenter le coverage en ajoutant plus de tests pour les cas limites.
4. **Tests de composants** : Ajouter plus de tests pour les composants React.
5. **CI/CD** : Intégrer les tests dans un pipeline CI/CD (GitHub Actions, GitLab CI, etc.).

---

*Document généré le : $(date)*
*Dernière mise à jour : Après implémentation complète de Jest*

