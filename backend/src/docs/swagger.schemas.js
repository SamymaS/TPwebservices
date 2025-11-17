/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentification JWT, permissions et gestion des tokens
 *   - name: Posts
 *     description: Gestion des posts, commentaires et likes
 *   - name: Admin
 *     description: Outils d’administration et diagnostics
 *
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           example: "Erreur serveur"
 *         message:
 *           type: string
 *           example: "Une erreur est survenue"
 *         code:
 *           type: string
 *           example: "INTERNAL_SERVER_ERROR"
 *
 *     AuthTokenRequest:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           example: "user-123"
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         role:
 *           type: string
 *           enum: [user, moderator, admin]
 *       required: [email, role]
 *
 *     AuthTokenResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         access_token:
 *           type: string
 *         token_type:
 *           type: string
 *           example: "Bearer"
 *         expires_in:
 *           type: integer
 *           example: 3600
 *         expires_at:
 *           type: string
 *           format: date-time
 *         user:
 *           $ref: '#/components/schemas/PublicUser'
 *
 *     PasswordResetRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *       required: [email]
 *
 *     PasswordUpdateRequest:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         password:
 *           type: string
 *           minLength: 6
 *       required: [token, password]
 *
 *     PublicUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           enum: [user, moderator, admin]
 *
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         is_published:
 *           type: boolean
 *         published_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         user_id:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     CreatePostInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Nouveau post"
 *         content:
 *           type: string
 *           example: "Contenu détaillé du post"
 *       required: [title, content]
 *
 *     UpdatePostInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         content:
 *           type: string
 *
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         post:
 *           type: string
 *         content:
 *           type: string
 *         user_id:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *
 *     CreateCommentInput:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           minLength: 2
 *           maxLength: 280
 *       required: [content]
 *
 *     Like:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         post:
 *           type: string
 *         user_id:
 *           type: string
 *
 *     AdminSeedRequest:
 *       type: object
 *       properties:
 *         mode:
 *           type: string
 *           description: "Type de population de données"
 *           example: "demo"
 *         force:
 *           type: boolean
 *           example: false
 */
export {}


