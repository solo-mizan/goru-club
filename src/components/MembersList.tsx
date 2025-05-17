'use client';

import { useState, useEffect } from 'react';

type Member = {
    _id: string;
    name: string;
    phoneNumber: string;
    totalDeposit: number;
}

export function MembersList() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchMembers() {
            try {
                const response = await fetch('http://localhost:5000/api/members/with-deposits');
                if (!response.ok) {
                    throw new Error('Failed to fetch members');
                }
                const data = await response.json();
                setMembers(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching members:', err);
                setError('Failed to load members. Please try again later.');
                setLoading(false);
            }
        }

        fetchMembers();
    }, []);

    if (loading) {
        return <div className="flex justify-center p-4">Loading members...</div>;
    }

    if (error) {
        return <div className="text-red-500 p-4">{error}</div>;
    }

    if (members.length === 0) {
        return <div className="p-4">No members found.</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Phone Number</th>
                        <th className="px-6 py-3">Total Deposit</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member) => (
                        <tr key={member._id} className="border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">{member.name}</td>
                            <td className="px-6 py-4">{member.phoneNumber}</td>
                            <td className="px-6 py-4">৳ {member.totalDeposit.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 