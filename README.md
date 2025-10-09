# Ynov Express + Supabase + Postman + Front (Vite/Tailwind)

Projet Node/Express connecté à Supabase avec un jeu de routes REST, une collection Postman exécutable en un clic, un schéma SQL de démo et un front minimal type blog (style sobre façon X/Twitter).

## Sommaire
- Installation & Lancement
- Configuration Supabase (.env + schéma demo)
- API: routes disponibles (posts, comments, likes, admin)
- Fichiers Postman (collection + environnements) et workflow
- Frontend (Vite + React + Tailwind)
- Sécurité/RLS et variantes de schéma
- Évolutions futures proposées

---

## Installation & Lancement
1) Dépendances backend (racine du projet):
```bash
npm install
npm start
```
- Santé: GET http://localhost:3000/health → 200

2) Dépendances frontend (client/):
```bash
cd client
npm install
npm run dev
```
- Le proxy Vite redirige `/api` et `/health` vers `http://localhost:3000`.

3) Variables d’environnement (.env à la racine):
```
SUPABASE_URL=https://<YOUR_PROJECT>.supabase.co
SUPABASE_ANON_KEY=<YOUR_ANON_KEY>
```
- Le chargement est assuré par `dotenv` dans `supabaseClient.js`.

---

## Configuration Supabase (schéma demo)
Deux scripts SQL sont fournis dans `supabase/`:
- `demo_schema.sql`: tables dédiées de démonstration `demo_posts`, `demo_comments`, `demo_likes` en UUID, avec RLS permissif (usage pédagogique).
- `schema.sql`: variante générique (si vous ne souhaitez pas utiliser le préfixe demo_). Dans ce projet, l’API utilise par défaut le schéma `demo_*` pour ne pas interférer avec vos tables existantes.

Étapes:
- Ouvrez le SQL Editor de votre projet Supabase et exécutez `supabase/demo_schema.sql`.
- Assurez-vous que votre `.env` contient la bonne URL/clé anon, puis redémarrez l’API.

---

## API: routes disponibles
Les routes sont exposées sous `/api` et opérent sur les tables `demo_*`.

Fichier `api/posts.js` (ressource posts + commentaires + likes):
- Posts
  - GET `/api/posts?is_published=true&q=...` : liste avec filtre publication et recherche par titre (≥2 caractères)
  - GET `/api/posts/:id` : détail
  - POST `/api/posts` : création (title, content)
  - PATCH `/api/posts/:id` : mise à jour (title?, content?)
  - PATCH `/api/posts/:id/publish` : publier (renseigne `published_at`)
  - DELETE `/api/posts/:id` : suppression (gère la cascade applicative: supprime d’abord `demo_likes` puis `demo_comments`)
- Comments
  - GET `/api/posts/:id/comments` : lister commentaires du post
  - POST `/api/posts/:id/comments` : créer un commentaire (`content` requis, 2..280)
  - DELETE `/api/posts/:postId/comments/:commentId` : supprimer un commentaire du post
- Likes
  - GET `/api/posts/:id/likes` : lister les likes du post (retourne les ids de likes)
  - GET `/api/posts/:id/likes-count` : compter les likes
  - POST `/api/posts/:id/likes` : ajouter un like (retourne `id`)
  - DELETE `/api/posts/:postId/likes/:likeId` : supprimer un like

Fichier `api/admin.js` (maintenance/jeux de données + diagnostic):
- GET `/api/admin/health` : ping simple
- GET `/api/admin/diagnostics` : vérifie la connexion Supabase (sélectionne 1 id dans `demo_posts`)
- POST `/api/admin/reset` : nettoyage des tables `demo_likes` → `demo_comments` → `demo_posts` (DELETE avec WHERE obligatoire)
- POST `/api/admin/seed` : insère 2 posts de démonstration + commentaires/likes
- POST `/api/admin/generate` : génère N posts (1..20) avec commentaires et likes automatiques (corps: `{ count: number }`)

Fichier `index.js`:
- Monte Express, JSON parser, CORS, routes `/api`, et `GET /health`.

Fichier `supabaseClient.js`:
- Initialise le client Supabase via `SUPABASE_URL` et `SUPABASE_ANON_KEY`.

---

## Postman: collection, environnements et workflow
Dossier `postman/`:
- `ynov-express.postman_collection.json` : toutes les requêtes (health, diagnostics, reset, seed, generate, posts CRUD, search, comments CRUD, likes CRUD, publish, likes-count).
- `local.postman_environment.json` : environnement local (`baseUrl=http://localhost:3000`).
- `cloud.postman_environment.json` : exemple d’environnement distant (à adapter).
- `.postman_instructions.md` : guide rapide.

Workflow conseillé (Runner):
1. Diagnostics → Admin Reset → Admin Seed (ou Admin Generate)
2. List Posts (capture `postId`) → Get Post by Id
3. Create Comment (capture `commentId`) → List Likes (capture `likeId`)
4. Add Like → Likes Count → Search
5. Delete Like → Delete Comment → Delete Post

Les requêtes de création renvoient les `id` pour faciliter l’enchaînement.

---

## Frontend (client/)
- Pile: Vite + React 18 + Tailwind 3 (style sobre type X/Twitter).
- `vite.config.js` : proxy `/api` et `/health` vers `http://localhost:3000`.
- Écran principal (`src/App.jsx`):
  - Liste des posts (recherche par titre, filtre « publiés », refresh)
  - Formulaire de création (titre, contenu)
  - Sur chaque post: Like, Publier (si brouillon), Détails (affiche/ajoute/supprime commentaires), Supprimer le post

Lancement:
```bash
# backend (racine)
npm start
# frontend (client/)
cd client && npm run dev
```

---

## Sécurité / RLS
- Le schéma `demo_*` active RLS avec policies « permissives » pour faciliter les démos clés anon. Pour un usage production, il est recommandé de restreindre les policies (liaison à `auth.uid()`, rôles, etc.).
- Si vous utilisez déjà un modèle riche (profils, catégories, tags, etc.), gardez ce schéma séparé. L’API actuelle pointe explicitement sur `demo_*` pour éviter tout conflit.

---

## Évolutions futures (proposées)
- Frontend
  - Tri et filtres avancés (plus likés, plus récents, par période)
  - Page dédiée « détail post » avec URL (routing) et chargement SSR/SPA
  - Édition complète du post (titre/contenu) et brouillon auto-save
  - Compteur en temps réel (subscriptions) pour likes/commentaires
  - Authentification (login) + attribution auteur sur posts/comments
  - Thème sombre/clair (déjà sombre par défaut), composants UI
- Backend
  - Validation avancée, pagination, tri côté API
  - Webhooks/Events (publication, suppression) et audit
  - Tests automatisés (supertest) et lint CI
- Supabase
  - Policies RLS plus strictes, séparation lecture/écriture
  - Indices supplémentaires (recherche textuelle/`GIN` sur content jsonb)

---

## GitHub
- Dépôt: `https://github.com/SamymaS/TPwebservices` (vide au départ).
- Commandes utiles:
```bash
git init
git add .
git commit -m "Initial commit: API Express + Supabase + Postman + Front Vite"
git branch -M main
git remote add origin https://github.com/SamymaS/TPwebservices.git
git push -u origin main
```
- `.gitignore` exclut `.env`, `node_modules/`, `client/dist/`.

---

## Support rapide
- Invalid API key: vérifier `.env` et redémarrer l’API
- Tables manquantes: réexécuter `supabase/demo_schema.sql`
- Supprimer échoue (FK): la cascade est gérée applicativement; utilisez les routes `/api` fournies (qui ciblent `demo_*`).

Bon dev !
