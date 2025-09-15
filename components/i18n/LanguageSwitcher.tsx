'use client';

import React from 'react';
import { useLanguage } from '@/lib/providers/LanguageProvider';
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES } from '@/lib/i18n/types';
import type { Language } from '@/lib/i18n/types';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'toggle' | 'buttons';
  className?: string;
  showLabels?: boolean;
}

export function LanguageSwitcher({ 
  variant = 'dropdown', 
  className = '',
  showLabels = true 
}: LanguageSwitcherProps) {
  const { currentLanguage, setLanguage, isLoading } = useLanguage();

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-gray-200 rounded ${className}`}>
        <div className="h-8 w-20"></div>
      </div>
    );
  }

  const handleLanguageChange = (language: Language) => {
    setLanguage(language);
  };

  if (variant === 'toggle') {
    const otherLanguage = currentLanguage === 'en' ? 'ne' : 'en';
    
    return (
      <button
        onClick={() => handleLanguageChange(otherLanguage)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-md
          bg-gray-100 hover:bg-gray-200 
          dark:bg-gray-800 dark:hover:bg-gray-700
          transition-colors duration-200
          ${className}
        `}
        aria-label={`Switch to ${LANGUAGE_NAMES[otherLanguage]}`}
      >
        <span className="text-sm font-medium">
          {showLabels ? LANGUAGE_NAMES[currentLanguage] : currentLanguage.toUpperCase()}
        </span>
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" 
          />
        </svg>
      </button>
    );
  }

  if (variant === 'buttons') {
    return (
      <div className={`flex gap-1 ${className}`}>
        {SUPPORTED_LANGUAGES.map((language) => (
          <button
            key={language}
            onClick={() => handleLanguageChange(language)}
            className={`
              px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
              ${currentLanguage === language
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }
            `}
            aria-pressed={currentLanguage === language}
          >
            {showLabels ? LANGUAGE_NAMES[language] : language.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  // Default dropdown variant
  return (
    <select
      value={currentLanguage}
      onChange={(e) => handleLanguageChange(e.target.value as Language)}
      className={`
        px-3 py-2 text-sm font-medium rounded-md border
        bg-white border-gray-300 text-gray-700
        dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        transition-colors duration-200
        ${className}
      `}
      aria-label="Select language"
    >
      {SUPPORTED_LANGUAGES.map((language) => (
        <option key={language} value={language}>
          {showLabels ? LANGUAGE_NAMES[language] : language.toUpperCase()}
        </option>
      ))}
    </select>
  );
}