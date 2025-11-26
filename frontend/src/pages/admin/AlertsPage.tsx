import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, Edit, X, AlertTriangle } from "lucide-react";
import { fetchAlerts, createAlert, deleteAlert, Alert, CreateAlertData } from "../../services/alertsApi";

const AlertsPage: React.FC = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newAlert, setNewAlert] = useState<CreateAlertData>({
        title: "",
        severity: "moderate",
        affectedAreas: [],
        details: "",
        region: "India"
    });
    const [affectedAreaInput, setAffectedAreaInput] = useState("");

    const loadAlerts = async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedAlerts = await fetchAlerts();
            setAlerts(fetchedAlerts);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load alerts");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAlerts();
    }, []);

    const handleAddAlert = async () => {
        if (!newAlert.title || !newAlert.severity) {
            alert("Please fill in title and severity");
            return;
        }

        try {
            await createAlert(newAlert);
            setNewAlert({
                title: "",
                severity: "moderate",
                affectedAreas: [],
                details: "",
                region: "India"
            });
            setAffectedAreaInput("");
            setShowAddForm(false);
            await loadAlerts();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to create alert");
        }
    };

    const handleDeleteAlert = async (id: string) => {
        if (!confirm("Are you sure you want to delete this alert?")) {
            return;
        }

        try {
            await deleteAlert(id);
            await loadAlerts();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to delete alert");
        }
    };

    const addAffectedArea = () => {
        if (affectedAreaInput.trim()) {
            setNewAlert({
                ...newAlert,
                affectedAreas: [...newAlert.affectedAreas, affectedAreaInput.trim()]
            });
            setAffectedAreaInput("");
        }
    };

    const removeAffectedArea = (index: number) => {
        setNewAlert({
            ...newAlert,
            affectedAreas: newAlert.affectedAreas.filter((_, i) => i !== index)
        });
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'catastrophic': return 'bg-red-600 text-white';
            case 'major': return 'bg-orange-500 text-white';
            case 'moderate': return 'bg-yellow-500 text-white';
            case 'minor': return 'bg-blue-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    if (loading) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="ml-2">Loading alerts...</span>
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
                    onClick={loadAlerts}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">🌍 Active Alerts</h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <PlusCircle size={18} />
                    {showAddForm ? "Cancel" : "Add New Alert"}
                </button>
            </div>

            {showAddForm && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-4">
                    <h3 className="font-semibold text-lg">Create New Alert</h3>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={newAlert.title}
                            onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                            className="w-full border border-gray-300 rounded p-2"
                            placeholder="e.g., Flood alert in Assam"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Severity *
                            </label>
                            <select
                                value={newAlert.severity}
                                onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value as any })}
                                className="w-full border border-gray-300 rounded p-2"
                            >
                                <option value="minor">Minor</option>
                                <option value="moderate">Moderate</option>
                                <option value="major">Major</option>
                                <option value="catastrophic">Catastrophic</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Region
                            </label>
                            <input
                                type="text"
                                value={newAlert.region}
                                onChange={(e) => setNewAlert({ ...newAlert, region: e.target.value })}
                                className="w-full border border-gray-300 rounded p-2"
                                placeholder="e.g., India"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Affected Areas
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={affectedAreaInput}
                                onChange={(e) => setAffectedAreaInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAffectedArea())}
                                className="flex-1 border border-gray-300 rounded p-2"
                                placeholder="Enter area and press Enter"
                            />
                            <button
                                type="button"
                                onClick={addAffectedArea}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Add
                            </button>
                        </div>
                        {newAlert.affectedAreas.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {newAlert.affectedAreas.map((area, index) => (
                                    <span
                                        key={index}
                                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                    >
                                        {area}
                                        <button
                                            type="button"
                                            onClick={() => removeAffectedArea(index)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Details
                        </label>
                        <textarea
                            value={newAlert.details}
                            onChange={(e) => setNewAlert({ ...newAlert, details: e.target.value })}
                            className="w-full border border-gray-300 rounded p-2"
                            rows={3}
                            placeholder="Additional details about the alert"
                        />
                    </div>

                    <button
                        onClick={handleAddAlert}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                    >
                        Create Alert
                    </button>
                </div>
            )}

            {alerts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No alerts yet. Create one above!
                </div>
            ) : (
                <div className="space-y-4">
                    {alerts.map(alert => (
                        <div
                            key={alert.id}
                            className="border border-gray-200 rounded-lg p-4 bg-red-50 hover:bg-red-100 transition-colors"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-3 py-1 rounded text-sm font-semibold ${getSeverityColor(alert.severity)}`}>
                                            {alert.severity.toUpperCase()}
                                        </span>
                                        <h3 className="font-bold text-lg">{alert.title}</h3>
                                    </div>
                                    {alert.affectedAreas && alert.affectedAreas.length > 0 && (
                                        <p className="text-sm text-gray-600 mb-1">
                                            <strong>Affected Areas:</strong> {alert.affectedAreas.join(', ')}
                                        </p>
                                    )}
                                    {alert.details && (
                                        <p className="text-gray-700 mb-2">{alert.details}</p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        {new Date(alert.date).toLocaleDateString()} • {alert.region || 'General'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDeleteAlert(alert.id)}
                                    className="bg-red-100 text-red-700 px-3 py-1 rounded flex items-center hover:bg-red-200 text-sm ml-4"
                                >
                                    <Trash2 size={16} className="mr-1" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AlertsPage;
