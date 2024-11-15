"use client"

import React, { createContext, useState, useEffect, useMemo } from 'react';

export type Language = 'en' | 'fr' | 'es' | 'nl' | 'de';

interface LanguageContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<string, any>;
  loadTranslations: (language: Language) => void;
}

interface Translations {
    [key: string]: string | Translations | Array<Translations>; // Types pour les traductions (string, object ou array)
}

function replaceVariables(translations: Translations, userName: string, assistantName: string): Translations {
    const replaceValue = (value: any): any => {
        if (typeof value === 'string') {
            return value.replace('{{userName}}', userName).replace('{{assistantName}}', assistantName);
        } else if (Array.isArray(value)) {
            return value.map(replaceValue);
        } else if (typeof value === 'object' && value !== null) {
            const result: Translations = {};
            for (const key in value) {
                if (value.hasOwnProperty(key)) {
                    result[key] = replaceValue(value[key]);
                }
            }
            return result;
        }
        return value;
    };

    return replaceValue(translations);
}

export const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: (string) => {},
  translations: {},
  loadTranslations: () => {}
});

export const LanguageProvider = ({ initLanguage, children }: { initLanguage: Language, children: React.ReactNode }) => {

  const [language, setLanguage] = useState<Language>(initLanguage);

  const [translations, setTranslations] = useState<Record<string, any>>({});

  useEffect(() => {
    loadTranslations(language);
  }, [language]);

  const loadTranslations = async (language: Language) => {
    let translations = await import(`../locales/${language}/text.json`).then(
      (module) => module.default || module
    );
    const assistantName = process.env.NEXT_PUBLIC_ASSISTANT_NAME || 'John GPT';
    const userName = process.env.NEXT_PUBLIC_USER_NAME || 'John';

    translations = replaceVariables(translations, userName, assistantName);
    setTranslations(translations);
  };

  const value = useMemo(() => ({ language, setLanguage, translations, loadTranslations }), [language, translations]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
