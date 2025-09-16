import { supabase } from '@/lib/supabase/client';
import type { Language, Translation, TranslationDictionary } from './types';

/**
 * Fetch translations for a specific language from Supabase
 */
export async function getTranslations(
  language: Language,
  isServer = false
): Promise<TranslationDictionary> {
  try {
    let client;
    if (isServer) {
      // Dynamically import server client only when needed
      const { createServerClient } = await import('@/lib/supabase/server');
      client = createServerClient();
    } else {
      client = supabase;
    }
    
    const { data, error } = await client
      .from('translations')
      .select('key, value')
      .eq('language', language);

    if (error) {
      console.error('Error fetching translations:', error);
      return {};
    }

    // Convert array to dictionary
    const dictionary: TranslationDictionary = {};
    data?.forEach((translation: { key: string; value: string }) => {
      dictionary[translation.key] = translation.value;
    });

    return dictionary;
  } catch (error) {
    console.error('Error in getTranslations:', error);
    return {};
  }
}

/**
 * Wrapper functions for dashboard usage
 */
export async function createTranslation(input: Omit<Translation, 'id'>): Promise<Translation> {
  const result = await upsertTranslation(input.key, input.language, input.value)
  if (!result) {
    throw new Error('Failed to create translation')
  }
  return result
}

export async function updateTranslation(id: string, input: Omit<Translation, 'id'>): Promise<Translation> {
  const result = await upsertTranslation(input.key, input.language, input.value)
  if (!result) {
    throw new Error('Failed to update translation')
  }
  return result
}

/**
 * Get all translations for management purposes
 */
export async function getAllTranslations(): Promise<Translation[]> {
  try {
    
    const { data, error } = await supabase
      .from('translations')
      .select('*')
      .order('key', { ascending: true });

    if (error) {
      console.error('Error fetching all translations:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllTranslations:', error);
    return [];
  }
}

/**
 * Create or update a translation
 */
export async function upsertTranslation(
  key: string,
  language: Language,
  value: string
): Promise<Translation | null> {
  try {
    
    const { data, error } = await supabase
      .from('translations')
      .upsert({ key, language, value } as any)
      .select()
      .single();

    if (error) {
      console.error('Error upserting translation:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in upsertTranslation:', error);
    return null;
  }
}

/**
 * Delete a translation
 */
export async function deleteTranslation(
  key: string,
  language: Language
): Promise<boolean> {
  try {
    
    const { error } = await supabase
      .from('translations')
      .delete()
      .eq('key', key)
      .eq('language', language);

    if (error) {
      console.error('Error deleting translation:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteTranslation:', error);
    return false;
  }
}

/**
 * Get translation keys that are missing for a specific language
 */
export async function getMissingTranslations(language: Language): Promise<string[]> {
  try {
    
    // Get all unique keys
    const { data: allKeys, error: keysError } = await supabase
      .from('translations')
      .select('key')
      .neq('key', null);

    if (keysError) {
      console.error('Error fetching translation keys:', keysError);
      return [];
    }

    // Get keys for the specific language
    const { data: languageKeys, error: langError } = await supabase
      .from('translations')
      .select('key')
      .eq('language', language);

    if (langError) {
      console.error('Error fetching language keys:', langError);
      return [];
    }

    const allUniqueKeys = Array.from(new Set(allKeys?.map((item: { key: string }) => item.key) || []));
    const existingKeys = new Set(languageKeys?.map((item: { key: string }) => item.key) || []);
    
    return allUniqueKeys.filter((key: string) => !existingKeys.has(key));
  } catch (error) {
    console.error('Error in getMissingTranslations:', error);
    return [];
  }
}