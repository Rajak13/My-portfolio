# Internationalization (i18n) System

This directory contains the internationalization system for the multilingual portfolio, supporting English and Nepali languages.

## Features

- **Language Provider**: React context for managing current language and translations
- **Translation Loading**: Utilities to fetch translations from Supabase database
- **Fallback Logic**: Automatic fallback to English when translations are missing
- **Language Switcher**: UI component for switching between languages
- **Translation Editor**: Dashboard component for managing translations
- **Persistence**: Language preference stored in localStorage

## Usage

### Basic Translation

```tsx
import { useLanguage } from '@/lib/i18n';

function MyComponent() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('hero.title', 'Welcome to My Portfolio')}</h1>
      <p>{t('hero.subtitle')}</p>
    </div>
  );
}
```

### Language Switcher

```tsx
import { LanguageSwitcher } from '@/components/i18n';

function Header() {
  return (
    <header>
      <LanguageSwitcher variant="toggle" />
    </header>
  );
}
```

### Translation Management

```tsx
import { TranslationEditor } from '@/components/i18n';

function TranslationsPage() {
  return (
    <div>
      <h1>Manage Translations</h1>
      <TranslationEditor />
    </div>
  );
}
```

## Database Setup

The system uses a `translations` table in Supabase with the following structure:

```sql
CREATE TABLE translations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT NOT NULL,
  language language_code NOT NULL,
  value TEXT NOT NULL,
  UNIQUE(key, language)
);
```

## Seeding Translations

Use the provided seed file to populate initial translations:

```bash
psql -f supabase/translations_seed.sql
```

## Supported Languages

- English (`en`)
- Nepali (`ne`)

## Files

- `types.ts` - TypeScript interfaces and types
- `api.ts` - Supabase API functions for translations
- `utils.ts` - Utility functions for language handling
- `../providers/LanguageProvider.tsx` - React context provider
- `../components/i18n/LanguageSwitcher.tsx` - Language switcher component
- `../components/i18n/TranslationEditor.tsx` - Translation management component
- `../components/i18n/TranslationTest.tsx` - Test component for development