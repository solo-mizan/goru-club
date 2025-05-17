'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from '@/context/TranslationsContext';

type Member = {
    _id: string;
    name: string;
}

type Deposit = {
    _id: string;
    member: Member;
    amount: number;
    date: string;
    status: 'pending' | 'approved' | 'rejected';
    notes: string;
}

interface DepositsTableProps {
    initialShowForm?: boolean;
    onFormToggle?: (show: boolean) => void;
}

export function DepositsTable({ initialShowForm = false, onFormToggle }: DepositsTableProps) {
    const { t } = useTranslations();
    const [deposits, setDeposits] = useState<Deposit[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(initialShowForm);
    const [editingDeposit, setEditingDeposit] = useState<Deposit | null>(null);
    const [formData, setFormData] = useState({
        member: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        status: 'approved',
        notes: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    // Update showForm when initialShowForm prop changes
    useEffect(() => {
        setShowForm(initialShowForm);
    }, [initialShowForm]);

    const toggleForm = (show: boolean) => {
        setShowForm(show);
        if (onFormToggle) {
            onFormToggle(show);
        }
    };

    const fetchData = async () => {
        try {
            // Fetch deposits
            const depositsResponse = await fetch('http://localhost:5000/api/deposits');
            if (!depositsResponse.ok) {
                throw new Error('Failed to fetch deposits');
            }

            // Fetch members for dropdown
            const membersResponse = await fetch('http://localhost:5000/api/members');
            if (!membersResponse.ok) {
                throw new Error('Failed to fetch members');
            }

            const depositsData = await depositsResponse.json();
            const membersData = await membersResponse.json();

            setDeposits(depositsData);
            setMembers(membersData);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load data. Please try again later.');
            setLoading(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate amount
        if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
            setError(t('deposits.amountValidation'));
            return;
        }

        try {
            const url = editingDeposit
                ? `http://localhost:5000/api/deposits/${editingDeposit._id}`
                : 'http://localhost:5000/api/deposits';

            const method = editingDeposit ? 'PUT' : 'POST';

            const dataToSubmit = {
                ...formData,
                amount: Number(formData.amount)
            };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSubmit)
            });

            if (!response.ok) {
                throw new Error('Failed to save deposit');
            }

            fetchData();
            resetForm();
        } catch (err) {
            console.error('Error saving deposit:', err);
            setError(t('deposits.saveError'));
        }
    };

    const handleEdit = (deposit: Deposit) => {
        setEditingDeposit(deposit);
        setFormData({
            member: deposit.member._id,
            amount: deposit.amount.toString(),
            date: new Date(deposit.date).toISOString().split('T')[0],
            status: deposit.status,
            notes: deposit.notes
        });
        toggleForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm(t('general.confirmDelete'))) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/deposits/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete deposit');
            }

            fetchData();
        } catch (err) {
            console.error('Error deleting deposit:', err);
            setError(t('deposits.deleteError'));
        }
    };

    const resetForm = () => {
        setFormData({
            member: '',
            amount: '',
            date: new Date().toISOString().split('T')[0],
            status: 'approved',
            notes: ''
        });
        setEditingDeposit(null);
        toggleForm(false);
    };

    if (loading) {
        return <div className="flex justify-center p-4">{t('general.loading')}</div>;
    }

    if (error && !deposits.length) {
        return <div className="text-red-500 p-4">{error}</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{t('deposits.title')}</h3>
                <button
                    onClick={() => toggleForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors"
                >
                    {showForm ? t('general.cancel') : t('deposits.add')}
                </button>
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-md mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('deposits.member')}</label>
                            <select
                                name="member"
                                value={formData.member}
                                onChange={handleInputChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            >
                                <option value="">{t('deposits.selectMember')}</option>
                                {members.map(member => (
                                    <option key={member._id} value={member._id}>
                                        {member.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('deposits.amount')}</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                min="1"
                                step="0.01"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('deposits.date')}</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('deposits.status')}</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="approved">{t('deposits.statusOptions.approved')}</option>
                                <option value="pending">{t('deposits.statusOptions.pending')}</option>
                                <option value="rejected">{t('deposits.statusOptions.rejected')}</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('deposits.notes')}</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            rows={3}
                        ></textarea>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md shadow-sm transition-colors"
                        >
                            {t('general.cancel')}
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors"
                        >
                            {editingDeposit ? t('deposits.update') : t('deposits.add')}
                        </button>
                    </div>
                </form>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">{t('deposits.member')}</th>
                            <th className="px-6 py-3">{t('deposits.amount')}</th>
                            <th className="px-6 py-3">{t('deposits.date')}</th>
                            <th className="px-6 py-3">{t('deposits.status')}</th>
                            <th className="px-6 py-3">{t('deposits.notes')}</th>
                            <th className="px-6 py-3">{t('general.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deposits.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center">{t('deposits.noDeposits')}</td>
                            </tr>
                        ) : (
                            deposits.map((deposit) => (
                                <tr key={deposit._id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{deposit.member.name}</td>
                                    <td className="px-6 py-4">৳ {deposit.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">{new Date(deposit.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${deposit.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            deposit.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {t(`deposits.statusOptions.${deposit.status}`)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{deposit.notes}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(deposit)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                {t('general.edit')}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(deposit._id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                {t('general.delete')}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}