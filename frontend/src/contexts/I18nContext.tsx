import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Locale } from '../i18n/translations';
import { translations } from '../i18n/translations';

type TranslateVariables = Record<string, string | number>;

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, variables?: TranslateVariables) => string;
};

const STORAGE_KEY = 'uf-locale';

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

function resolveStoredLocale(): Locale {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'it' || stored === 'en') {
    return stored;
  }

  return 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => resolveStoredLocale());

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    window.localStorage.setItem(STORAGE_KEY, nextLocale);
  };

  const t = (key: string, variables?: TranslateVariables) => {
    const table = translations[locale];
    let text = table[key] ?? translations.en[key] ?? key;
    if (!variables) {
      return text;
    }

    for (const [name, value] of Object.entries(variables)) {
      text = text.split(`{{${name}}}`).join(String(value));
    }

    return text;
  };

  const value = useMemo(() => ({ locale, setLocale, t }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18nContext() {
  const value = useContext(I18nContext);
  if (!value) {
    throw new Error('useI18nContext must be used within I18nProvider.');
  }

  return value;
}
