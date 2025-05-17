'use client';

import { useState, useEffect } from 'react';

type DepositStats = {
    totalDeposit: number;
    membersWithDeposits: number;
    totalMembers: number;
}

type CowPurchaseStats = {
    totalCowPurchases: number;
    totalAmountSpent: number;
}

export function Stats() {
    const [depositStats, setDepositStats] = useState<DepositStats | null>(null);
    const [cowPurchaseStats, setCowPurchaseStats] = useState<CowPurchaseStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchStats() {
            try {
                // Fetch deposit stats
                const depositResponse = await fetch('http://localhost:5000/api/deposits/summary/stats');
                if (!depositResponse.ok) {
                    throw new Error('Failed to fetch deposit stats');
                }

                // Fetch cow purchase stats
                const cowPurchaseResponse = await fetch('http://localhost:5000/api/cow-purchases/summary/stats');
                if (!cowPurchaseResponse.ok) {
                    throw new Error('Failed to fetch cow purchase stats');
                }

                const depositData = await depositResponse.json();
                const cowPurchaseData = await cowPurchaseResponse.json();

                setDepositStats(depositData);
                setCowPurchaseStats(cowPurchaseData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching stats:', err);
                setError('Failed to load statistics. Please try again later.');
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    if (loading) {
        return <div className="flex justify-center p-4">Loading statistics...</div>;
    }

    if (error) {
        return <div className="text-red-500 p-4">{error}</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Deposits</h3>
                <p className="text-3xl font-bold text-blue-600">
                    ৳ {depositStats?.totalDeposit.toFixed(2) || '0.00'}
                </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Active Members</h3>
                <p className="text-3xl font-bold text-green-600">
                    {depositStats?.membersWithDeposits || 0}
                    <span className="text-lg font-normal text-gray-500">
                        / {depositStats?.totalMembers || 0}
                    </span>
                </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Cows Purchased</h3>
                <p className="text-3xl font-bold text-purple-600">
                    {cowPurchaseStats?.totalCowPurchases || 0}
                </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Amount Spent</h3>
                <p className="text-3xl font-bold text-red-600">
                    ৳ {cowPurchaseStats?.totalAmountSpent.toFixed(2) || '0.00'}
                </p>
            </div>
        </div>
    );
} 