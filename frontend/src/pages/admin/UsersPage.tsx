import React, { useState, useEffect } from "react";
import { Trash2, CheckCircle, RefreshCw } from "lucide-react";
import { fetchAllUsers, verifyUser, deleteUser, User } from "../../services/usersApi";

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedUsers = await fetchAllUsers();
            // Filter out admin users, only show regular users
            setUsers(fetchedUsers.filter(u => u.role === 'user'));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load users");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleVerifyUser = async (userId: string, currentVerified: boolean) => {
        try {
            await verifyUser(userId, !currentVerified);
            await loadUsers(); // Refresh the list
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to verify user");
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) {
            return;
        }

        try {
            await deleteUser(userId);
            await loadUsers(); // Refresh the list
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to delete user");
        }
    };

    if (loading) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 text-green-600 animate-spin" />
                    <span className="ml-2">Loading users...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
                <button
                    onClick={loadUsers}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">👥 Registered Users</h2>
                <button
                    onClick={loadUsers}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>
            {users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No registered users yet.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 border text-left">Name</th>
                                <th className="p-2 border text-left">Email</th>
                                <th className="p-2 border text-left">Location</th>
                                <th className="p-2 border text-center">Status</th>
                                <th className="p-2 border text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="border p-2">{user.name}</td>
                                    <td className="border p-2">{user.email}</td>
                                    <td className="border p-2">{user.location || "Not specified"}</td>
                                    <td className="border p-2 text-center">
                                        {user.verified ? (
                                            <span className="flex items-center justify-center gap-1 text-green-600">
                                                <CheckCircle size={16} />
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="text-yellow-600">⏳ Pending</span>
                                        )}
                                    </td>
                                    <td className="border p-2">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleVerifyUser(user.id, user.verified)}
                                                className={`px-3 py-1 rounded flex items-center text-sm ${
                                                    user.verified
                                                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                                        : "bg-green-100 text-green-700 hover:bg-green-200"
                                                }`}
                                            >
                                                <CheckCircle size={14} className="mr-1" />
                                                {user.verified ? "Unverify" : "Verify"}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="bg-red-100 text-red-700 px-3 py-1 rounded flex items-center hover:bg-red-200 text-sm"
                                            >
                                                <Trash2 size={14} className="mr-1" /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UsersPage;
