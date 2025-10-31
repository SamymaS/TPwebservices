## Ynov Express — Récapitulatif Fonctionnalités, Sécurité et JWT

### 1) Vue d'ensemble
Application full‑stack (Express + React) avec authentification JWT et contrôle d'accès RBAC à 5 rôles. Données stockées sur Supabase (PostgreSQL). Sécurité en profondeur via: JWT signé, CORS restrictif, RBAC middleware + vérifications contrôleur, validation d’entrée, messages d’erreurs standardisés, variables d’environnement pour secrets.

---

### 2) Fonctionnalités

- Backend (Express)
  - Auth JWT (génération, vérification, refresh, logout, reset password via Supabase Auth)
  - RBAC strict (permissions granulaires; différenciation own vs any)
  - API Posts: liste, détail, création, édition, suppression, publication
  - API Comments: liste par post, création, suppression
  - API Likes: liste par post, compteur, ajout, suppression
  - Admin: health, reset, seed, generate, diagnostics
  - CORS configuré par environnement, gestion erreurs globale, validation basique

- Frontend (React + Vite)
  - AuthContext: stockage/token, auto‑vérification et rafraîchissement
  - UI conditionnelle par permissions (boutons masqués si non autorisé)
  - Pages: Auth, Home, Admin, Profil, Reset/Forgot Password
  - Gestion posts (CRUD), commentaires, likes, publication (modérateur+)

---

### 3) Système de rôles (RBAC)

- Hiérarchie: guest < user < moderator < admin < super_admin (héritage implicite)
- Exemples de permissions:
  - guest: posts:read, comments:read, likes:read
  - user: + posts:create, posts:update:own, posts:delete:own, comments:create, comments:delete:own, likes:create, likes:delete:own
  - moderator: + posts:update:any, posts:delete:any, posts:publish:any, comments:delete:any, likes:delete:any
  - admin: posts:*, comments:*, likes:*, admin:seed, admin:generate, admin:diagnostics
  - super_admin: *

Points clés:
- Vérification côté middleware: `requirePermission('ressource:action')`, `requireRole('moderator')`, etc.
- Vérification côté contrôleur: ownership via `user_id` et helpers `canModifyResource` pour gérer own vs any.

---

### 4) API — Routes principales

Base: `/api`

- Auth
  - POST `/auth/generate-token` (DEV): génère un JWT (role paramétrable)
  - POST `/auth/generate-admin-token` (DEV)
  - GET `/auth/verify`: vérifie validité + claims + TTL restant
  - GET `/auth/me`: infos utilisateur courant (protégé)
  - POST `/auth/refresh`: renouvelle un token (protégé)
  - POST `/auth/logout`: invalide côté client (message informatif)
  - POST `/auth/forgot-password`: envoi lien reset via Supabase Auth
  - POST `/auth/reset-password`: réinitialise avec token

- Posts
  - GET `/posts` (public + auth optionnelle): liste (q, is_published)
  - GET `/posts/:id` (public)
  - POST `/posts` (protégé + `posts:create`)
  - PATCH `/posts/:id` (protégé; contrôleur vérifie own vs any)
  - PATCH `/posts/:id/publish` (protégé + rôle minimum moderator)
  - DELETE `/posts/:id` (protégé; contrôleur vérifie own vs any)

- Comments
  - GET `/posts/:id/comments` (public)
  - POST `/posts/:id/comments` (protégé + `comments:create`)
  - DELETE `/posts/:postId/comments/:id` (protégé; own vs any)

- Likes
  - GET `/posts/:id/likes` (public)
  - GET `/posts/:id/likes-count` (public)
  - POST `/posts/:id/likes` (protégé + `likes:create`)
  - DELETE `/posts/:postId/likes/:id` (protégé; own vs any)

- Admin (protégé + rôle admin)
  - GET `/admin/health`
  - POST `/admin/reset`
  - POST `/admin/seed`
  - POST `/admin/generate` (1..20)
  - GET `/admin/diagnostics`

---

### 5) Sécurité

- Authentification
  - JWT signé avec `JWT_SECRET` (env), expiration 24h, audience `authenticated`
  - Middleware `authenticateToken` (401/403 sur token manquant/expiré/invalide)
  - `optionalAuth` pour routes publiques qui tolèrent l’absence de token

- Autorisation (RBAC)
  - Middlewares: `requirePermission`, `requireRole`, `requireAnyRole`
  - Contrôleurs: contrôle d’ownership via `user_id` pour update/delete; modérateur+ via `:any`
  - Wildcards gérés: `ressource:*`, `*`

- CORS
  - Origines autorisées selon env + `ALLOWED_ORIGINS`
  - Méthodes/headers explicitement listés; maxAge 24h; credentials true

