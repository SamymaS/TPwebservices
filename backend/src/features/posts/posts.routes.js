import express from 'express'
import * as postsController from './posts.controller.js'
import { authenticateToken, optionalAuth } from '../../middleware/auth.middleware.js'
import { requirePermission, requireRole } from '../../middleware/permissions.middleware.js'

const router = express.Router()

// Public routes (avec auth optionnelle pour afficher les permissions)
router.get('/posts', optionalAuth, postsController.getAllPosts)
router.get('/posts/:id', optionalAuth, postsController.getPostById)

// Protected routes avec permissions RBAC strictes
router.post('/posts', 
  authenticateToken, 
  requirePermission('posts:create'), 
  postsController.createPost
)

router.patch('/posts/:id', 
  authenticateToken, 
  postsController.updatePost  // Vérification own/any dans le controller
)

router.patch('/posts/:id/publish', 
  authenticateToken, 
  requireRole('moderator'),  // Seuls moderator+ peuvent publier
  postsController.publishPost
)

router.delete('/posts/:id', 
  authenticateToken, 
  postsController.deletePost  // Vérification own/any dans le controller
)

// Comments routes avec RBAC
router.get('/posts/:id/comments', postsController.getComments)

router.post('/posts/:id/comments', 
  authenticateToken, 
  requirePermission('comments:create'), 
  postsController.createComment
)

router.delete('/posts/:postId/comments/:commentId', 
  authenticateToken, 
  postsController.deleteComment  // Vérification own/any dans le controller
)

// Likes routes avec RBAC
router.get('/posts/:id/likes', postsController.getLikes)
router.get('/posts/:id/likes-count', postsController.getLikesCount)

router.post('/posts/:id/likes', 
  authenticateToken, 
  requirePermission('likes:create'), 
  postsController.createLike
)

router.delete('/posts/:postId/likes/:likeId', 
  authenticateToken, 
  postsController.deleteLike  // Vérification own/any dans le controller
)

export default router

