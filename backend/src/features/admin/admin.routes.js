import express from 'express'
import * as adminController from './admin.controller.js'
import { authenticateToken, requireAdmin } from '../../middleware/auth.middleware.js'
import { requireRole, requirePermission } from '../../middleware/permissions.middleware.js'

const router = express.Router()

// Public health check
router.get('/admin/health', adminController.getHealth)

// Protected admin routes - Utilise le nouveau système RBAC
router.post('/admin/reset', authenticateToken, requireRole('admin'), adminController.resetDatabase)
router.post('/admin/seed', authenticateToken, requirePermission('admin:seed'), adminController.seedDatabase)
router.post('/admin/generate', authenticateToken, requirePermission('admin:generate'), adminController.generateData)
router.get('/admin/diagnostics', authenticateToken, requirePermission('admin:diagnostics'), adminController.getDiagnostics)

// Ancien middleware (rétrocompatibilité)
// router.post('/admin/reset', authenticateToken, requireAdmin, adminController.resetDatabase)

export default router

