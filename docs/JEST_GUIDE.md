# 🧪 Guide Jest - Tests Automatisés

## 📋 Introduction à Jest

**Jest** est un framework de test JavaScript développé par Facebook. C'est l'un des outils de test les plus populaires pour les projets JavaScript/TypeScript, notamment pour React et Node.js.

### Qu'est-ce que Jest ?

Jest est un framework de test "tout-en-un" qui fournit :
- ✅ **Exécuteur de tests** : Lance et organise vos tests
- ✅ **Assertions** : Fonctions pour vérifier vos résultats
- ✅ **Mocks** : Simulation de dépendances
- ✅ **Coverage** : Rapport de couverture de code
- ✅ **Snapshot testing** : Tests de régression visuelle
- ✅ **Watch mode** : Re-exécution automatique des tests

## 🎯 Avantages de Jest

### 1. **Configuration Minimale**

Jest fonctionne "out of the box" avec une configuration minimale. Pas besoin de configurer plusieurs outils séparément.

```javascript
// Jest fonctionne avec juste ça dans package.json
{
  "scripts": {
    "test": "jest"
  }
}
```

### 2. **Syntaxe Simple et Intuitive**

La syntaxe de Jest est claire et facile à comprendre :

```javascript
test('devrait additionner 1 + 2 pour obtenir 3', () => {
  expect(1 + 2).toBe(3);
});
```

### 3. **Mocks Puissants**

Jest permet de mocker facilement les modules, fonctions, et dépendances :

```javascript
// Mocker un module
jest.mock('../services/user.service.js');

// Mocker une fonction
const mockFunction = jest.fn();
```

### 4. **Snapshot Testing**

Permet de tester les composants React et de détecter les changements inattendus :

```javascript
test('le composant correspond au snapshot', () => {
  const component = render(<MyComponent />);
  expect(component).toMatchSnapshot();
});
```

### 5. **Coverage Intégré**

Génère automatiquement des rapports de couverture de code :

```bash
npm test -- --coverage
```

### 6. **Watch Mode**

Mode surveillance qui relance automatiquement les tests lors des modifications :

```bash
npm test -- --watch
```

### 7. **Parallélisation**

Jest exécute les tests en parallèle par défaut, ce qui accélère l'exécution.

### 8. **Ecosystème Riche**

- Support natif pour ES6+ modules
- Support TypeScript
- Intégration avec React Testing Library
- Plugins pour de nombreux frameworks

### 9. **Documentation Excellente**

Jest a une documentation complète et une grande communauté.

### 10. **CI/CD Ready**

Facilement intégré dans les pipelines CI/CD (GitHub Actions, GitLab CI, etc.).

## 🚀 Installation dans le Projet

### Backend (Express)

#### 1. Installer Jest et les dépendances

```bash
cd backend
npm install --save-dev jest @jest/globals
```

Pour les tests d'API Express, ajoutez aussi :

```bash
npm install --save-dev supertest
```

#### 2. Configuration Jest

Créez un fichier `backend/jest.config.js` :

```javascript
export default {
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: ['.js'],
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html']
};
```

#### 3. Ajouter les scripts dans `package.json`

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Frontend (React + Vite)

#### 1. Installer Jest et les dépendances

```bash
cd frontend
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

#### 2. Configuration Jest pour Vite

Créez un fichier `frontend/jest.config.js` :

```javascript
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/main.jsx'
  ]
};
```

#### 3. Fichier de configuration Babel

Créez `frontend/babel.config.js` :

```javascript
export default {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }]
  ]
};
```

#### 4. Fichier de setup

Créez `frontend/src/setupTests.js` :

```javascript
import '@testing-library/jest-dom';
```

## 📝 Exemples de Tests pour le Projet

### Tests Backend

#### 1. Test du Middleware d'Authentification

Créez `backend/src/middleware/__tests__/auth.middleware.test.js` :

```javascript
import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { authenticateToken } from '../auth.middleware.js';
import { getUserProfile } from '../../services/user.service.js';
import jwt from 'jsonwebtoken';

// Mocker les dépendances
jest.mock('../../services/user.service.js');
jest.mock('jsonwebtoken');

