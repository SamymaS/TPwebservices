# ✅ État des Tests – Backend & Frontend

## Backend

- **Outils** : Ajout de Jest (`jest.config.js`, `jest.setup.js`, scripts `npm test`, `test:watch`, `test:coverage` via `cross-env`).
- **Mocks ES Modules** : utilisation de `jest.unstable_mockModule` pour `jsonwebtoken` et `user.service` avant l’import des modules testés.
- **Supabase mocké** : `src/services/__mocks__/supabase.service.js` pour simuler `supabaseAdmin.from(...)`.
- **Tests écrits** :
  - `auth.middleware.test.js` : token manquant, format invalide, token valide/expiré/invalidé, création auto de profil, middleware admin.
  - `auth.controller.test.js` : génération de token, vérification (valides/invalides), `getMe`.
  - `user.service.test.js` : `getUserProfile`, `createOrUpdateUserProfile`, `updateUserRole` (mocks en chaîne sur `from().select().eq().single()`).
  - `constants.test.js` : rôles/permissions/codes HTTP.
- **Résultat** : `npm test` (backend) passe intégralement.

## Frontend

- **Outils** : configuration Jest + Testing Library (`jest.config.js`, `babel.config.js`, `src/setupTests.js`, `jest.setup.js`, scripts `npm test`, etc.).
- **Variables d’environnement** : `import.meta.env` mocké dans `jest.setup.js` + fallback `process.env.VITE_API_URL` côté `src/services/api.js`.
- **Tests écrits** :
  - `PostCard.test.jsx` : titre, contenu, badge publié.
  - `api.test.js` : mock `fetch`, tests `authAPI.generateToken`, `authAPI.verify` (vérification du header `Authorization`).
- **Résultat** : `npm test` (frontend) passe après ajustement des assertions sur `fetch`.

## En résumé

- Tests Jest opérationnels sur les deux stacks, avec mocks adaptés aux modules ES.
- Supabase simulé pour les tests backend.
- Frontend vérifie les composants et les appels API.
- Commandes : `cd backend && npm test`, `cd frontend && npm test`.

