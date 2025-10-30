import express from 'express'
import * as postsController from './posts.controller.js'
import { authenticateToken } from '../../middleware/auth.middleware.js'

const router = express.Router()

// Public routes
router.get('/posts', postsController.getAllPosts)
router.get('/posts/:id', postsController.getPostById)

// Protected routes (authentication required)
router.post('/posts', authenticateToken, postsController.createPost)
router.patch('/posts/:id', authenticateToken, postsController.updatePost)
router.patch('/posts/:id/publish', authenticateToken, postsController.publishPost)
router.delete('/posts/:id', authenticateToken, postsController.deletePost)

// Comments routes
router.get('/posts/:id/comments', postsController.getComments)
router.post('/posts/:id/comments', authenticateToken, postsController.createComment)
router.delete('/posts/:postId/comments/:commentId', authenticateToken, postsController.deleteComment)

// Likes routes
router.get('/posts/:id/likes', postsController.getLikes)
router.get('/posts/:id/likes-count', postsController.getLikesCount)
router.post('/posts/:id/likes', authenticateToken, postsController.createLike)
router.delete('/posts/:postId/likes/:likeId', authenticateToken, postsController.deleteLike)

export default router