describe('authenticateToken Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    process.env.JWT_SECRET = 'test-secret';
  });

  test('devrait retourner 401 si aucun token fourni', async () => {
    req.headers.authorization = undefined;

    await authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Token d\'authentification requis',
      message: 'Veuillez fournir un token dans le header Authorization: Bearer <token>',
      code: 'AUTH_TOKEN_MISSING'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('devrait appeler next() si le token est valide', async () => {
    const mockToken = 'valid-token';
    const mockDecoded = {
      sub: 'user-123',
      email: 'test@example.com',
      iat: 1234567890,
      exp: 1234654290,
      aud: 'authenticated'
    };
    const mockProfile = {
      id: 'user-123',
      email: 'test@example.com',
      role: 'user'
    };

    req.headers.authorization = `Bearer ${mockToken}`;
    jwt.verify.mockReturnValue(mockDecoded);
    getUserProfile.mockResolvedValue(mockProfile);

    await authenticateToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test-secret');
    expect(getUserProfile).toHaveBeenCalledWith('user-123');
    expect(req.user).toEqual({
      sub: 'user-123',
      email: 'test@example.com',
      role: 'user',
      iat: 1234567890,
      exp: 1234654290,
      aud: 'authenticated'
    });
    expect(next).toHaveBeenCalled();
  });

  test('devrait retourner 401 si le token est expiré', async () => {
    const mockToken = 'expired-token';
    req.headers.authorization = `Bearer ${mockToken}`;

    const error = new Error('Token expired');
    error.name = 'TokenExpiredError';
    jwt.verify.mockImplementation(() => {
      throw error;
    });

    await authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Token expiré',
      message: 'Votre session a expiré, veuillez vous reconnecter',
      code: 'AUTH_TOKEN_EXPIRED'
    });
    expect(next).not.toHaveBeenCalled();
  });
});
```

#### 2. Test du Contrôleur d'Authentification

Créez `backend/src/features/auth/__tests__/auth.controller.test.js` :

```javascript
import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { generateToken } from '../auth.controller.js';
import { createOrUpdateUserProfile } from '../../../services/user.service.js';
import jwt from 'jsonwebtoken';

jest.mock('../../../services/user.service.js');
jest.mock('jsonwebtoken');

describe('generateToken', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        userId: 'test-user-123',
        email: 'test@example.com',
        role: 'user'
      }
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    process.env.JWT_SECRET = 'test-secret';
    jwt.sign.mockReturnValue('mock-jwt-token');
    createOrUpdateUserProfile.mockResolvedValue({
      id: 'test-user-123',
      email: 'test@example.com',
      role: 'user'
    });
  });

  test('devrait générer un token et créer un profil utilisateur', async () => {
    await generateToken(req, res);

    expect(createOrUpdateUserProfile).toHaveBeenCalledWith(
      'test-user-123',
      'test@example.com',
      'user'
    );
    expect(jwt.sign).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      access_token: 'mock-jwt-token',
      token_type: 'Bearer',
      expires_in: expect.any(Number),
      expires_at: expect.any(String),
      user: {
        id: 'test-user-123',
        email: 'test@example.com',
        role: 'user'
      }
    });
  });

  test('devrait retourner une erreur si le rôle est invalide', async () => {
    req.body.role = 'invalid-role';

    await generateToken(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Rôle invalide',
      message: expect.stringContaining('Le rôle doit être'),
      code: 'INVALID_ROLE',
      allowedRoles: expect.any(Array)
    });
  });
});
```

#### 3. Test du Service Utilisateur

Créez `backend/src/services/__tests__/user.service.test.js` :

```javascript
import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { getUserProfile, createOrUpdateUserProfile } from '../user.service.js';
import { supabaseAdmin } from '../supabase.service.js';

jest.mock('../supabase.service.js');

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserProfile', () => {
    test('devrait récupérer le profil utilisateur', async () => {
      const mockProfile = {
        user_id: 'user-123',
        email: 'test@example.com',
        role: 'user'
      };

      supabaseAdmin.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockProfile,
          error: null
        })
      });

      const result = await getUserProfile('user-123');

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        role: 'user'
      });
    });

    test('devrait retourner null si le profil n\'existe pas', async () => {
      supabaseAdmin.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' }
        })
      });

      const result = await getUserProfile('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('createOrUpdateUserProfile', () => {
    test('devrait créer un nouveau profil utilisateur', async () => {
      const mockProfile = {
        user_id: 'user-123',
        email: 'test@example.com',
        role: 'user'
      };

      supabaseAdmin.from.mockReturnValue({
        upsert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockProfile,
          error: null
        })
      });

      const result = await createOrUpdateUserProfile(
        'user-123',
        'test@example.com',
        'user'
      );

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        role: 'user'
      });
    });
  });
});
```

#### 4. Test d'Intégration API avec Supertest

Créez `backend/src/__tests__/api/auth.integration.test.js` :

```javascript
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../index.js'; // Votre app Express

