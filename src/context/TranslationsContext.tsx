'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the context structure
type TranslationsContextType = {
    locale: string;
    setLocale: (locale: string) => void;
    t: (key: string, params?: Record<string, any>) => string;
};

// Create context with default values
const TranslationsContext = createContext<TranslationsContextType>({
    locale: 'en',
    setLocale: () => { },
    t: (key) => key,
});

// Custom hook to use translations
export const useTranslations = () => useContext(TranslationsContext);

// Provider component
export function TranslationsProvider({
    children,
    initialLocale = 'en'
}: {
    children: React.ReactNode;
    initialLocale?: string;
}) {
    const [locale, setLocale] = useState(initialLocale);
    const [translations, setTranslations] = useState<Record<string, any>>({});

    useEffect(() => {
        // Load translations for the current locale
        const loadTranslations = async () => {
            try {
                const messages = await import(`../messages/${locale}.json`);
                setTranslations(messages.default);
            } catch (error) {
                console.error(`Failed to load translations for ${locale}`, error);
                // Fallback to English
                const fallback = await import('../messages/en.json');
                setTranslations(fallback.default);
            }
        };

        loadTranslations();
    }, [locale]);

    // Function to translate a key
    const t = (key: string, params: Record<string, any> = {}): string => {
        // Handle nested keys like 'user.name'
        const keys = key.split('.');
        let value = translations;

        // Navigate through the nested structure
        for (const k of keys) {
            if (!value || typeof value !== 'object') return key;
            value = value[k];
        }

        if (typeof value !== 'string') return key;

        // Replace parameters like {name} with actual values
        let result = value as string;
        Object.entries(params).forEach(([param, val]) => {
            result = result.replace(new RegExp(`{${param}}`, 'g'), String(val));
        });

        return result;
    };

    const contextValue = {
        locale,
        setLocale,
        t,
    };

    return (
        <TranslationsContext.Provider value={contextValue}>
            {children}
        </TranslationsContext.Provider>
    );
} 