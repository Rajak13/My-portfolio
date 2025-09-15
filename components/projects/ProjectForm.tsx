'use client';

/**
 * ProjectForm Component
 * 
 * Form component for creating and editing projects with validation and media integration
 */

import { useState, useEffect } from 'react';
import { Project, CreateProjectInput, UpdateProjectInput, generateSlug } from '@/lib/projects';
import { MediaPicker, ImageOptimized } from '@/components/media';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: CreateProjectInput | UpdateProjectInput) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

interface FormData {
  title: string;
  slug: string;
  description: string;
  cover_path: string;
  github_url: string;
  live_demo_url: string;
  tags: string[];
  tech_stack: string[];
  duration: string;
  role: string;
  published: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export function ProjectForm({
  project,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProjectFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    description: '',
    cover_path: '',
    github_url: '',
    live_demo_url: '',
    tags: [],
    tech_stack: [],
    duration: '',
    role: '',
    published: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [tagInput, setTagInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true);

  const isEditing = !!project;

  // Initialize form data when project prop changes
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        slug: project.slug,
        description: project.description || '',
        cover_path: project.cover_path || '',
        github_url: project.github_url || '',
        live_demo_url: project.live_demo_url || '',
        tags: project.tags || [],
        tech_stack: project.metadata.tech_stack || [],
        duration: project.metadata.duration || '',
        role: project.metadata.role || '',
        published: project.published,
      });
      setAutoGenerateSlug(false);
    }
  }, [project]);

  // Auto-generate slug from title
  useEffect(() => {
    if (autoGenerateSlug && formData.title && !isEditing) {
      const newSlug = generateSlug(formData.title);
      setFormData(prev => ({ ...prev, slug: newSlug }));
    }
  }, [formData.title, autoGenerateSlug, isEditing]);

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Handle slug auto-generation
    if (field === 'slug' && typeof value === 'string') {
      setAutoGenerateSlug(value === '');
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addTech = () => {
    const tech = techInput.trim();
    if (tech && !formData.tech_stack.includes(tech)) {
      setFormData(prev => ({
        ...prev,
        tech_stack: [...prev.tech_stack, tech]
      }));
      setTechInput('');
    }
  };

  const removeTech = (techToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tech_stack: prev.tech_stack.filter(tech => tech !== techToRemove)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
    }

    if (formData.github_url && !/^https?:\/\/.+/.test(formData.github_url)) {
      newErrors.github_url = 'GitHub URL must be a valid URL';
    }

    if (formData.live_demo_url && !/^https?:\/\/.+/.test(formData.live_demo_url)) {
      newErrors.live_demo_url = 'Demo URL must be a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const submitData: CreateProjectInput | UpdateProjectInput = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim() || undefined,
        cover_path: formData.cover_path || undefined,
        github_url: formData.github_url.trim() || undefined,
        live_demo_url: formData.live_demo_url.trim() || undefined,
        tags: formData.tags,
        metadata: {
          tech_stack: formData.tech_stack,
          duration: formData.duration.trim() || undefined,
          role: formData.role.trim() || undefined,
        },
        published: formData.published,
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Project' : 'Create New Project'}
          </h1>
          <div className="flex items-center gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                disabled={isLoading}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Project' : 'Create Project'
              )}
            </button>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Title */}
          <div className="sm:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                errors.title
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400'
              }`}
              placeholder="Enter project title"
              disabled={isLoading}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Slug */}
          <div className="sm:col-span-2">
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Slug *
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400">
                /projects/
              </span>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className={`block w-full rounded-none rounded-r-md border px-3 py-2 focus:outline-none focus:ring-1 sm:text-sm ${
                  errors.slug
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400'
                }`}
                placeholder="project-slug"
                disabled={isLoading}
              />
            </div>
            {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              URL-friendly version of the title. Use lowercase letters, numbers, and hyphens only.
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
            placeholder="Describe your project..."
            disabled={isLoading}
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cover Image
          </label>
          {formData.cover_path ? (
            <div className="relative">
              <ImageOptimized
                src={formData.cover_path}
                alt="Cover preview"
                width={800}
                height={192}
                className="h-48 w-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => handleInputChange('cover_path', '')}
                className="absolute top-2 right-2 rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
                disabled={isLoading}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowMediaPicker(true)}
              className="flex h-48 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
              disabled={isLoading}
            >
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Click to select cover image</p>
              </div>
            </button>
          )}
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* GitHub URL */}
          <div>
            <label htmlFor="github_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              GitHub URL
            </label>
            <input
              type="url"
              id="github_url"
              value={formData.github_url}
              onChange={(e) => handleInputChange('github_url', e.target.value)}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                errors.github_url
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400'
              }`}
              placeholder="https://github.com/username/repo"
              disabled={isLoading}
            />
            {errors.github_url && <p className="mt-1 text-sm text-red-600">{errors.github_url}</p>}
          </div>

          {/* Live Demo URL */}
          <div>
            <label htmlFor="live_demo_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Live Demo URL
            </label>
            <input
              type="url"
              id="live_demo_url"
              value={formData.live_demo_url}
              onChange={(e) => handleInputChange('live_demo_url', e.target.value)}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                errors.live_demo_url
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400'
              }`}
              placeholder="https://example.com"
              disabled={isLoading}
            />
            {errors.live_demo_url && <p className="mt-1 text-sm text-red-600">{errors.live_demo_url}</p>}
          </div>
        </div>

        {/* Project Metadata */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Duration
            </label>
            <input
              type="text"
              id="duration"
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
              placeholder="e.g., 2 weeks, 3 months"
              disabled={isLoading}
            />
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              My Role
            </label>
            <input
              type="text"
              id="role"
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
              placeholder="e.g., Full-stack Developer, Designer"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
              placeholder="Add a tag and press Enter"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={addTag}
              className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              disabled={isLoading}
            >
              Add
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                    disabled={isLoading}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tech Stack
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
              placeholder="Add a technology and press Enter"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={addTech}
              className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              disabled={isLoading}
            >
              Add
            </button>
          </div>
          {formData.tech_stack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tech_stack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 rounded-md bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTech(tech)}
                    className="text-green-600 hover:text-green-800 dark:text-green-300 dark:hover:text-green-100"
                    disabled={isLoading}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Publishing */}
        <div className="flex items-center">
          <input
            id="published"
            type="checkbox"
            checked={formData.published}
            onChange={(e) => handleInputChange('published', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
            disabled={isLoading}
          />
          <label htmlFor="published" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Publish this project (make it visible on the public site)
          </label>
        </div>
      </form>

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-4xl w-full mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Select Cover Image
                </h3>
                <button
                  onClick={() => setShowMediaPicker(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <MediaPicker
                onChange={(media) => {
                  if (media) {
                    handleInputChange('cover_path', media.path);
                  }
                  setShowMediaPicker(false);
                }}
                placeholder="Select a cover image for your project"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}