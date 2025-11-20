import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { getUserProfile, createOrUpdateUserProfile, updateUserRole } from '../user.service.js';
import { USER_ROLES } from '../../config/constants.js';

// Mocker Supabase - utiliser le mock manuel
jest.mock('../supabase.service.js', () => ({
  supabase: {
    from: jest.fn()
  },
  supabaseAdmin: {
    from: jest.fn()
  }
}));

// Importer après le mock
import { supabaseAdmin } from '../supabase.service.js';

describe('User Service', () => {
  let mockFrom, mockSelect, mockEq, mockSingle, mockUpsert, mockUpdate;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup des mocks en chaîne pour Supabase
    // Chaque méthode retourne un objet avec la méthode suivante
    mockSingle = jest.fn();
    
    // Pour getUserProfile: from().select().eq().single()
    const mockSelectEq = jest.fn().mockReturnValue({ single: mockSingle });
    mockSelect = jest.fn().mockReturnValue({ eq: mockSelectEq });
    
    // Pour createOrUpdateUserProfile: from().upsert().select().single()
    const mockUpsertSelect = jest.fn().mockReturnValue({ single: mockSingle });
    mockUpsert = jest.fn().mockReturnValue({ select: mockUpsertSelect });
    
    // Pour updateUserRole: from().update().eq().select().single()
    const mockUpdateSelect = jest.fn().mockReturnValue({ single: mockSingle });
    const mockUpdateEq = jest.fn().mockReturnValue({ select: mockUpdateSelect });
    mockUpdate = jest.fn().mockReturnValue({ eq: mockUpdateEq });
    
    mockFrom = jest.fn().mockReturnValue({
      select: mockSelect,
      upsert: mockUpsert,
      update: mockUpdate
    });

    supabaseAdmin.from = mockFrom;
  });

  describe('getUserProfile', () => {
    test('devrait récupérer le profil utilisateur avec succès', async () => {
      const mockProfile = {
        user_id: 'user-123',
        email: 'test@example.com',
        role: 'user'
      };

      mockSingle.mockResolvedValue({
        data: mockProfile,
        error: null
      });

      const result = await getUserProfile('user-123');

      expect(mockFrom).toHaveBeenCalledWith('user_profiles');
      expect(mockSelect).toHaveBeenCalledWith('user_id, email, role');
      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        role: 'user'
      });
    });

    test('devrait retourner null si le profil n\'existe pas', async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' }
      });

      const result = await getUserProfile('non-existent');

      expect(result).toBeNull();
    });

    test('devrait lancer une erreur si une autre erreur survient', async () => {
      const mockError = { code: 'OTHER_ERROR', message: 'Database error' };
      mockSingle.mockResolvedValue({
        data: null,
        error: mockError
      });

      await expect(getUserProfile('user-123')).rejects.toEqual(mockError);
    });
  });

  describe('createOrUpdateUserProfile', () => {
    test('devrait créer un nouveau profil utilisateur', async () => {
      const mockProfile = {
        user_id: 'user-123',
        email: 'test@example.com',
        role: 'user'
      };

      mockSingle.mockResolvedValue({
        data: mockProfile,
        error: null
      });

      const result = await createOrUpdateUserProfile(
        'user-123',
        'test@example.com',
        'user'
      );

      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'user-123',
          email: 'test@example.com',
          role: 'user',
          updated_at: expect.any(String)
        }),
        {
          onConflict: 'user_id',
          ignoreDuplicates: false
        }
      );
      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        role: 'user'
      });
    });

    test('devrait utiliser le rôle par défaut "user" si non spécifié', async () => {
      const mockProfile = {
        user_id: 'user-123',
        email: 'test@example.com',
        role: 'user'
      };

      mockSingle.mockResolvedValue({
        data: mockProfile,
        error: null
      });

      await createOrUpdateUserProfile('user-123', 'test@example.com');

      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'user'
        }),
        expect.any(Object)
      );
    });

    test('devrait lancer une erreur si le rôle est invalide', async () => {
      await expect(
        createOrUpdateUserProfile('user-123', 'test@example.com', 'invalid-role')
      ).rejects.toThrow('Invalid role');
    });
  });

  describe('updateUserRole', () => {
    test('devrait mettre à jour le rôle d\'un utilisateur', async () => {
      const mockProfile = {
        user_id: 'user-123',
        email: 'test@example.com',
        role: 'moderator'
      };

      mockSingle.mockResolvedValue({
        data: mockProfile,
        error: null
      });

      const result = await updateUserRole('user-123', 'moderator');

      // Vérifier que update a été appelé
      expect(mockUpdate).toHaveBeenCalled();
      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        role: 'moderator'
      });
    });

    test('devrait lancer une erreur si le rôle est invalide', async () => {
      await expect(
        updateUserRole('user-123', 'invalid-role')
      ).rejects.toThrow('Invalid role');
    });

    test('devrait lancer une erreur si l\'utilisateur n\'existe pas', async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: null
      });

      await expect(
        updateUserRole('non-existent', 'admin')
      ).rejects.toThrow('User profile not found');
    });
  });
});

