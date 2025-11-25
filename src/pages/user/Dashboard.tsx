import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertTriangle, CheckCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';

const UserDashboard: React.FC = () => {
  const [showLoginSuccess, setShowLoginSuccess] = useState(true);

  useEffect(() => {
    if (showLoginSuccess) {
      const timer = setTimeout(() => setShowLoginSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showLoginSuccess]);

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />

      {/* Login Success Message */}
      {showLoginSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-24 right-4 z-50"
        >
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
            <div className="bg-green-100 rounded-full p-2 mr-3">
              <Check className="text-green-600 w-5 h-5" />
            </div>
            <p className="text-gray-800">User Login Successful</p>
          </div>
        </motion.div>
      )}

      {/* Main Dashboard Content */}
      <div className="container mx-auto px-4 py-10 space-y-10">

        {/* Welcome Message */}

        <div className='flex justify-center'>

          <div className="bg-white p-6 rounded-lg shadow-md ">
            <h2 className="text-2xl font-bold text-gray-800">Welcome to ResQConnect 👋</h2>
            <p className="text-gray-600 mt-2 text-sm">Stay alert. Stay informed. Be prepared for any disaster.</p>
          </div>

        </div>



        {/* Disaster Alert */}
        <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg shadow flex items-start space-x-4">
          <div>
            <AlertTriangle size={32} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-700">Flood Warning: Moderate Risk</h3>
            <p className="text-sm text-gray-700 mt-1">
              Authorities have issued a flood alert for your area due to expected heavy rainfall. Please avoid travel through low-lying regions and stay tuned to official updates.
            </p>
          </div>
        </div>

        {/* Preparedness Tips */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-2">
            <CheckCircle size={22} className="text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Emergency Preparedness Tips</h3>
          </div>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-2">
            <li>📦 Keep a Go-Bag ready with water, non-perishable food, flashlight, power bank, first-aid kit, and important documents.</li>
            <li>📞 Share emergency contact numbers with family members and save them in your phone.</li>
            <li>🧭 Know your nearest evacuation routes and emergency shelters.</li>
            <li>🗺️ Print a local map and keep it in your Go-Bag in case of internet/power outages.</li>
            <li>🏠 Secure heavy furniture and remove loose items from balconies or rooftops.</li>
            <li>💊 Stock up on prescription medications and basic medical supplies.</li>
            <li>🔌 Charge your phone and power banks before an expected emergency (like a cyclone or flood).</li>
            <li>🧻 Keep hygiene items like tissues, hand sanitizer, and face masks in your emergency kit.</li>
            <li>📻 Keep a battery-powered radio to receive weather alerts if the network goes down.</li>
            <li>👨‍👩‍👧‍👦 Conduct a mock drill at home so your family knows what to do during an emergency.</li>
          </ul>
        </div>


        {/* Explore More Sections (Links) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="user//events"
            className="bg-green-100 hover:bg-green-200 transition-colors p-6 rounded-lg shadow text-center"
          >
            <h4 className="text-lg font-semibold text-green-800 mb-1">📅 Explore Events</h4>
            <p className="text-sm text-green-700">Join upcoming drills, awareness programs, and community safety events.</p>
          </a>

          <a
            href="/alerts"
            className="bg-red-100 hover:bg-red-200 transition-colors p-6 rounded-lg shadow text-center"
          >
            <h4 className="text-lg font-semibold text-red-800 mb-1">🚨 View Disaster Alerts</h4>
            <p className="text-sm text-red-700">Stay updated with real-time disaster warnings and safety instructions.</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
