import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  const getRedirectPath = () => {
    if (!isAuthenticated) return '/';
    return isAdmin ? '/admin' : '/user';
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center px-6 py-8">
      <ShieldAlert size={80} className="text-green-600 mb-6" />
      
      <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
        404 - Page Not Found
      </h1>
      
      <p className="text-xl text-gray-600 mb-8 text-center max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <Link
        to={getRedirectPath()}
        className="flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;