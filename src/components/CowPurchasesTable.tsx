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
    receiptImage?: string;
}

export function CowPurchasesTable() {
    const [cowPurchases, setCowPurchases] = useState<CowPurchase[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingPurchase, setEditingPurchase] = useState<CowPurchase | null>(null);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        participatingMembers: [] as string[],
        notes: ''
    });
    const [receiptFile, setReceiptFile] = useState<File | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch cow purchases
            const cowPurchasesResponse = await fetch('http://localhost:5000/api/cow-purchases');
            if (!cowPurchasesResponse.ok) {
                throw new Error('Failed to fetch cow purchases');
            }

            // Fetch members for dropdown
            const membersResponse = await fetch('http://localhost:5000/api/members');
            if (!membersResponse.ok) {
                throw new Error('Failed to fetch members');
            }

            const cowPurchasesData = await cowPurchasesResponse.json();
            const membersData = await membersResponse.json();

            setCowPurchases(cowPurchasesData);
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

        if (name === 'participatingMembers') {
            // Handle multiple select
            const select = e.target as HTMLSelectElement;
            const selectedOptions = Array.from(select.selectedOptions, option => option.value);
            setFormData({
                ...formData,
                participatingMembers: selectedOptions
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setReceiptFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate amount
        if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
            setError('Amount must be a positive number');
            return;
        }

        try {
            const url = editingPurchase
                ? `http://localhost:5000/api/cow-purchases/${editingPurchase._id}`
                : 'http://localhost:5000/api/cow-purchases';

            const method = editingPurchase ? 'PUT' : 'POST';

            // Create form data for file upload
            const formDataToSubmit = new FormData();
            formDataToSubmit.append('date', formData.date);
            formDataToSubmit.append('amount', formData.amount);
            formData.participatingMembers.forEach(memberId => {
                formDataToSubmit.append('participatingMembers[]', memberId);
            });
            formDataToSubmit.append('notes', formData.notes);

            if (receiptFile) {
                formDataToSubmit.append('receipt', receiptFile);
            }

            const response = await fetch(url, {
                method,
                body: formDataToSubmit
            });

            if (!response.ok) {
                throw new Error('Failed to save cow purchase');
            }

            fetchData();
            resetForm();
        } catch (err) {
            console.error('Error saving cow purchase:', err);
            setError('Failed to save cow purchase. Please try again.');
        }
    };

    const handleEdit = (purchase: CowPurchase) => {
        setEditingPurchase(purchase);
        setFormData({
            date: new Date(purchase.date).toISOString().split('T')[0],
            amount: purchase.amount.toString(),
            participatingMembers: purchase.participatingMembers.map(m => m._id),
            notes: purchase.notes
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this cow purchase?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/cow-purchases/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete cow purchase');
            }

            fetchData();
        } catch (err) {
            console.error('Error deleting cow purchase:', err);
            setError('Failed to delete cow purchase. Please try again.');
        }
    };

    const resetForm = () => {
        setFormData({
            date: new Date().toISOString().split('T')[0],
            amount: '',
            participatingMembers: [],
            notes: ''
        });
        setReceiptFile(null);
        setEditingPurchase(null);
        setShowForm(false);
    };

    if (loading) {
        return <div className="flex justify-center p-4">Loading cow purchases...</div>;
    }

    if (error && !cowPurchases.length) {
        return <div className="text-red-500 p-4">{error}</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Cow Purchases</h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors"
                >
                    {showForm ? 'Cancel' : 'Add Cow Purchase'}
                </button>
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-md mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
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
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Participating Members</label>
                            <select
                                name="participatingMembers"
                                value={formData.participatingMembers}
                                onChange={handleInputChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                multiple
                                size={5}
                                required
                            >
                                {members.map(member => (
                                    <option key={member._id} value={member._id}>
                                        {member.name}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-xs text-gray-500">Hold Ctrl (or Cmd) to select multiple members</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                rows={3}
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Receipt</label>
                            <input
                                type="file"
                                name="receipt"
                                onChange={handleFileChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md shadow-sm transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors"
                        >
                            {editingPurchase ? 'Update Purchase' : 'Add Purchase'}
                        </button>
                    </div>
                </form>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3">Participating Members</th>
                            <th className="px-6 py-3">Notes</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cowPurchases.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center">No cow purchases found. Add your first purchase!</td>
                            </tr>
                        ) : (
                            cowPurchases.map((purchase) => (
                                <tr key={purchase._id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{new Date(purchase.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">৳ {purchase.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        {purchase.participatingMembers.map(m => m.name).join(', ')}
                                    </td>
                                    <td className="px-6 py-4">{purchase.notes}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(purchase)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(purchase._id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
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