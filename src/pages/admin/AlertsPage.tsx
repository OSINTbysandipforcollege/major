import React from "react";

const AlertsPage: React.FC = () => {
    const alerts = [
        { id: 1, region: "India", message: "🚨 Flood alert in Assam", date: "2025-08-20" },
        { id: 2, region: "World", message: "🌍 Earthquake in Japan", date: "2025-08-18" },
        { id: 3, region: "India", message: "🔥 Forest fire in Uttarakhand", date: "2025-07-29" },
    ];

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">🌍 Active Alerts</h2>
            <ul className="space-y-4">
                {alerts.map(alert => (
                    <li key={alert.id} className="border p-4 rounded bg-red-50">
                        <p className="font-bold">{alert.region}</p>
                        <p>{alert.message}</p>
                        <p className="text-sm text-gray-500">{alert.date}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AlertsPage;
