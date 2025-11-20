import { describe, test, expect, jest, beforeEach } from '@jest/globals';

// Créer les mocks manuellement
const mockCreateOrUpdateUserProfile = jest.fn();
const mockGetUserProfile = jest.fn();
const mockJwtVerify = jest.fn();
const mockJwtSign = jest.fn();

// Mocker les modules pour l'environnement ESM
jest.unstable_mockModule('../../../services/user.service.js', () => ({
  __esModule: true,
  createOrUpdateUserProfile: mockCreateOrUpdateUserProfile,
  getUserProfile: mockGetUserProfile
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  __esModule: true,
  default: {
    verify: mockJwtVerify,
    sign: mockJwtSign
  },
  verify: mockJwtVerify,
  sign: mockJwtSign
}));

// Importer après mock
const { generateToken, verifyToken, getMe } = await import('../auth.controller.js');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: {},
      headers: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    process.env.JWT_SECRET = 'test-secret';
    
    // Réinitialiser les mocks
    jest.clearAllMocks();
    mockCreateOrUpdateUserProfile.mockClear();
    mockGetUserProfile.mockClear();
    mockJwtVerify.mockClear();
    mockJwtSign.mockClear();
  });

  describe('generateToken', () => {
    test('devrait générer un token et créer un profil utilisateur', async () => {
      req.body = {
        userId: 'test-user-123',
        email: 'test@example.com',
        role: 'user'
      };

      mockCreateOrUpdateUserProfile.mockResolvedValue({
        id: 'test-user-123',
        email: 'test@example.com',
        role: 'user'
      });
      mockJwtSign.mockReturnValue('mock-jwt-token');

      await generateToken(req, res);

      expect(mockCreateOrUpdateUserProfile).toHaveBeenCalledWith(
        'test-user-123',
        'test@example.com',
        'user'
      );
      expect(mockJwtSign).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        access_token: 'mock-jwt-token',
        token_type: 'Bearer',
        expires_in: expect.any(Number),
        expires_at: expect.any(String),
        user: {
          id: 'test-user-123',
          email: 'test@example.com',
          role: 'user'
        }
      });
    });

    test('devrait utiliser des valeurs par défaut si les champs sont manquants', async () => {
      req.body = {};

      mockCreateOrUpdateUserProfile.mockResolvedValue({
        id: expect.any(String),
        email: 'test@example.com',
        role: 'user'
      });
      mockJwtSign.mockReturnValue('mock-jwt-token');

      await generateToken(req, res);

      expect(mockCreateOrUpdateUserProfile).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    test('devrait retourner une erreur si le rôle est invalide', async () => {
      req.body = {
        userId: 'test-user-123',
        email: 'test@example.com',
        role: 'invalid-role'
      };

      await generateToken(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Rôle invalide',
        message: expect.stringContaining('Le rôle doit être'),
        code: 'INVALID_ROLE',
        allowedRoles: expect.any(Array)
      });
      expect(mockCreateOrUpdateUserProfile).not.toHaveBeenCalled();
    });
  });

  describe('verifyToken', () => {
    test('devrait retourner 401 si aucun token fourni', async () => {
      req.headers = {};

      await verifyToken(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Token manquant',
        message: 'Aucun token fourni dans le header Authorization',
        code: 'TOKEN_MISSING'
      });
    });

    test('devrait vérifier un token valide et retourner les infos utilisateur', async () => {
      req.headers = {
        authorization: 'Bearer valid-token'
      };

      const mockDecoded = {
        sub: 'user-123',
        email: 'test@example.com',
        iat: 1234567890,
        exp: 1234654290
      };

      mockJwtVerify.mockReturnValue(mockDecoded);
      mockGetUserProfile.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        role: 'user'
      });

      await verifyToken(req, res);

      expect(mockJwtVerify).toHaveBeenCalledWith('valid-token', 'test-secret');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        valid: true,
        decoded: expect.objectContaining({
          sub: 'user-123',
          email: 'test@example.com',
          role: 'user'
        }),
        message: expect.any(String),
        expiresIn: expect.any(Number),
        expiresAt: expect.any(String),
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: 'user'
        }
      });
    });

    test('devrait retourner 403 si le token est invalide', async () => {
      req.headers = {
        authorization: 'Bearer invalid-token'
      };

      const error = new Error('Invalid token');
      error.name = 'JsonWebTokenError';
      mockJwtVerify.mockImplementation(() => {
        throw error;
      });

      await verifyToken(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        valid: false,
        error: 'JsonWebTokenError',
        message: 'Invalid token',
        code: 'TOKEN_INVALID'
      });
    });
  });

  describe('getMe', () => {
    test('devrait retourner les informations de l\'utilisateur connecté', () => {
      req.user = {
        sub: 'user-123',
        email: 'test@example.com',
        role: 'user',
        iat: 1234567890,
        exp: 1234654290
      };

      getMe(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: 'user',
          authenticatedAt: expect.any(String),
          expiresAt: expect.any(String)
        }
      });
    });
  });
});
