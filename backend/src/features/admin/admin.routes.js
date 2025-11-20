import express from 'express'
import * as adminController from './admin.controller.js'
import { authenticateToken, requireAdmin } from '../../middleware/auth.middleware.js'
import { requireRole, requirePermission } from '../../middleware/permissions.middleware.js'

const router = express.Router()

/**
 * @swagger
 * /api/admin/health:
 *   get:
 *     summary: Vérifie la santé du module admin
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Statut de l'instance
 */
router.get('/admin/health', adminController.getHealth)

/**
 * @swagger
 * /api/admin/reset:
 *   post:
 *     summary: Réinitialise la base de données
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Base réinitialisée
 *       403:
 *         description: Rôle insuffisant
 */
router.post('/admin/reset', authenticateToken, requireRole('admin'), adminController.resetDatabase)

/**
 * @swagger
 * /api/admin/seed:
 *   post:
 *     summary: Peuple la base avec des données de démonstration
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminSeedRequest'
 *     responses:
 *       200:
 *         description: Données insérées
 *       403:
 *         description: Permission manquante
 */
router.post('/admin/seed', authenticateToken, requirePermission('admin:seed'), adminController.seedDatabase)

/**
 * @swagger
 * /api/admin/generate:
 *   post:
 *     summary: Génère du contenu supplémentaire (stress test)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contenu généré
 */
router.post('/admin/generate', authenticateToken, requirePermission('admin:generate'), adminController.generateData)

/**
 * @swagger
 * /api/admin/diagnostics:
 *   get:
 *     summary: Retourne des diagnostics système
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations de diagnostic
 */
router.get('/admin/diagnostics', authenticateToken, requirePermission('admin:diagnostics'), adminController.getDiagnostics)

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Liste tous les utilisateurs (admin seulement)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
router.get('/admin/users', authenticateToken, requireRole('admin'), adminController.getAllUsers)

/**
 * @swagger
 * /api/admin/users/:userId:
 *   get:
 *     summary: Obtenir un utilisateur par ID (admin seulement)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 */
router.get('/admin/users/:userId', authenticateToken, requireRole('admin'), adminController.getUserById)

/**
 * @swagger
 * /api/admin/users/:userId/role:
 *   patch:
 *     summary: Mettre à jour le rôle d'un utilisateur (admin seulement)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [guest, user, moderator, admin, super_admin]
 *     responses:
 *       200:
 *         description: Rôle mis à jour
 */
router.patch('/admin/users/:userId/role', authenticateToken, requireRole('admin'), adminController.updateUserRoleById)

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Créer ou mettre à jour un profil utilisateur (admin seulement)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - email
 *             properties:
 *               userId:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [guest, user, moderator, admin, super_admin]
 *     responses:
 *       200:
 *         description: Profil créé ou mis à jour
 */
router.post('/admin/users', authenticateToken, requireRole('admin'), adminController.createOrUpdateUser)

// Ancien middleware (rétrocompatibilité)
// router.post('/admin/reset', authenticateToken, requireAdmin, adminController.resetDatabase)

export default router

