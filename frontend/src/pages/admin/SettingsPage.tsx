import React, { useState } from "react";

const SettingsPage: React.FC = () => {
    const [admin, setAdmin] = useState({ name: "Admin User", email: "admin@rescue.org" });

    return (
        <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
            <h2 className="text-xl font-semibold">⚙️ Admin Settings</h2>

            <div>
                <label className="block font-medium">Name</label>
                <input
                    className="border p-2 rounded w-full"
                    value={admin.name}
                    onChange={e => setAdmin({ ...admin, name: e.target.value })}
                />
            </div>

            <div>
                <label className="block font-medium">Email</label>
                <input
                    className="border p-2 rounded w-full"
                    value={admin.email}
                    onChange={e => setAdmin({ ...admin, email: e.target.value })}
                />
            </div>

            <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Save Changes
            </button>
        </div>
    );
};

export default SettingsPage;
