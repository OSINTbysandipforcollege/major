import React from "react";
import { Trash2, CheckCircle } from "lucide-react";
import useLocalStorage from "../../hooks/useLocalStorage";

interface User {
    id: number;
    name: string;
    email: string;
    location: string;
    verified: boolean;
}

const UsersPage: React.FC = () => {
    const [users, setUsers] = useLocalStorage<User[]>("users", [
        { id: 1, name: "Arman Ahmad", email: "arman.ahmad@gmail.com", verified: false, location: "Guwahati, Assam (Floods)" },
        { id: 2, name: "Rahul Sharma", email: "rahul.sharma23@yahoo.com", verified: true, location: "Chennai, Tamil Nadu (Cyclones & Floods)" },
        { id: 3, name: "Priya Verma", email: "priya.v.verma@gmail.com", verified: false, location: "Bhuj, Gujarat (Earthquake Zone)" },
        { id: 4, name: "Suresh Kumar", email: "suresh.kumar89@outlook.com", verified: true, location: "Puri, Odisha (Cyclones)" }
    ]);

    const verifyUser = (id: number) => {
        setUsers(users.map(u => u.id === id ? { ...u, verified: true } : u));
    };

    const deleteUser = (id: number) => {
        setUsers(users.filter(u => u.id !== id));
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">👥 Registered Users</h2>
            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Email</th>
                        <th className="p-2 border">Location</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} className="text-center">
                            <td className="border p-2">{user.name}</td>
                            <td className="border p-2">{user.email}</td>
                            <td className="border p-2">{user.location}</td>
                            <td className="border p-2">
                                {user.verified ? "✅ Verified" : "⏳ Pending"}
                            </td>
                            <td className="border p-2 flex justify-center gap-2">
                                {!user.verified && (
                                    <button
                                        onClick={() => verifyUser(user.id)}
                                        className="bg-green-200 px-3 py-1 rounded flex items-center">
                                        <CheckCircle size={14} className="mr-1" /> Verify
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteUser(user.id)}
                                    className="bg-red-200 px-3 py-1 rounded flex items-center">
                                    <Trash2 size={14} className="mr-1" /> Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersPage;
