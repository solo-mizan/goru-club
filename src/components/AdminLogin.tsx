'use client';

import { useState } from 'react';
import { useTranslations } from '@/context/TranslationsContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface AdminLoginProps {
    onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
    const { t } = useTranslations();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Simple admin password - in a real app, this would be handled securely on the server
    const ADMIN_PASSWORD = 'hamba123';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password === ADMIN_PASSWORD) {
            onLogin();
        } else {
            setError(t('adminLogin.incorrectPassword'));
            setPassword('');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">{t('adminLogin.title')}</h1>
                    <p className="mt-2 text-gray-600">{t('adminLogin.subtitle')}</p>
                </div>

                {error && (
                    <div className="px-4 py-3 text-sm text-red-700 bg-red-100 rounded-md" role="alert">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            {t('adminLogin.password')}
                        </label>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder={t('adminLogin.passwordPlaceholder')}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {t('adminLogin.login')}
                        </button>
                    </div>
                </form>

                <div className="mt-4 text-center flex flex-col gap-4">
                    <a href="/" className="text-sm text-blue-600 hover:text-blue-500">
                        {t('general.backToHome')}
                    </a>
                    <div className="flex justify-center">
                        <LanguageSwitcher />
                    </div>
                </div>
            </div>
        </div>
    );
} 