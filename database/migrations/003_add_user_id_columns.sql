-- Migration: Ajouter user_id à toutes les tables pour le système RBAC

-- 1. Ajouter user_id à demo_posts
ALTER TABLE demo_posts 
ADD COLUMN IF NOT EXISTS user_id TEXT;

-- 2. Ajouter user_id à demo_comments
ALTER TABLE demo_comments 
ADD COLUMN IF NOT EXISTS user_id TEXT;

-- 3. Ajouter user_id à demo_likes
ALTER TABLE demo_likes 
ADD COLUMN IF NOT EXISTS user_id TEXT;

-- 4. Créer des index pour optimiser les requêtes de permissions
CREATE INDEX IF NOT EXISTS idx_demo_posts_user_id ON demo_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_demo_comments_user_id ON demo_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_demo_likes_user_id ON demo_likes(user_id);

-- 5. Commentaires pour documentation
COMMENT ON COLUMN demo_posts.user_id IS 'ID de l''utilisateur qui a créé le post (pour les permissions RBAC)';
COMMENT ON COLUMN demo_comments.user_id IS 'ID de l''utilisateur qui a créé le commentaire (pour les permissions RBAC)';
COMMENT ON COLUMN demo_likes.user_id IS 'ID de l''utilisateur qui a créé le like (pour les permissions RBAC)';