- Base de données (Supabase)
  - Deux clients: `supabase` (ANON, respecte RLS), `supabaseAdmin` (SERVICE_ROLE, admin)
  - `supabaseAdmin` utilisé exclusivement en routes admin protégées
  - Traçage ownership: insertion `user_id` sur posts/comments/likes

- Validation & erreurs
  - Longueurs (commentaires 2..280), bornes (generate 1..20), rôle valide
  - Gestion d’erreurs globale + codes homogènes (`AUTH_REQUIRED`, `PERMISSION_DENIED`, ...)

- Secrets & env
  - Vérification des variables requises au boot; jamais committées

Recommandations d’usage (client):
- Stocker le token en mémoire si possible; si `localStorage`, éviter XSS (CSP, sanitization). Pas de cookies non nécessaires.
- Toujours envoyer `Authorization: Bearer <token>`.

---

### 6) JWT — Explication détaillée

Structure d’un JWT:
- Header: `{ alg: 'HS256', typ: 'JWT' }`
- Payload (claims):
  - `sub`: identifiant utilisateur
  - `email`: email utilisateur
  - `role`: rôle RBAC (`guest|user|moderator|admin|super_admin`)
  - `aud`: audience (ici `authenticated`)
  - `iat`: émis à (epoch secondes)
  - `exp`: expiration (iat + 24h)
- Signature: HMAC SHA‑256 du header+payload avec `JWT_SECRET`

Cycle de vie dans le projet:
1) Génération (DEV): `/auth/generate-token` crée un JWT signé (24h)
2) Vérification: middleware valide la signature + `exp`; attache `req.user`
3) Accès: middlewares RBAC lisent `req.user.role` pour autoriser/refuser
4) Rafraîchissement: `/auth/refresh` ré‑émet un token 24h à partir de l’instant
5) Déconnexion: côté client (suppression du token)

Bonnes pratiques appliquées:
- Expiration fixe courte (24h)
- Vérifications explicites (401 si expiré, 403 si invalide)
- Aucun secret dans le payload (claims non sensibles)
- Audience contrôlée (`aud`)

Bonnes pratiques recommandées (optionnelles à implémenter si besoin prod):
- Rotation de tokens + refresh tokens dédiés côté serveur (liste d’allow/deny)
- Invalidation serveur (revocation list) pour sessions critiques
- Réduction fenêtre d’attaque: durées plus courtes, PCKE/OAuth si nécessaire
- Renforcement XSS/CSP pour protéger `localStorage`

Exemples cURL:
```bash
# Générer un token de rôle user (DEV)
curl -s -X POST "$API/auth/generate-token" \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","role":"user"}'

# Vérifier un token
curl -s -X GET "$API/auth/verify" \
  -H "Authorization: Bearer $TOKEN"

# Rafraîchir un token
curl -s -X POST "$API/auth/refresh" \
  -H "Authorization: Bearer $TOKEN"
```

---

### 7) Flux d’autorisations — exemples

- Créer un post
  - Exige: authentifié + `posts:create`
  - Si ok: insertion avec `user_id = req.user.userId`, `is_published=false`

- Éditer un post
  - Exige: authentifié
  - Contrôleur: autorisé si (owner ET `posts:update:own`) OU (`posts:update:any`)

- Publier un post
  - Exige: `requireRole('moderator')` (moderator+)

- Supprimer un commentaire
  - Exige: authentifié
  - Contrôleur: owner + `comments:delete:own` OU `comments:delete:any`

---

### 8) Frontend — utilisation du token & permissions

- `AuthContext`
  - Stocke `authToken` (localStorage), vérifie au chargement (`/auth/verify`)
  - Expose `user`, `token`, `login`, `logout`, `refreshUser`

- `usePermissions`
  - Mappe les permissions par rôle (synchronisées avec backend)
  - Helpers: `canCreate`, `canUpdateOwn`, `canUpdateAny`, `canDeleteOwn`, `canDeleteAny`, `canPublish`, `isAdmin`, `isModerator`
  - UI: affiche/masque boutons en fonction des permissions et de l’ownership

---

### 9) Dépannage rapide

- 401/403: vérifier token, expiration, rôle et permissions requises
- CORS: renseigner `ALLOWED_ORIGINS` en prod; vérifier `VITE_API_URL`
- Variables d’env manquantes: compléter `.env` backend et frontend

---

### 10) Références utiles

- Rôles & permissions: `backend/src/config/constants.js`
- Middlewares: `backend/src/middleware/*.js`
- Auth: `backend/src/features/auth/*`
- Posts/Comments/Likes: `backend/src/features/posts/*`
- CORS: `backend/src/config/cors.config.js`
- Supabase clients: `backend/src/services/supabase.service.js`
- Frontend API client: `frontend/src/services/api.js`
- Contexte Auth: `frontend/src/contexts/AuthContext.jsx`
- Hook permissions: `frontend/src/hooks/usePermissions.js`
