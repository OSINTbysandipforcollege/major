import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-lg text-center">
        <div className="mb-6 flex justify-center">
          <Shield size={60} className="text-green-600" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Welcome to ResQConnect
        </h1>
        
        <p className="text-gray-700 mb-8 text-lg">
          Stay informed, prepared, and connected during emergencies. 
          Join our platform for disaster awareness and preparedness resources.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-8 rounded-lg text-lg transition-colors duration-300"
          >
            LOGIN
          </Link>
          
          <Link
            to="/register"
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-8 rounded-lg text-lg transition-colors duration-300"
          >
            REGISTER
          </Link>
        </div>
      </div>
      
      <div className="mt-16 max-w-3xl text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <AlertTriangle size={24} className="text-orange-500" />
          <h2 className="text-xl font-semibold text-gray-800">Current Active Alerts</h2>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-red-600 font-medium">
            Earthquake Warning: Southern Coast (Severity: High)
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Updated 20 minutes ago • Stay tuned for more information
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;