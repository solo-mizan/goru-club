'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { AdminStats } from '@/components/AdminStats';
import { MembersTable } from '@/components/MembersTable';
import { DepositsTable } from '@/components/DepositsTable';
import { CowPurchasesTable } from '@/components/CowPurchasesTable';
import { PDFExport } from '@/components/PDFExport';
import { AdminLogin } from '@/components/AdminLogin';
import { useTranslations } from '@/context/TranslationsContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function AdminDashboard() {
    const { t } = useTranslations();
    const [activeTab, setActiveTab] = useState('members');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showDepositForm, setShowDepositForm] = useState(false);

    // Check if user was previously authenticated in this session
    useEffect(() => {
        const authStatus = sessionStorage.getItem('hambaAdminAuth');
        if (authStatus === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
        // Store authentication status in session storage
        sessionStorage.setItem('hambaAdminAuth', 'true');
    };

    const handleAddDeposit = () => {
        setActiveTab('deposits');
        setShowDepositForm(true);
    };

    // Show login screen if not authenticated
    if (!isAuthenticated) {
        return <AdminLogin onLogin={handleLogin} />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('adminDashboard.title')}</h1>
                    <p className="text-gray-600">{t('adminDashboard.subtitle')}</p>
                </div>
                <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                    <button
                        onClick={handleAddDeposit}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors"
                    >
                        {t('adminDashboard.addDeposit')}
                    </button>
                    <button
                        onClick={() => {
                            setIsAuthenticated(false);
                            sessionStorage.removeItem('hambaAdminAuth');
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors"
                    >
                        {t('adminDashboard.logout')}
                    </button>
                    <Link href="/" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md shadow-sm transition-colors">
                        {t('general.backToHome')}
                    </Link>
                    <PDFExport />
                    <LanguageSwitcher />
                </div>
            </header>

            <AdminStats />

            <div className="mt-8 bg-white shadow-md rounded-lg">
                <div className="border-b">
                    <nav className="-mb-px flex space-x-6 px-6">
                        <button
                            onClick={() => setActiveTab('members')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'members' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {t('adminDashboard.tabs.members')}
                        </button>
                        <button
                            onClick={() => setActiveTab('deposits')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'deposits' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {t('adminDashboard.tabs.deposits')}
                        </button>
                        <button
                            onClick={() => setActiveTab('cowPurchases')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'cowPurchases' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {t('adminDashboard.tabs.cowPurchases')}
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'members' && <MembersTable />}
                    {activeTab === 'deposits' && <DepositsTable initialShowForm={showDepositForm} onFormToggle={setShowDepositForm} />}
                    {activeTab === 'cowPurchases' && <CowPurchasesTable />}
                </div>
            </div>

            <footer className="mt-16 text-center text-gray-600 pb-8">
                <p>{t('adminDashboard.footer', { year: new Date().getFullYear() })}</p>
            </footer>
        </div>
    );
} 