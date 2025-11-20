-- Migration: Créer la table user_profiles pour stocker les rôles des utilisateurs
-- Cette table permet de gérer les rôles de manière centralisée et sécurisée

-- 1. Créer la table user_profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE, -- ID utilisateur (correspond à auth.users.id de Supabase)
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('guest', 'user', 'moderator', 'admin', 'super_admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Créer des index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);

-- 3. Créer une fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Créer le trigger pour updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Activer RLS (Row Level Security)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 6. Politique RLS : Les utilisateurs peuvent lire leur propre profil
CREATE POLICY user_profiles_select_own ON public.user_profiles
  FOR SELECT
  USING (auth.uid()::text = user_id);

-- 7. Politique RLS : Les admins peuvent lire tous les profils
CREATE POLICY user_profiles_select_admin ON public.user_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid()::text
      AND role IN ('admin', 'super_admin')
    )
  );

-- 8. Politique RLS : Les utilisateurs peuvent mettre à jour leur propre profil (sauf le rôle)
CREATE POLICY user_profiles_update_own ON public.user_profiles
  FOR UPDATE
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id AND role = OLD.role); -- Empêche la modification du rôle

-- 9. Politique RLS : Les admins peuvent mettre à jour les rôles
CREATE POLICY user_profiles_update_admin ON public.user_profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid()::text
      AND role IN ('admin', 'super_admin')
    )
  );

-- 10. Commentaires pour documentation
COMMENT ON TABLE public.user_profiles IS 'Table de profils utilisateurs avec gestion des rôles RBAC';
COMMENT ON COLUMN public.user_profiles.user_id IS 'ID utilisateur (correspond à auth.users.id de Supabase)';
COMMENT ON COLUMN public.user_profiles.email IS 'Email de l''utilisateur';
COMMENT ON COLUMN public.user_profiles.role IS 'Rôle RBAC de l''utilisateur (guest, user, moderator, admin, super_admin)';
COMMENT ON COLUMN public.user_profiles.created_at IS 'Date de création du profil';
COMMENT ON COLUMN public.user_profiles.updated_at IS 'Date de dernière mise à jour du profil';