describe('Auth API Integration Tests', () => {
  let authToken;

  test('POST /api/auth/generate-token devrait générer un token', async () => {
    const response = await request(app)
      .post('/api/auth/generate-token')
      .send({
        userId: 'test-user-123',
        email: 'test@example.com',
        role: 'user'
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.access_token).toBeDefined();
    expect(response.body.user).toEqual({
      id: 'test-user-123',
      email: 'test@example.com',
      role: 'user'
    });

    authToken = response.body.access_token;
  });

  test('GET /api/auth/me devrait retourner les infos utilisateur', async () => {
    // Générer d'abord un token
    const tokenResponse = await request(app)
      .post('/api/auth/generate-token')
      .send({
        userId: 'test-user-123',
        email: 'test@example.com',
        role: 'user'
      });

    const token = tokenResponse.body.access_token;

    // Utiliser le token pour accéder à /api/auth/me
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.user.id).toBe('test-user-123');
    expect(response.body.user.email).toBe('test@example.com');
  });

  test('GET /api/auth/me devrait retourner 401 sans token', async () => {
    await request(app)
      .get('/api/auth/me')
      .expect(401);
  });
});
```

### Tests Frontend

#### 1. Test d'un Composant React

Créez `frontend/src/components/__tests__/PostCard.test.jsx` :

```javascript
import { describe, test, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import PostCard from '../PostCard';

describe('PostCard Component', () => {
  const mockPost = {
    id: 'post-123',
    title: 'Test Post',
    content: 'This is a test post',
    is_published: true,
    created_at: '2024-01-15T10:00:00Z'
  };

  test('devrait afficher le titre du post', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('Test Post')).toBeInTheDocument();
  });

  test('devrait afficher le contenu du post', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('This is a test post')).toBeInTheDocument();
  });

  test('devrait afficher un badge "Publié" si le post est publié', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText(/publié/i)).toBeInTheDocument();
  });
});
```

#### 2. Test du Context d'Authentification

Créez `frontend/src/contexts/__tests__/AuthContext.test.jsx` :

```javascript
import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { authAPI } from '../../services/api';

jest.mock('../../services/api');

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('devrait initialiser sans utilisateur si aucun token', () => {
    const TestComponent = () => {
      const { user, token } = useAuth();
      return (
        <div>
          <div data-testid="user">{user ? user.email : 'no user'}</div>
          <div data-testid="token">{token || 'no token'}</div>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('no user');
    expect(screen.getByTestId('token')).toHaveTextContent('no token');
  });

  test('devrait se connecter et sauvegarder le token', async () => {
    const mockResponse = {
      success: true,
      access_token: 'mock-token',
      user: {
        id: 'user-123',
        email: 'test@example.com',
        role: 'user'
      }
    };

    authAPI.generateToken.mockResolvedValue(mockResponse);

    const TestComponent = () => {
      const { login, user, token } = useAuth();

      return (
        <div>
          <button onClick={() => login({ email: 'test@example.com' })}>
            Login
          </button>
          <div data-testid="user">{user?.email || 'no user'}</div>
          <div data-testid="token">{token || 'no token'}</div>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    loginButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
      expect(screen.getByTestId('token')).toHaveTextContent('mock-token');
    });

    expect(localStorage.getItem('authToken')).toBe('mock-token');
  });
});
```

#### 3. Test d'un Hook Personnalisé

Créez `frontend/src/hooks/__tests__/usePermissions.test.js` :

```javascript
import { describe, test, expect } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { usePermissions } from '../usePermissions';
import { AuthProvider } from '../../contexts/AuthContext';

