'use client';

import React from 'react';
import { useLanguage } from '@/lib/providers/LanguageProvider';
import { LanguageSwitcher } from './LanguageSwitcher';

/**
 * Test component to verify i18n functionality
 * This can be used during development to test translations
 */
export function TranslationTest() {
  const { t, currentLanguage, isLoading } = useLanguage();

  if (isLoading) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
        <p>Loading translations...</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 space-y-4">
      <h3 className="text-lg font-semibold">Translation Test</h3>
      
      <div className="flex items-center gap-4">
        <span>Current Language: <strong>{currentLanguage}</strong></span>
        <LanguageSwitcher variant="toggle" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Navigation</h4>
          <ul className="space-y-1 text-sm">
            <li>{t('nav.home', 'Home')}</li>
            <li>{t('nav.projects', 'Projects')}</li>
            <li>{t('nav.blog', 'Blog')}</li>
            <li>{t('nav.about', 'About')}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-2">Common UI</h4>
          <ul className="space-y-1 text-sm">
            <li>{t('common.save', 'Save')}</li>
            <li>{t('common.cancel', 'Cancel')}</li>
            <li>{t('common.edit', 'Edit')}</li>
            <li>{t('common.search', 'Search')}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-2">Hero Section</h4>
          <ul className="space-y-1 text-sm">
            <li>{t('hero.title', 'Welcome to My Portfolio')}</li>
            <li className="text-xs text-gray-600 dark:text-gray-400">
              {t('hero.subtitle', 'Crafting digital experiences with passion and precision')}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-2">Fallback Test</h4>
          <ul className="space-y-1 text-sm">
            <li>{t('nonexistent.key', 'This is a fallback')}</li>
            <li>{t('another.missing.key')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}