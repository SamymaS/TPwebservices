# 🚨 ALERTE SÉCURITÉ - ACTION IMMÉDIATE REQUISE

## ⚠️ Problème

Votre fichier `.env` avec **TOUTES VOS CLÉS SECRÈTES** a été poussé sur GitHub !

Cela inclut probablement :
- ❌ `JWT_SECRET` (secret JWT)
- ❌ `SUPABASE_ANON_KEY` (clé publique Supabase)
- ❌ `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **TRÈS DANGEREUX**
- ❌ Potentiellement d'autres clés

## 🔥 DANGERS

- ✅ Quelqu'un peut accéder à votre base de données Supabase
- ✅ Quelqu'un peut créer des tokens JWT valides
- ✅ Quelqu'un peut bypasser la sécurité RLS de Supabase
- ✅ Quelqu'un peut modifier/supprimer vos données

## 🚀 ACTIONS IMMÉDIATES (À FAIRE MAINTENANT)

### Étape 1 : Retirer le fichier .env de Git

```powershell
cd c:/Users/SamyB/Dev/stikwebservices/ynov-express

# Retirer .env du tracking Git
git rm --cached backend/.env -f
git rm --cached .env -f

# Commiter la suppression
git add .
git commit -m "security: remove .env files from git"

# Pousser
git push origin main
```

### Étape 2 : Nettoyer l'historique Git (IMPORTANT)

⚠️ **Le fichier est toujours dans l'historique Git !**

Deux options :

#### Option A : BFG Repo Cleaner (Recommandé)

```powershell
# 1. Télécharger BFG
# https://rtyley.github.io/bfg-repo-cleaner/

# 2. Nettoyer le repo
java -jar bfg.jar --delete-files .env

# 3. Nettoyer Git
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 4. Force push
git push origin main --force
```

#### Option B : git filter-branch (Alternative)

```powershell
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch backend/.env .env" --prune-empty --tag-name-filter cat -- --all

git push origin main --force
```

### Étape 3 : CHANGER TOUTES VOS CLÉS (CRITIQUE)

#### 3.1 Supabase - Réinitialiser les clés

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Allez dans **Settings** → **API**
4. Cliquez sur **Reset JWT Secret** ⚠️
5. Cliquez sur **Reset Service Role Key** ⚠️
6. **IMPORTANT** : Notez les nouvelles clés

#### 3.2 Générer un nouveau JWT_SECRET

```powershell
# Générer un nouveau secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copiez ce nouveau secret.

#### 3.3 Mettre à jour votre .env local

Modifiez `backend/.env` avec les **NOUVELLES** clés :

```env
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=nouvelle_anon_key
SUPABASE_SERVICE_ROLE_KEY=nouvelle_service_role_key
JWT_SECRET=nouveau_secret_genere
```

### Étape 4 : Mettre à jour Railway/Render (si déjà déployé)

Si vous avez déjà déployé sur Railway :

1. Allez dans votre projet Railway
2. Variables → Modifier
3. Remplacez **TOUTES** les clés par les nouvelles
4. Sauvegardez → Railway redéploiera automatiquement

## 🛡️ Prévention future

### 1. Vérifier que .env est dans .gitignore

Le fichier `.gitignore` doit contenir :

```gitignore
# Variables d'environnement
.env
.env.*
!.env.example

# Backend
backend/.env
backend/.env.*
!backend/.env.example

# Frontend
frontend/.env
frontend/.env.*
!frontend/.env.example
```

### 2. Toujours vérifier avant de push

```powershell
# Avant CHAQUE git push, vérifiez :
git status

# Assurez-vous qu'aucun fichier .env n'apparaît
```

### 3. Utiliser des fichiers .env.example

Créez des fichiers `.env.example` avec des valeurs fictives :

```env
# .env.example
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre_anon_key_ici
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key_ici
JWT_SECRET=votre_secret_jwt_ici
```

Ces fichiers peuvent être committés sans danger.

### 4. Hook Git pre-commit (Optionnel)

Créez `.git/hooks/pre-commit` :

```bash
#!/bin/sh
if git diff --cached --name-only | grep -E '\.env$'; then
    echo "❌ ERREUR : Tentative de commit d'un fichier .env"
    echo "Les fichiers .env ne doivent JAMAIS être committés"
    exit 1
fi
```

## ✅ Checklist de sécurité

- [ ] Fichier .env retiré de Git (`git rm --cached`)
- [ ] Historique Git nettoyé (BFG ou filter-branch)
- [ ] Force push effectué
- [ ] **JWT_SECRET régénéré**
- [ ] **Clés Supabase réinitialisées**
- [ ] `.env` local mis à jour avec nouvelles clés
- [ ] Variables Railway/Render mises à jour
- [ ] `.gitignore` vérifié
- [ ] Test de l'application avec nouvelles clés

## 📚 Ressources

- [GitHub - Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [BFG Repo Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [Supabase - API Keys](https://supabase.com/docs/guides/api/api-keys)

## 🆘 Si c'est trop tard

Si quelqu'un a déjà accédé à vos clés :

1. Vérifiez les logs Supabase pour activité suspecte
2. Changez IMMÉDIATEMENT toutes les clés
3. Vérifiez vos données pour modifications non autorisées
4. Envisagez de créer un nouveau projet Supabase si nécessaire

---

**⏱️ TEMPS ESTIMÉ : 15-20 minutes**

**⚠️ NE PAS IGNORER - Vos données sont en danger jusqu'à ce que vous changiez les clés !**