describe('usePermissions Hook', () => {
  const wrapper = ({ children }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  test('devrait retourner false pour un utilisateur non authentifié', () => {
    const { result } = renderHook(() => usePermissions(), { wrapper });
    
    expect(result.current.canCreatePost).toBe(false);
    expect(result.current.canModerate).toBe(false);
  });

  test('devrait retourner les bonnes permissions pour un user', () => {
    // Mock du contexte avec un user
    // ... (implémentation dépend de votre structure)
  });
});
```

## 🎯 Structure Recommandée des Tests

```
backend/
├── src/
│   ├── __tests__/           # Tests d'intégration
│   │   └── api/
│   ├── features/
│   │   └── auth/
│   │       ├── __tests__/   # Tests unitaires du contrôleur
│   │       └── auth.controller.js
│   ├── middleware/
│   │   └── __tests__/        # Tests des middlewares
│   └── services/
│       └── __tests__/       # Tests des services
└── coverage/                 # Rapports de couverture

frontend/
├── src/
│   ├── __tests__/           # Tests d'intégration
│   ├── components/
│   │   └── __tests__/       # Tests des composants
│   ├── contexts/
│   │   └── __tests__/       # Tests des contexts
│   └── hooks/
│       └── __tests__/       # Tests des hooks
└── coverage/                 # Rapports de couverture
```

## 📊 Commandes Utiles

### Backend

```bash
# Lancer tous les tests
npm test

# Mode watch (relance automatique)
npm run test:watch

# Avec couverture
npm run test:coverage

# Un fichier spécifique
npm test auth.middleware.test.js

# Tests correspondant à un pattern
npm test -- auth
```

### Frontend

```bash
# Lancer tous les tests
npm test

# Mode watch
npm test -- --watch

# Avec couverture
npm test -- --coverage

# Mode verbose
npm test -- --verbose
```

## 🔧 Configuration Avancée

### Variables d'Environnement pour les Tests

Créez `backend/.env.test` :

```env
JWT_SECRET=test-secret-key
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=test-anon-key
SUPABASE_SERVICE_ROLE_KEY=test-service-role-key
NODE_ENV=test
```

Modifiez `jest.config.js` pour charger ces variables :

```javascript
export default {
  // ... autres configs
  setupFiles: ['<rootDir>/jest.setup.js']
};
```

Créez `backend/jest.setup.js` :

```javascript
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env.test') });
```

## 🎨 Bonnes Pratiques

### 1. Nommer les Tests de Manière Descriptive

```javascript
// ❌ Mauvais
test('test 1', () => { ... });

// ✅ Bon
test('devrait retourner 401 si le token est manquant', () => { ... });
```

### 2. Utiliser describe() pour Grouper les Tests

```javascript
describe('authenticateToken Middleware', () => {
  describe('quand le token est valide', () => {
    test('devrait appeler next()', () => { ... });
  });

  describe('quand le token est invalide', () => {
    test('devrait retourner 401', () => { ... });
  });
});
```

### 3. Isoler les Tests

Chaque test doit être indépendant :

```javascript
beforeEach(() => {
  // Réinitialiser l'état avant chaque test
  jest.clearAllMocks();
});
```

### 4. Tester les Cas d'Erreur

```javascript
test('devrait gérer les erreurs de base de données', async () => {
  getUserProfile.mockRejectedValue(new Error('DB Error'));
  // ... tester la gestion d'erreur
});
```

### 5. Utiliser des Mocks Appropriés

```javascript
// Mocker seulement ce qui est nécessaire
jest.mock('../services/user.service.js');
// Ne pas mocker tout le système
```

## 📈 Métriques de Couverture

Jest génère des rapports de couverture détaillés :

- **Statements** : Pourcentage de lignes exécutées
- **Branches** : Pourcentage de branches testées (if/else)
- **Functions** : Pourcentage de fonctions appelées
- **Lines** : Pourcentage de lignes couvertes

Objectif recommandé : **80% de couverture minimum**

## 🚀 Intégration CI/CD

### GitHub Actions

Créez `.github/workflows/test.yml` :

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd backend && npm ci
          cd ../frontend && npm ci
      
      - name: Run backend tests
        run: |
          cd backend
          npm test -- --coverage
      
      - name: Run frontend tests
        run: |
          cd frontend
          npm test -- --coverage --watchAll=false
```

## 🎯 Résumé des Avantages

1. ✅ **Configuration minimale** - Fonctionne out of the box
2. ✅ **Syntaxe simple** - Facile à apprendre
3. ✅ **Mocks puissants** - Simulation facile des dépendances
4. ✅ **Coverage intégré** - Rapports automatiques
5. ✅ **Watch mode** - Développement rapide
6. ✅ **Parallélisation** - Tests rapides
7. ✅ **Ecosystème riche** - Support pour React, Node, etc.
8. ✅ **Documentation excellente** - Beaucoup de ressources
9. ✅ **CI/CD ready** - Intégration facile
10. ✅ **Snapshot testing** - Tests de régression visuelle

## 📚 Ressources

- [Documentation officielle Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Jest Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

**Prochaine étape** : Commencez par tester les middlewares et contrôleurs les plus critiques, puis étendez progressivement la couverture de tests.

