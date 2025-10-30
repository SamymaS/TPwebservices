import express from 'express'
import * as authController from './auth.controller.js'
import { authenticateToken } from '../../middleware/auth.middleware.js'

const router = express.Router()

// Auth routes
router.post('/auth/generate-token', authController.generateToken)
router.post('/auth/generate-admin-token', authController.generateAdminToken)
router.get('/auth/verify', authController.verifyToken)
router.get('/auth/me', authenticateToken, authController.getMe)
router.post('/auth/logout', authenticateToken, authController.logout)
router.post('/auth/refresh', authenticateToken, authController.refreshToken)

export default router

