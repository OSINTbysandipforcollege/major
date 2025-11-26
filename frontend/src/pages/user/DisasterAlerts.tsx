import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import AlertCard from '../../components/AlertCard';
import { Alert } from '../../models/interfaces';
import { Loader2, AlertTriangle } from 'lucide-react';
import { fetchDisasterAlerts } from '../../services/alertsApi';

const DisasterAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchAlerts = async () => {
    try {
      const data = await fetchDisasterAlerts();
      setAlerts(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Failed to fetch alerts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Disaster Alerts
          </h1>
          <div className="flex items-center space-x-2">
            <button 
              onClick={fetchAlerts}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Refresh
            </button>
            <span className="text-sm text-gray-600">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alerts.map(alert => (
            <AlertCard
              key={alert.id}
              title={alert.title}
              severity={alert.severity}
              date={formatDate(alert.date)}
              affectedAreas={alert.affectedAreas}
              onViewDetails={() => window.alert(alert.details)}
            />
          ))}
        </div>
        
        {alerts.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-600">No active alerts at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisasterAlerts;