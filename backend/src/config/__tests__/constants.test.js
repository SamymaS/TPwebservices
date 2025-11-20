import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { USER_ROLES, ROLE_HIERARCHY, PERMISSIONS, HTTP_STATUS, ERROR_CODES } from '../constants.js';

const selectMock = jest.fn();
const fromMock = jest.fn();
let queryResponse = { data: [], error: null };
let lastQueryBuilder = null;

const createQueryBuilder = () => {
  const builder = {};
  builder.eq = jest.fn(() => builder);
  builder.ilike = jest.fn(() => builder);
  builder.then = (onFulfilled, onRejected) =>
    Promise.resolve().then(() => queryResponse).then(onFulfilled, onRejected);
  builder.catch = (onRejected) =>
    Promise.resolve().then(() => queryResponse).catch(onRejected);
  builder.finally = (onFinally) =>
    Promise.resolve().then(() => queryResponse).finally(onFinally);
  return builder;
};

jest.unstable_mockModule('../../services/supabase.service.js', () => ({
  supabase: {
    from: fromMock,
  },
}));

const { getAllPosts } = await import('../../features/posts/posts.controller.js');

const createReq = (query = {}) => ({
  query,
});

const createRes = () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  return res;
};

beforeEach(() => {
  queryResponse = { data: [], error: null };
  lastQueryBuilder = null;
  jest.clearAllMocks();
  fromMock.mockImplementation(() => ({ select: selectMock }));
  selectMock.mockImplementation(() => {
    lastQueryBuilder = createQueryBuilder();
    return lastQueryBuilder;
  });
});

describe('Constants', () => {
  // describe('USER_ROLES', () => {
  //   test('devrait contenir tous les rôles définis', () => {
  //     expect(USER_ROLES).toHaveProperty('GUEST');
  //     expect(USER_ROLES).toHaveProperty('USER');
  //     expect(USER_ROLES).toHaveProperty('MODERATOR');
  //     expect(USER_ROLES).toHaveProperty('ADMIN');
  //     expect(USER_ROLES).toHaveProperty('SUPER_ADMIN');
  //   });

  //   test('devrait avoir les bonnes valeurs pour chaque rôle', () => {
  //     expect(USER_ROLES.GUEST).toBe('guest');
  //     expect(USER_ROLES.USER).toBe('user');
  //     expect(USER_ROLES.MODERATOR).toBe('moderator');
  //     expect(USER_ROLES.ADMIN).toBe('admin');
  //     expect(USER_ROLES.SUPER_ADMIN).toBe('super_admin');
  //   });
  // });

  // describe('ROLE_HIERARCHY', () => {
  //   test('devrait être un tableau ordonné du plus bas au plus élevé', () => {
  //     expect(ROLE_HIERARCHY).toEqual(['guest', 'user', 'moderator', 'admin', 'super_admin']);
  //   });

  //   test('devrait contenir tous les rôles', () => {
  //     const allRoles = Object.values(USER_ROLES);
  //     ROLE_HIERARCHY.forEach(role => {
  //       expect(allRoles).toContain(role);
  //     });
  //   });
  // });

  // describe('PERMISSIONS', () => {
  //   test('devrait avoir des permissions pour chaque rôle', () => {
  //     Object.values(USER_ROLES).forEach(role => {
  //       expect(PERMISSIONS).toHaveProperty(role);
  //       expect(Array.isArray(PERMISSIONS[role])).toBe(true);
  //     });
  //   });

  //   test('devrait avoir des permissions pour guest', () => {
  //     expect(PERMISSIONS.guest).toContain('posts:read');
  //     expect(PERMISSIONS.guest).toContain('comments:read');
  //     expect(PERMISSIONS.guest).toContain('likes:read');
  //   });

  //   test('devrait avoir des permissions étendues pour user', () => {
  //     expect(PERMISSIONS.user).toContain('posts:create');
  //     expect(PERMISSIONS.user).toContain('posts:update:own');
  //     expect(PERMISSIONS.user).toContain('posts:delete:own');
  //   });

  //   test('devrait avoir toutes les permissions pour super_admin', () => {
  //     expect(PERMISSIONS.super_admin).toContain('*');
  //   });
  // });

  // describe('HTTP_STATUS', () => {
  //   test('devrait contenir les codes HTTP standards', () => {
  //     expect(HTTP_STATUS.OK).toBe(200);
  //     expect(HTTP_STATUS.CREATED).toBe(201);
  //     expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
  //     expect(HTTP_STATUS.UNAUTHORIZED).toBe(401);
  //     expect(HTTP_STATUS.FORBIDDEN).toBe(403);
  //     expect(HTTP_STATUS.NOT_FOUND).toBe(404);
  //     expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
  //   });
  // });

  // describe('ERROR_CODES', () => {
  //   test('devrait contenir les codes d\'erreur d\'authentification', () => {
  //     expect(ERROR_CODES).toHaveProperty('AUTH_TOKEN_MISSING');
  //     expect(ERROR_CODES).toHaveProperty('AUTH_TOKEN_EXPIRED');
  //     expect(ERROR_CODES).toHaveProperty('AUTH_TOKEN_INVALID');
  //     expect(ERROR_CODES).toHaveProperty('AUTH_REQUIRED');
  //   });

  //   test('devrait contenir les codes d\'erreur de validation', () => {
  //     expect(ERROR_CODES).toHaveProperty('VALIDATION_ERROR');
  //     expect(ERROR_CODES).toHaveProperty('INVALID_ROLE');
  //   });
  // });

  describe('GetPosts', () => {
    test('devrait retourner les posts quand la requête réussit', async () => {
      const posts = [{ id: 1, title: 'Hello', is_published: true }];
      queryResponse = { data: posts, error: null };
      const req = createReq();
      const res = createRes();

      await getAllPosts(req, res);

      expect(fromMock).toHaveBeenCalledWith('demo_posts');
      expect(selectMock).toHaveBeenCalledWith('*');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(posts);
      expect(lastQueryBuilder).not.toBeNull();
      expect(lastQueryBuilder.eq).not.toHaveBeenCalled();
      expect(lastQueryBuilder.ilike).not.toHaveBeenCalled();
    });

    test('devrait appliquer les filtres de publication et de recherche', async () => {
      const req = createReq({ is_published: 'true', q: 'Hello' });
      queryResponse = { data: [], error: null };
      const res = createRes();

      await getAllPosts(req, res);

      expect(lastQueryBuilder).not.toBeNull();
      expect(lastQueryBuilder.eq).toHaveBeenCalledWith('is_published', true);
      expect(lastQueryBuilder.ilike).toHaveBeenCalledWith('title', '%Hello%');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    test('devrait retourner une erreur serveur si Supabase échoue', async () => {
      const error = { message: 'database exploded' };
      queryResponse = { data: null, error };
      const req = createReq();
      const res = createRes();

      await getAllPosts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
  
});
