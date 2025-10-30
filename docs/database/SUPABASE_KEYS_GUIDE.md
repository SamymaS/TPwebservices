# Guide des clés Supabase - ANON vs SERVICE_ROLE

## 🔑 Différence entre les clés

### SUPABASE_ANON_KEY (Clé publique)
- ✅ **Peut être exposée** côté client (frontend)
- 🔒 Respecte les règles **Row Level Security (RLS)**
- 👥 Utilisée pour les requêtes des utilisateurs
- ⚡ Permissions limitées par les policies RLS

### SUPABASE_SERVICE_ROLE_KEY (Clé privée)
- ⚠️ **NE JAMAIS exposer** côté client
- 🔓 **Contourne les règles RLS**
- 👑 Accès administrateur complet
- 💥 Peut tout lire, écrire, supprimer
- 🛡️ À utiliser **UNIQUEMENT** côté serveur

## 📝 Configuration dans .env

Votre fichier `.env` doit contenir les trois clés :

```env
# Supabase Configuration
SUPABASE_URL=https://qdxezzqkxjpqzwuyrhfu.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT Secret (pour l'authentification)
JWT_SECRET=tSSAabPP1LPZISaDqHHxk8AgMWZAdspUbOeVMnkMSeBfQWzGC22JhiiAwlGvfWwgLUMoGPWNnO/yZyQb8KOQkA==
```

## 🎯 Quand utiliser quelle clé ?

### Utilisez ANON_KEY pour :
- ✅ Routes publiques (GET posts, comments, etc.)
- ✅ Routes utilisateur authentifiées (créer son post, etc.)
- ✅ Toute opération qui doit respecter les permissions RLS

### Utilisez SERVICE_ROLE_KEY pour :
- 🔧 Opérations administratives (reset, seed, generate)
- 🗑️ Suppressions en masse (ignorer RLS)
- 📊 Analytics et rapports (accès complet aux données)
- 🔄 Migrations et scripts de maintenance

## ⚠️ SÉCURITÉ IMPORTANTE

### ❌ NE JAMAIS FAIRE :
```javascript
// ❌ DANGER : N'exposez JAMAIS la service_role key au frontend
const supabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY);
// Cette clé NE DOIT JAMAIS être dans le code client !
```

### ✅ BONNE PRATIQUE :
```javascript
// ✅ OK : Utilisée UNIQUEMENT dans le backend Node.js
// Les routes admin sont protégées par JWT
import { supabaseAdmin } from './supabaseClient.js';

router.post('/admin/dangerous-operation', authenticateToken, async (req, res) => {
  // Double protection : JWT + Service Role
  const { data } = await supabaseAdmin.from('table').delete().neq('id', 0);
  res.json(data);
});
```

## 📍 Où trouver vos clés Supabase ?

1. Allez sur [https://supabase.com](https://supabase.com)
2. Sélectionnez votre projet
3. Cliquez sur **⚙️ Settings** (en bas à gauche)
4. Cliquez sur **API**
5. Dans la section **Project API keys** :
   - `anon` `public` → C'est votre **SUPABASE_ANON_KEY**
   - `service_role` `secret` → C'est votre **SUPABASE_SERVICE_ROLE_KEY**

## 🔒 Protection supplémentaire

Pour les routes admin utilisant la service_role key :

1. **Toujours** protéger avec JWT (`authenticateToken`)
2. **Optionnellement** ajouter une vérification de rôle :
   ```javascript
   if (req.user.role !== 'admin') {
     return res.status(403).json({ error: 'Admin access required' });
   }
   ```

## 🔄 Architecture recommandée

```
supabaseClient.js
├── supabase (ANON_KEY)        → Pour routes publiques et utilisateurs
└── supabaseAdmin (SERVICE_ROLE) → Pour routes admin uniquement
```

## 📚 Exemple d'utilisation

### Routes utilisateur (ANON_KEY)
```javascript
// api/posts.js
import { supabase } from '../supabaseClient.js';

router.get('/posts', async (req, res) => {
  // Respecte les RLS policies
  const { data } = await supabase.from('demo_posts').select('*');
  res.json(data);
});
```

### Routes admin (SERVICE_ROLE_KEY)
```javascript
// api/admin.js
import { supabaseAdmin } from '../supabaseClient.js';

router.post('/admin/reset', authenticateToken, async (req, res) => {
  // Contourne RLS, supprime tout
  const { error } = await supabaseAdmin
    .from('demo_posts')
    .delete()
    .neq('id', 0);
  res.json({ success: !error });
});
```

## 🚨 Checklist de sécurité

- [ ] La SERVICE_ROLE_KEY est dans `.env` (jamais dans le code)
- [ ] Le fichier `.env` est dans `.gitignore`
- [ ] Les routes admin sont protégées par JWT
- [ ] La SERVICE_ROLE_KEY n'est jamais envoyée au frontend
- [ ] Vous utilisez ANON_KEY par défaut, SERVICE_ROLE_KEY uniquement quand nécessaire

