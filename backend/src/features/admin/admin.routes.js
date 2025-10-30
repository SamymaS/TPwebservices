import express from 'express'
import * as adminController from './admin.controller.js'
import { authenticateToken, requireAdmin } from '../../middleware/auth.middleware.js'

const router = express.Router()

// Public health check
router.get('/admin/health', adminController.getHealth)

// Protected admin routes
router.post('/admin/reset', authenticateToken, requireAdmin, adminController.resetDatabase)
router.post('/admin/seed', authenticateToken, requireAdmin, adminController.seedDatabase)
router.post('/admin/generate', authenticateToken, requireAdmin, adminController.generateData)
router.get('/admin/diagnostics', authenticateToken, requireAdmin, adminController.getDiagnostics)

export default router

