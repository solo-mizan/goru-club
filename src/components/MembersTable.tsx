'use client';

import { useState, useEffect } from 'react';

type Member = {
    _id: string;
    name: string;
    phoneNumber: string;
    isActive: boolean;
    joinDate: string;
}

export function MembersTable() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        isActive: true
    });

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/members');
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
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingMember
                ? `http://localhost:5000/api/members/${editingMember._id}`
                : 'http://localhost:5000/api/members';

            const method = editingMember ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to save member');
            }

            fetchMembers();
            resetForm();
        } catch (err) {
            console.error('Error saving member:', err);
            setError('Failed to save member. Please try again.');
        }
    };

    const handleEdit = (member: Member) => {
        setEditingMember(member);
        setFormData({
            name: member.name,
            phoneNumber: member.phoneNumber,
            isActive: member.isActive
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this member?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/members/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.msg || 'Failed to delete member');
            }

            fetchMembers();
        } catch (err: any) {
            console.error('Error deleting member:', err);
            alert(err.message || 'Failed to delete member. Please try again.');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            phoneNumber: '',
            isActive: true
        });
        setEditingMember(null);
        setShowForm(false);
    };

    if (loading) {
        return <div className="flex justify-center p-4">Loading members...</div>;
    }

    if (error && !members.length) {
        return <div className="text-red-500 p-4">{error}</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Members</h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors"
                >
                    {showForm ? 'Cancel' : 'Add Member'}
                </button>
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-md mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Active Member</span>
                        </label>
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
                            {editingMember ? 'Update Member' : 'Add Member'}
                        </button>
                    </div>
                </form>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Phone Number</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Join Date</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center">No members found. Add your first member!</td>
                            </tr>
                        ) : (
                            members.map((member) => (
                                <tr key={member._id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{member.name}</td>
                                    <td className="px-6 py-4">{member.phoneNumber}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {member.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{new Date(member.joinDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(member)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(member._id)}
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