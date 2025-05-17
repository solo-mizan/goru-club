'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useTranslations } from '@/context/TranslationsContext';

export function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const { locale, setLocale } = useTranslations();

    const switchLanguage = (newLocale: string) => {
        if (newLocale === locale) return;

        // Extract current route path without locale
        const currentPath = pathname.replace(/^\/(en|bn)/, '') || '/';

        // Navigate to the same route but with new locale
        router.push(`/${newLocale}${currentPath}`);

        // Update the locale in our context
        setLocale(newLocale);
    };

    return (
        <div className="flex items-center space-x-2">
            <select
                value={locale}
                onChange={(e) => switchLanguage(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
                <option value="en">English</option>
                <option value="bn" className="font-hind-siliguri">বাংলা</option>
            </select>
            <span className="text-sm text-gray-500">
                {locale === 'en' ? 'English' : <span className="font-hind-siliguri">বাংলা</span>}
            </span>
        </div>
    );
} 