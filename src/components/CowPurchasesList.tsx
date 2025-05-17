'use client';

import { useState, useEffect } from 'react';

type Member = {
    _id: string;
    name: string;
}

type CowPurchase = {
    _id: string;
    date: string;
    amount: number;
    participatingMembers: Member[];
    notes: string;
}

export function CowPurchasesList() {
    const [cowPurchases, setCowPurchases] = useState<CowPurchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchCowPurchases() {
            try {
                const response = await fetch('http://localhost:5000/api/cow-purchases');
                if (!response.ok) {
                    throw new Error('Failed to fetch cow purchases');
                }
                const data = await response.json();
                setCowPurchases(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching cow purchases:', err);
                setError('Failed to load cow purchases. Please try again later.');
                setLoading(false);
            }
        }

        fetchCowPurchases();
    }, []);

    if (loading) {
        return <div className="flex justify-center p-4">Loading cow purchases...</div>;
    }

    if (error) {
        return <div className="text-red-500 p-4">{error}</div>;
    }

    if (cowPurchases.length === 0) {
        return <div className="p-4">No cow purchases found.</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">Amount</th>
                        <th className="px-6 py-3">Participating Members</th>
                    </tr>
                </thead>
                <tbody>
                    {cowPurchases.map((purchase) => (
                        <tr key={purchase._id} className="border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">
                                {new Date(purchase.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">৳ {purchase.amount.toFixed(2)}</td>
                            <td className="px-6 py-4">
                                {purchase.participatingMembers.map(m => m.name).join(', ')}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 