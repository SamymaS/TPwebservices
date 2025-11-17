import express from 'express'
import * as postsController from './posts.controller.js'
import { authenticateToken, optionalAuth } from '../../middleware/auth.middleware.js'
import { requirePermission, requireRole } from '../../middleware/permissions.middleware.js'

const router = express.Router()

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Liste les posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: is_published
 *         schema:
 *           type: string
 *           enum: [true, false]
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *           description: Recherche sur le titre (>= 2 caractères)
 *     responses:
 *       200:
 *         description: Liste de posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get('/posts', optionalAuth, postsController.getAllPosts)

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Récupère un post par id
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post introuvable
 */
router.get('/posts/:id', optionalAuth, postsController.getPostById)

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Crée un post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostInput'
 *     responses:
 *       201:
 *         description: Post créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Données invalides
 */
router.post('/posts', 
  authenticateToken, 
  requirePermission('posts:create'), 
  postsController.createPost
)

/**
 * @swagger
 * /api/posts/{id}:
 *   patch:
 *     summary: Met à jour un post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePostInput'
 *     responses:
 *       200:
 *         description: Post mis à jour
 *       403:
 *         description: Accès refusé
 */
router.patch('/posts/:id', 
  authenticateToken, 
  postsController.updatePost  // Vérification own/any dans le controller
)

/**
 * @swagger
 * /api/posts/{id}/publish:
 *   patch:
 *     summary: Publie un post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Publication effectuée
 *       403:
 *         description: Rôle insuffisant
 */
router.patch('/posts/:id/publish', 
  authenticateToken, 
  requireRole('moderator'),  // Seuls moderator+ peuvent publier
  postsController.publishPost
)

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Supprime un post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Post supprimé
 *       403:
 *         description: Accès refusé
 */
router.delete('/posts/:id', 
  authenticateToken, 
  postsController.deletePost  // Vérification own/any dans le controller
)

/**
 * @swagger
 * /api/posts/{id}/comments:
 *   get:
 *     summary: Récupère les commentaires d'un post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste de commentaires
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */
router.get('/posts/:id/comments', postsController.getComments)

/**
 * @swagger
 * /api/posts/{id}/comments:
 *   post:
 *     summary: Ajoute un commentaire
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentInput'
 *     responses:
 *       201:
 *         description: Commentaire créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */
router.post('/posts/:id/comments', 
  authenticateToken, 
  requirePermission('comments:create'), 
  postsController.createComment
)

/**
 * @swagger
 * /api/posts/{postId}/comments/{commentId}:
 *   delete:
 *     summary: Supprime un commentaire
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Commentaire supprimé
 */
router.delete('/posts/:postId/comments/:commentId', 
  authenticateToken, 
  postsController.deleteComment  // Vérification own/any dans le controller
)

/**
 * @swagger
 * /api/posts/{id}/likes:
 *   get:
 *     summary: Récupère les likes d'un post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des likes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Like'
 */
router.get('/posts/:id/likes', postsController.getLikes)

/**
 * @swagger
 * /api/posts/{id}/likes-count:
 *   get:
 *     summary: Compte les likes d'un post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Nombre de likes
 *         content:
 *           application/json:
 *             schema:
 *               type: integer
 *               example: 12
 */
router.get('/posts/:id/likes-count', postsController.getLikesCount)

/**
 * @swagger
 * /api/posts/{id}/likes:
 *   post:
 *     summary: Ajoute un like
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Like ajouté
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Like'
 */
router.post('/posts/:id/likes', 
  authenticateToken, 
  requirePermission('likes:create'), 
  postsController.createLike
)

/**
 * @swagger
 * /api/posts/{postId}/likes/{likeId}:
 *   delete:
 *     summary: Supprime un like
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: likeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Like supprimé
 */
router.delete('/posts/:postId/likes/:likeId', 
  authenticateToken, 
  postsController.deleteLike  // Vérification own/any dans le controller
)

export default router

