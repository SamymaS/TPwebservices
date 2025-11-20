import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { authAPI } from '../api.js';

// Mocker fetch global
global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('authAPI.generateToken', () => {
    test('devrait appeler l\'endpoint correct avec les bonnes données', async () => {
      const mockResponse = {
        success: true,
        access_token: 'mock-token',
        user: { id: 'user-123', email: 'test@example.com', role: 'user' }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await authAPI.generateToken({
        userId: 'user-123',
        email: 'test@example.com',
        role: 'user'
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/generate-token'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({
            userId: 'user-123',
            email: 'test@example.com',
            role: 'user'
          })
        })
      );

      expect(result).toEqual(mockResponse);
    });

    test('devrait gérer les erreurs de réseau', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        authAPI.generateToken({ email: 'test@example.com' })
      ).rejects.toThrow('Network error');
    });
  });

  describe('authAPI.verify', () => {
    test('devrait envoyer le token dans le header Authorization', async () => {
      const mockResponse = {
        success: true,
        valid: true,
        user: { id: 'user-123', email: 'test@example.com' }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await authAPI.verify('mock-token');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/verify'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token'
          })
        })
      );
    });
  });
});

