/**
 * Project Validation Tests
 * 
 * Unit tests for project validation functions
 */

import { 
  validateCreateProject, 
  validateUpdateProject, 
  generateSlug, 
  sanitizeProjectInput 
} from '../validation';
import { CreateProjectInput, UpdateProjectInput } from '../types';

// Simple test runner for validation
console.log('Running project validation tests...');

describe('Project Validation', () => {
  describe('validateCreateProject', () => {
    it('should validate a valid project input', () => {
      const input: CreateProjectInput = {
        title: 'Test Project',
        slug: 'test-project',
        description: 'A test project',
        tags: ['test', 'project'],
        metadata: {
          tech_stack: ['React', 'TypeScript'],
          duration: '2 weeks',
          role: 'Developer'
        }
      };

      const result = validateCreateProject(input);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should require title and slug', () => {
      const input: CreateProjectInput = {
        title: '',
        slug: '',
      };

      const result = validateCreateProject(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'title', message: 'Title is required' }),
          expect.objectContaining({ field: 'slug', message: 'Slug is required' })
        ])
      );
    });

    it('should validate slug format', () => {
      const input: CreateProjectInput = {
        title: 'Test Project',
        slug: 'Invalid Slug!',
      };

      const result = validateCreateProject(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ 
            field: 'slug', 
            message: 'Slug must contain only lowercase letters, numbers, and hyphens' 
          })
        ])
      );
    });

    it('should validate URL formats', () => {
      const input: CreateProjectInput = {
        title: 'Test Project',
        slug: 'test-project',
        github_url: 'invalid-url',
        live_demo_url: 'also-invalid'
      };

      const result = validateCreateProject(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'github_url', message: 'GitHub URL must be a valid URL' }),
          expect.objectContaining({ field: 'live_demo_url', message: 'Live demo URL must be a valid URL' })
        ])
      );
    });

    it('should validate tags limit', () => {
      const input: CreateProjectInput = {
        title: 'Test Project',
        slug: 'test-project',
        tags: Array(15).fill('tag') // More than 10 tags
      };

      const result = validateCreateProject(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'tags', message: 'Maximum 10 tags allowed' })
        ])
      );
    });
  });

  describe('validateUpdateProject', () => {
    it('should validate partial updates', () => {
      const input: UpdateProjectInput = {
        title: 'Updated Title'
      };

      const result = validateUpdateProject(input);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate provided fields only', () => {
      const input: UpdateProjectInput = {
        slug: 'Invalid Slug!'
      };

      const result = validateUpdateProject(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ 
            field: 'slug', 
            message: 'Slug must contain only lowercase letters, numbers, and hyphens' 
          })
        ])
      );
    });
  });

  describe('generateSlug', () => {
    it('should generate valid slugs from titles', () => {
      expect(generateSlug('My Awesome Project')).toBe('my-awesome-project');
      expect(generateSlug('Project with Special Characters!')).toBe('project-with-special-characters');
      expect(generateSlug('  Spaces  and   Multiple   Spaces  ')).toBe('spaces-and-multiple-spaces');
      expect(generateSlug('Numbers 123 and Symbols @#$')).toBe('numbers-123-and-symbols');
    });

    it('should handle edge cases', () => {
      expect(generateSlug('')).toBe('');
      expect(generateSlug('   ')).toBe('');
      expect(generateSlug('---')).toBe('');
      expect(generateSlug('a')).toBe('a');
    });
  });

  describe('sanitizeProjectInput', () => {
    it('should trim string fields', () => {
      const input: CreateProjectInput = {
        title: '  Test Project  ',
        slug: '  test-project  ',
        description: '  A test description  ',
        github_url: '  https://github.com/test  ',
        live_demo_url: '  https://demo.test  '
      };

      const sanitized = sanitizeProjectInput(input);
      expect(sanitized.title).toBe('Test Project');
      expect(sanitized.slug).toBe('test-project');
      expect(sanitized.description).toBe('A test description');
      expect(sanitized.github_url).toBe('https://github.com/test');
      expect(sanitized.live_demo_url).toBe('https://demo.test');
    });

    it('should clean and deduplicate tags', () => {
      const input: CreateProjectInput = {
        title: 'Test Project',
        slug: 'test-project',
        tags: ['  tag1  ', 'tag2', '', 'tag1', '  tag3  ']
      };

      const sanitized = sanitizeProjectInput(input);
      expect(sanitized.tags).toEqual(['tag1', 'tag2', 'tag3']);
    });

    it('should convert slug to lowercase', () => {
      const input: CreateProjectInput = {
        title: 'Test Project',
        slug: 'Test-Project'
      };

      const sanitized = sanitizeProjectInput(input);
      expect(sanitized.slug).toBe('test-project');
    });
  });
});