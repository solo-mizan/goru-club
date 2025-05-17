import { createTranslator } from 'next-intl';

export const locales = ['en', 'bn'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

// We use a simple function to help us translate content
export async function getTranslations(locale: Locale, namespace: string) {
    try {
        const messages = (await import(`./messages/${locale}.json`)).default;
        const translate = createTranslator({ locale, messages, namespace });
        return translate;
    } catch (error) {
        console.error(`Failed to load translations for ${locale}`, error);
        // Fallback to English
        const fallbackMessages = (await import('./messages/en.json')).default;
        const translate = createTranslator({ locale: 'en', messages: fallbackMessages, namespace });
        return translate;
    }
} 