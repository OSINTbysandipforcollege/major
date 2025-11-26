import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, User, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Only show on authenticated routes
  if (!user || location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  // Determine active tab
  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-sm">
      <Link to={user.role === 'admin' ? '/admin' : '/user'} className="text-xl font-bold">
        ResQConnect
      </Link>
      
      <div className="flex items-center space-x-6">
        {user.role === 'user' && (
          <>
            <Link
              to="/user/events"
              className={`flex items-center ${isActivePath('/user') || isActivePath('/user/events') ? 'text-green-600 font-medium' : 'text-gray-700'}`}
            >
              <span className="inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Events
              </span>
            </Link>
            
            <Link
              to="/user/alerts"
              className={`flex items-center ${isActivePath('/user/alerts') ? 'text-green-600 font-medium' : 'text-gray-700'}`}
            >
              <span className="inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Disaster Alerts
              </span>
            </Link>
            
            <Link
              to="/user/contactinfo"
              className={`flex items-center ${isActivePath('/user/contactinfo') ? 'text-green-600 font-medium' : 'text-gray-700'}`}
            >
              <span className="inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Contact Info
              </span>
            </Link>
          </>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-gray-600 relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
            3
          </span>
        </button>
        
        <div className="relative group">
          <button className="flex items-center space-x-1">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <User size={16} className="text-gray-500" />
            </div>
            <span className="hidden md:inline text-sm">{user.name}</span>
          </button>
          
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <span className="flex items-center">
                <LogOut size={16} className="mr-2" />
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;