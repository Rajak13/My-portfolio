'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  getAllTranslations, 
  upsertTranslation, 
  deleteTranslation, 
  getMissingTranslations 
} from '@/lib/i18n/api';
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES } from '@/lib/i18n/types';
import type { Translation, Language } from '@/lib/i18n/types';

interface TranslationGroup {
  key: string;
  translations: Record<Language, string>;
}

export function TranslationEditor() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [groupedTranslations, setGroupedTranslations] = useState<TranslationGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [missingTranslations, setMissingTranslations] = useState<Record<Language, string[]>>({
    en: [],
    ne: []
  });

  const loadTranslations = async () => {
    setIsLoading(true);
    try {
      const data = await getAllTranslations();
      setTranslations(data);
      
      // Load missing translations for each language
      const missing: Record<Language, string[]> = { en: [], ne: [] };
      for (const lang of SUPPORTED_LANGUAGES) {
        missing[lang] = await getMissingTranslations(lang);
      }
      setMissingTranslations(missing);
    } catch (error) {
      console.error('Error loading translations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const groupTranslations = useCallback(() => {
    const groups: Record<string, TranslationGroup> = {};
    
    translations.forEach((translation) => {
      if (!groups[translation.key]) {
        groups[translation.key] = {
          key: translation.key,
          translations: { en: '', ne: '' }
        };
      }
      groups[translation.key].translations[translation.language] = translation.value;
    });

    const groupedArray = Object.values(groups).sort((a, b) => a.key.localeCompare(b.key));
    setGroupedTranslations(groupedArray);
  }, [translations]);

  useEffect(() => {
    loadTranslations();
  }, []);

  useEffect(() => {
    groupTranslations();
  }, [translations, groupTranslations]);

  const handleSaveTranslation = async (key: string, language: Language, value: string) => {
    setIsSaving(true);
    try {
      await upsertTranslation(key, language, value);
      await loadTranslations(); // Reload to get updated data
    } catch (error) {
      console.error('Error saving translation:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTranslation = async (key: string, language: Language) => {
    if (!confirm(`Are you sure you want to delete the ${LANGUAGE_NAMES[language]} translation for "${key}"?`)) {
      return;
    }

    setIsSaving(true);
    try {
      await deleteTranslation(key, language);
      await loadTranslations();
    } catch (error) {
      console.error('Error deleting translation:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNewTranslation = async () => {
    if (!newKey.trim()) return;

    setIsSaving(true);
    try {
      await upsertTranslation(newKey.trim(), selectedLanguage, '');
      setNewKey('');
      await loadTranslations();
    } catch (error) {
      console.error('Error adding new translation:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredTranslations = groupedTranslations.filter(group =>
    group.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    Object.values(group.translations).some(value => 
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading translations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Translation Management
        </h2>
        <div className="flex gap-2">
          <button
            onClick={loadTranslations}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Missing translations alert */}
      {Object.values(missingTranslations).some(arr => arr.length > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">Missing Translations</h3>
          {SUPPORTED_LANGUAGES.map(lang => (
            missingTranslations[lang].length > 0 && (
              <div key={lang} className="text-sm text-yellow-700">
                <strong>{LANGUAGE_NAMES[lang]}:</strong> {missingTranslations[lang].length} missing
              </div>
            )
          ))}
        </div>
      )}

      {/* Add new translation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Add New Translation Key
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="Enter translation key (e.g., 'hero.title')"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as Language)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang} value={lang}>{LANGUAGE_NAMES[lang]}</option>
            ))}
          </select>
          <button
            onClick={handleAddNewTranslation}
            disabled={!newKey.trim() || isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search translations..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Translations list */}
      <div className="space-y-4">
        {filteredTranslations.map((group) => (
          <TranslationRow
            key={group.key}
            group={group}
            onSave={handleSaveTranslation}
            onDelete={handleDeleteTranslation}
            isSaving={isSaving}
          />
        ))}
        
        {filteredTranslations.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {searchTerm ? 'No translations found matching your search.' : 'No translations found.'}
          </div>
        )}
      </div>
    </div>
  );
}

interface TranslationRowProps {
  group: TranslationGroup;
  onSave: (key: string, language: Language, value: string) => Promise<void>;
  onDelete: (key: string, language: Language) => Promise<void>;
  isSaving: boolean;
}

function TranslationRow({ group, onSave, onDelete, isSaving }: TranslationRowProps) {
  const [editingValues, setEditingValues] = useState<Record<Language, string>>(group.translations);
  const [hasChanges, setHasChanges] = useState<Record<Language, boolean>>({ en: false, ne: false });

  useEffect(() => {
    setEditingValues(group.translations);
    setHasChanges({ en: false, ne: false });
  }, [group.translations]);

  const handleValueChange = (language: Language, value: string) => {
    setEditingValues(prev => ({ ...prev, [language]: value }));
    setHasChanges(prev => ({ 
      ...prev, 
      [language]: value !== group.translations[language] 
    }));
  };

  const handleSave = async (language: Language) => {
    await onSave(group.key, language, editingValues[language]);
    setHasChanges(prev => ({ ...prev, [language]: false }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="mb-3">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white font-mono">
          {group.key}
        </h4>
      </div>
      
      <div className="space-y-3">
        {SUPPORTED_LANGUAGES.map((language) => (
          <div key={language} className="flex items-start gap-2">
            <div className="w-16 flex-shrink-0">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {LANGUAGE_NAMES[language]}
              </span>
            </div>
            <div className="flex-1">
              <textarea
                value={editingValues[language] || ''}
                onChange={(e) => handleValueChange(language, e.target.value)}
                placeholder={`Enter ${LANGUAGE_NAMES[language]} translation...`}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                rows={2}
              />
            </div>
            <div className="flex gap-1">
              {hasChanges[language] && (
                <button
                  onClick={() => handleSave(language)}
                  disabled={isSaving}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                >
                  Save
                </button>
              )}
              {group.translations[language] && (
                <button
                  onClick={() => onDelete(group.key, language)}
                  disabled={isSaving}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}