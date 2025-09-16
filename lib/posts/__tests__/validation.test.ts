/**
 * Post Validation Tests
 */

import { 
  validateCreatePost, 
  generateSlug, 
  generateExcerpt
} from '../validation';
import { CreatePostInput } from '../types';

describe('Post Validation', () => {
  describe('validateCreatePost', () => {
    it('should validate a valid post input', () => {
      const input: CreatePostInput = {
        title: 'Test Post',
        slug: 'test-post',
        body: 'This is a test post content.',
        language: 'en'
      };

      const result = validateCreatePost(input);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should require title', () => {
      const input: CreatePostInput = {
        title: '',
        slug: 'test-post',
        body: 'Content'
      };

      const result = validateCreatePost(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'title',
        message: 'Title is required'
      });
    });

    it('should require slug', () => {
      const input: CreatePostInput = {
        title: 'Test',
        slug: '',
        body: 'Content'
      };

      const result = validateCreatePost(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'slug',
        message: 'Slug is required'
      });
    });

    it('should require body', () => {
      const input: CreatePostInput = {
        title: 'Test',
        slug: 'test',
        body: ''
      };

      const result = validateCreatePost(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'body',
        message: 'Post content is required'
      });
    });
  });

  describe('generateSlug', () => {
    it('should generate slug from title', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
      expect(generateSlug('Test Post 123')).toBe('test-post-123');
      expect(generateSlug('Special!@# Characters')).toBe('special-characters');
    });
  });

  describe('generateExcerpt', () => {
    it('should generate excerpt from markdown', () => {
      const markdown = '# Heading\n\nThis is **bold** text with *italic* and `code`.';
      const excerpt = generateExcerpt(markdown, 50);
      expect(excerpt).toBe('Heading This is bold text with italic and code.');
    });
  });
});