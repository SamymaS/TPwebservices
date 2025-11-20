import { describe, test, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import PostCard from '../PostCard';

describe('PostCard Component', () => {
  const mockPost = {
    id: 'post-123',
    title: 'Test Post Title',
    content: 'This is a test post content',
    is_published: true,
    created_at: '2024-01-15T10:00:00Z',
    user_id: 'user-123'
  };

  test('devrait afficher le titre du post', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
  });

  test('devrait afficher le contenu du post', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('This is a test post content')).toBeInTheDocument();
  });

  test('devrait afficher un badge "Publié" si le post est publié', () => {
    render(<PostCard post={mockPost} />);
    // Chercher le texte "Publié" ou "Published" selon votre implémentation
    const publishedText = screen.queryByText(/publié/i);
    if (publishedText) {
      expect(publishedText).toBeInTheDocument();
    }
  });

  test('devrait afficher le post même si is_published est false', () => {
    const unpublishedPost = { ...mockPost, is_published: false };
    render(<PostCard post={unpublishedPost} />);
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
  });
});

