'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getTranslations } from '@/lib/i18n/api';
import { getTranslation, getInitialLanguage, storeLanguage } from '@/lib/i18n/utils';
import type { Language, LanguageContextType, TranslationDictionary } from '@/lib/i18n/types';
import { DEFAULT_LANGUAGE } from '@/lib/i18n/types';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
  initialTranslations?: {
    en?: TranslationDictionary;
    ne?: TranslationDictionary;
  };
}

export function LanguageProvider({ children, initialTranslations }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [translations, setTranslations] = useState<TranslationDictionary>({});
  const [fallbackTranslations, setFallbackTranslations] = useState<TranslationDictionary>({});
  const [isLoading, setIsLoading] = useState(true);

  // Initialize language on mount
  useEffect(() => {
    const initialLang = getInitialLanguage();
    setCurrentLanguage(initialLang);
  }, []);

  // Load translations when language changes
  useEffect(() => {
    async function loadTranslations() {
      setIsLoading(true);
      
      try {
        // Load current language translations
        let currentTranslations: TranslationDictionary;
        if (initialTranslations?.[currentLanguage]) {
          currentTranslations = initialTranslations[currentLanguage];
        } else {
          currentTranslations = await getTranslations(currentLanguage);
        }
        
        setTranslations(currentTranslations);

        // Load fallback translations (English) if current language is not English
        if (currentLanguage !== DEFAULT_LANGUAGE) {
          let fallback: TranslationDictionary;
          if (initialTranslations?.en) {
            fallback = initialTranslations.en;
          } else {
            fallback = await getTranslations(DEFAULT_LANGUAGE);
          }
          setFallbackTranslations(fallback);
        } else {
          setFallbackTranslations({});
        }
      } catch (error) {
        console.error('Error loading translations:', error);
        // Set empty translations on error
        setTranslations({});
        setFallbackTranslations({});
      } finally {
        setIsLoading(false);
      }
    }

    loadTranslations();
  }, [currentLanguage, initialTranslations]);

  const setLanguage = useCallback((language: Language) => {
    setCurrentLanguage(language);
    storeLanguage(language);
  }, []);

  const t = useCallback((key: string, fallback?: string): string => {
    return getTranslation(key, translations, fallbackTranslations, fallback);
  }, [translations, fallbackTranslations]);

  const contextValue: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t,
    isLoading,
    translations
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}