import type { Language, TranslationDictionary } from './types';
import { DEFAULT_LANGUAGE } from './types';

/**
 * Get translation with fallback logic
 */
export function getTranslation(
  key: string,
  translations: TranslationDictionary,
  fallbackTranslations?: TranslationDictionary,
  fallback?: string
): string {
  // First try the current language
  if (translations[key]) {
    return translations[key];
  }

  // Then try fallback translations (usually English)
  if (fallbackTranslations && fallbackTranslations[key]) {
    return fallbackTranslations[key];
  }

  // Finally use provided fallback or the key itself
  return fallback || key;
}

/**
 * Get browser language preference
 */
export function getBrowserLanguage(): Language {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  const browserLang = navigator.language.toLowerCase();
  
  // Check for Nepali
  if (browserLang.startsWith('ne')) {
    return 'ne';
  }

  // Default to English
  return 'en';
}

/**
 * Get language from localStorage
 */
export function getStoredLanguage(): Language | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem('preferred-language');
    if (stored && (stored === 'en' || stored === 'ne')) {
      return stored as Language;
    }
  } catch (error) {
    console.error('Error reading language from localStorage:', error);
  }

  return null;
}

/**
 * Store language preference in localStorage
 */
export function storeLanguage(language: Language): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem('preferred-language', language);
  } catch (error) {
    console.error('Error storing language in localStorage:', error);
  }
}

/**
 * Get initial language based on stored preference, browser, or default
 */
export function getInitialLanguage(): Language {
  // First check stored preference
  const stored = getStoredLanguage();
  if (stored) {
    return stored;
  }

  // Then check browser preference
  const browser = getBrowserLanguage();
  if (browser) {
    return browser;
  }

  // Finally default
  return DEFAULT_LANGUAGE;
}

/**
 * Validate if a string is a supported language
 */
export function isValidLanguage(lang: string): lang is Language {
  return lang === 'en' || lang === 'ne';
}

/**
 * Format language for display
 */
export function formatLanguageDisplay(language: Language): string {
  const names = {
    en: 'English',
    ne: 'नेपाली'
  };
  return names[language];
}

/**
 * Get opposite language (for toggle functionality)
 */
export function getOppositeLanguage(current: Language): Language {
  return current === 'en' ? 'ne' : 'en';
}