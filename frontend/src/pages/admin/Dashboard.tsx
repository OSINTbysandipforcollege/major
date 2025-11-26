import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Shield, Users, Calendar, AlertTriangle,
  Phone, Settings, LogOut, PlusCircle,
  List, BarChart3
} from 'lucide-react';

import AdminDashboardContent from "./AdminDashboardContent";
import SettingsPage from './SettingsPage';
import ReportsPage from './ReportsPage';
import ContactsPage from './ContactsPage';
import AlertsPage from './AlertsPage';
import EventsPage from './EventsPage';
import UsersPage from './UsersPage';

// Admin sub-pages
// const ManageUsers = () => <div className="p-4"><h2 className="text-xl font-bold mb-4">Manage Users</h2><p>User management interface will be displayed here.</p></div>;
// const ManageEvents = () => <div className="p-4"><h2 className="text-xl font-bold mb-4">Manage Events</h2><p>Event management interface will be displayed here.</p></div>;
// const ManageAlerts = () => <div className="p-4"><h2 className="text-xl font-bold mb-4">Manage Alerts</h2><p>Alert management interface will be displayed here.</p></div>;
// const ManageContacts = () => <div className="p-4"><h2 className="text-xl font-bold mb-4">Manage Contacts</h2><p>Contact management interface will be displayed here.</p></div>;
// const SystemSettings = () => <div className="p-4"><h2 className="text-xl font-bold mb-4">System Settings</h2><p>System configuration options will be displayed here.</p></div>;
// const AdminReports = () => <div className="p-4"><h2 className="text-xl font-bold mb-4">Analytics & Reports</h2><p>Reporting and analytics dashboard will be displayed here.</p></div>;

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700 flex items-center">
          <Shield size={24} className="text-green-500 mr-2" />
          <h1 className="font-bold text-xl">Admin Panel</h1>
        </div>

        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3">
              <span className="font-medium text-sm">
                {user?.name.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            <li>
              <Link
                to="/admin/users"
                className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Users size={18} className="mr-3" />
                <span>Users</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/events"
                className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Calendar size={18} className="mr-3" />
                <span>Events</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/alerts"
                className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <AlertTriangle size={18} className="mr-3" />
                <span>Alerts</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/contacts"
                className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Phone size={18} className="mr-3" />
                <span>Contacts</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/reports"
                className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <BarChart3 size={18} className="mr-3" />
                <span>Reports & Analytics</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/settings"
                className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Settings size={18} className="mr-3" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>

            <div className="flex items-center">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center text-sm mr-4">
                <PlusCircle size={16} className="mr-1" />
                Add New
              </button>

              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center text-sm">
                <List size={16} className="mr-1" />
                View All
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <Routes>
            <Route path="/" element={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-3 mr-4">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">Total Users</p>
                      <p className="text-2xl font-bold">2,567</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="bg-green-100 rounded-full p-3 mr-4">
                      <Calendar className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">Total Events</p>
                      <p className="text-2xl font-bold">48</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="bg-red-100 rounded-full p-3 mr-4">
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">Active Alerts</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                  </div>
                </div>
              </div>
            } />
            <Route path="/" element={<AdminDashboardContent />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />

          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;