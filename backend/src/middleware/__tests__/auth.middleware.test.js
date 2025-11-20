import { describe, test, expect, jest, beforeEach } from '@jest/globals';

// Créer les mocks manuellement
const mockGetUserProfile = jest.fn();
const mockCreateOrUpdateUserProfile = jest.fn();
const mockJwtVerify = jest.fn();
const mockJwtSign = jest.fn();

// Mocker les modules (ESM) avant l'import réel
jest.unstable_mockModule('../../services/user.service.js', () => ({
  __esModule: true,
  getUserProfile: mockGetUserProfile,
  createOrUpdateUserProfile: mockCreateOrUpdateUserProfile
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

// Importer après avoir défini les mocks
const { authenticateToken, requireAdmin } = await import('../auth.middleware.js');

describe('authenticateToken Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    process.env.JWT_SECRET = 'test-secret';
    
    // Réinitialiser les mocks
    jest.clearAllMocks();
    mockGetUserProfile.mockClear();
    mockCreateOrUpdateUserProfile.mockClear();
    mockJwtVerify.mockClear();
    mockJwtSign.mockClear();
  });

  test('devrait retourner 401 si aucun token fourni', async () => {
    req.headers.authorization = undefined;

    await authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Token d\'authentification requis',
      message: 'Veuillez fournir un token dans le header Authorization: Bearer <token>',
      code: 'AUTH_TOKEN_MISSING'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('devrait retourner 401 si le header Authorization est mal formaté', async () => {
    req.headers.authorization = 'InvalidFormat'; // Pas de token après l'espace

    await authenticateToken(req, res, next);

    // Si le format est invalide (pas d'espace), split[1] sera undefined, donc 401
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('devrait appeler next() si le token est valide', async () => {
    const mockToken = 'valid-token';
    const mockDecoded = {
      sub: 'user-123',
      email: 'test@example.com',
      iat: 1234567890,
      exp: 1234654290,
      aud: 'authenticated'
    };
    const mockProfile = {
      id: 'user-123',
      email: 'test@example.com',
      role: 'user'
    };

    req.headers.authorization = `Bearer ${mockToken}`;
    mockJwtVerify.mockReturnValue(mockDecoded);
    mockGetUserProfile.mockResolvedValue(mockProfile);

    await authenticateToken(req, res, next);

    expect(mockJwtVerify).toHaveBeenCalledWith(mockToken, 'test-secret');
    expect(mockGetUserProfile).toHaveBeenCalledWith('user-123');
    expect(req.user).toEqual({
      sub: 'user-123',
      email: 'test@example.com',
      role: 'user',
      iat: 1234567890,
      exp: 1234654290,
      aud: 'authenticated'
    });
    expect(next).toHaveBeenCalled();
  });

  test('devrait créer un profil par défaut si l\'utilisateur n\'existe pas', async () => {
    const mockToken = 'valid-token';
    const mockDecoded = {
      sub: 'new-user-123',
      email: 'newuser@example.com',
      iat: 1234567890,
      exp: 1234654290,
      aud: 'authenticated'
    };
    const mockNewProfile = {
      id: 'new-user-123',
      email: 'newuser@example.com',
      role: 'user'
    };

    req.headers.authorization = `Bearer ${mockToken}`;
    mockJwtVerify.mockReturnValue(mockDecoded);
    mockGetUserProfile.mockResolvedValueOnce(null);
    mockCreateOrUpdateUserProfile.mockResolvedValue(mockNewProfile);

    await authenticateToken(req, res, next);

    expect(mockGetUserProfile).toHaveBeenCalledWith('new-user-123');
    expect(mockCreateOrUpdateUserProfile).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  test('devrait retourner 401 si le token est expiré', async () => {
    const mockToken = 'expired-token';
    req.headers.authorization = `Bearer ${mockToken}`;

    const error = new Error('Token expired');
    error.name = 'TokenExpiredError';
    mockJwtVerify.mockImplementation(() => {
      throw error;
    });

    await authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Token expiré',
      message: 'Votre session a expiré, veuillez vous reconnecter',
      code: 'AUTH_TOKEN_EXPIRED'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('devrait retourner 403 si le token est invalide', async () => {
    const mockToken = 'invalid-token';
    req.headers.authorization = `Bearer ${mockToken}`;

    const error = new Error('Invalid token');
    error.name = 'JsonWebTokenError';
    mockJwtVerify.mockImplementation(() => {
      throw error;
    });

    await authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Token invalide',
      message: 'Le token fourni n\'est pas valide',
      code: 'AUTH_TOKEN_INVALID'
    });
    expect(next).not.toHaveBeenCalled();
  });
});

describe('requireAdmin Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test('devrait retourner 401 si req.user n\'existe pas', () => {
    requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Authentification requise',
      message: 'Vous devez être authentifié pour accéder à cette ressource',
      code: 'AUTH_REQUIRED'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('devrait retourner 403 si l\'utilisateur n\'est pas admin', () => {
    req.user = {
      sub: 'user-123',
      email: 'user@example.com',
      role: 'user'
    };

    requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Accès interdit',
      message: 'Vous devez avoir le rôle administrateur pour accéder à cette ressource',
      code: 'ADMIN_REQUIRED',
      userRole: 'user'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('devrait appeler next() si l\'utilisateur est admin', () => {
    req.user = {
      sub: 'admin-123',
      email: 'admin@example.com',
      role: 'admin'
    };

    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
