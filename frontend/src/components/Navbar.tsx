import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, User, LogOut, X, CheckCircle } from 'lucide-react';
import { fetchNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification, Notification } from '../services/notificationsApi';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const [notifs, count] = await Promise.all([
        fetchNotifications(),
        getUnreadCount()
      ]);
      setNotifications(notifs);
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadNotifications();
      // Refresh notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showNotifications]);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      try {
        await markAsRead(notification.id);
        setNotifications(notifications.map(n => 
          n.id === notification.id ? { ...n, read: true } : n
        ));
        setUnreadCount(Math.max(0, unreadCount - 1));
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      const updated = notifications.filter(n => n.id !== id);
      setNotifications(updated);
      const unread = updated.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
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
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => {
              const newState = !showNotifications;
              setShowNotifications(newState);
              if (newState) {
                loadNotifications();
              }
            }}
            className="text-gray-600 relative hover:text-gray-800 transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-green-600 hover:text-green-700"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto flex-1">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading...</div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                {notification.title}
                              </h4>
                              {notification.read && (
                                <CheckCircle size={14} className="text-green-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                          <button
                            onClick={(e) => handleDeleteNotification(notification.id, e)}
                            className="text-gray-400 hover:text-red-500 ml-2"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
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