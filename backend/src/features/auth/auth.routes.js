import express from 'express'
import * as authController from './auth.controller.js'
import { authenticateToken } from '../../middleware/auth.middleware.js'
import { debugPermissions } from '../../middleware/permissions.middleware.js'

const router = express.Router()

/**
 * @swagger
 * /api/auth/generate-token:
 *   post:
 *     summary: Génère un token JWT pour un utilisateur
 *     description: Permet de créer rapidement un token pour des tests locaux avec un rôle spécifique.
 *     tags: [Auth]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthTokenRequest'
 *     responses:
 *       200:
 *         description: Token généré
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokenResponse'
 */
router.post('/auth/generate-token', authController.generateToken)

/**
 * @swagger
 * /api/auth/generate-admin-token:
 *   post:
 *     summary: Génère un token administrateur
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token administrateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokenResponse'
 */
router.post('/auth/generate-admin-token', authController.generateAdminToken)

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary: Vérifie la validité d'un token
 *     tags: [Auth]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: "Bearer <token>"
 *     responses:
 *       200:
 *         description: Token valide
 *       401:
 *         description: Token manquant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Token invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/auth/verify', authController.verifyToken)

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Retourne l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur authentifié
 *       401:
 *         description: Token manquant ou invalide
 */
router.get('/auth/me', authenticateToken, authController.getMe)

/**
 * @swagger
 * /api/auth/permissions:
 *   get:
 *     summary: Affiche les permissions liées au token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Permissions et rôles actuels
 */
router.get('/auth/permissions', authenticateToken, debugPermissions)

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Indique comment invalider le token côté client
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Confirmation
 */
router.post('/auth/logout', authenticateToken, authController.logout)

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Régénère un token JWT valide
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Nouveau token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokenResponse'
 */
router.post('/auth/refresh', authenticateToken, authController.refreshToken)

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Demande un email de réinitialisation
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordResetRequest'
 *     responses:
 *       200:
 *         description: Email envoyé si l'utilisateur existe
 *       400:
 *         description: Email manquant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/auth/forgot-password', authController.requestPasswordReset)

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Réinitialise le mot de passe via le token Supabase
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordUpdateRequest'
 *     responses:
 *       200:
 *         description: Mot de passe mis à jour
 *       400:
 *         description: Données manquantes ou invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/auth/reset-password', authController.resetPassword)

export default router

