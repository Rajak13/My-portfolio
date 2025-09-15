export type Language = 'en' | 'ne';

export interface Translation {
  id: string;
  key: string;
  language: Language;
  value: string;
}

export interface TranslationDictionary {
  [key: string]: string;
}

export interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, fallback?: string) => string;
  isLoading: boolean;
  translations: TranslationDictionary;
}

export const SUPPORTED_LANGUAGES: Language[] = ['en', 'ne'];

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  ne: 'नेपाली'
};

export const DEFAULT_LANGUAGE: Language = 'en';