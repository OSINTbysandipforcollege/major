import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const ReportsPage: React.FC = () => {
    const data = [
        { name: "Users", value: 120 },
        { name: "Events", value: 45 },
        { name: "Alerts", value: 8 },
        { name: "Contacts", value: 12 },
    ];

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">📊 Reports & Analytics</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#16a34a" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ReportsPage;
