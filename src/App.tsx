import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/user/Dashboard';
import Events from './pages/user/Events';
import DisasterAlerts from './pages/user/DisasterAlerts';
import ContactInfo from './pages/user/ContactInfo';
import AdminDashboard from './pages/admin/Dashboard';
import NotFound from './pages/NotFound';
// import UserHomePage from './pages/UserHomePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected User Routes */}

          <Route path="/user" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />

          {/* <Route path="/user" element={<ProtectedRoute>< UserHomePage /></ProtectedRoute>} /> */}




          <Route path="/user/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/user/alerts" element={<ProtectedRoute><DisasterAlerts /></ProtectedRoute>} />
          <Route path="/user/contactinfo" element={<ProtectedRoute><ContactInfo /></ProtectedRoute>} />

          {/* Protected Admin Routes */}
          <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;