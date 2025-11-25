import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Mail, Lock, Info } from 'lucide-react';
import Alert from '../components/Alert';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showCredentials, setShowCredentials] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const authenticatedUser = await login(email, password);
      navigate(authenticatedUser.role === 'admin' ? '/admin' : '/user');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid email or password. Please try again.';
      setError(message);
    }
  };


  const toggleCredentials = () => {
    setShowCredentials(!showCredentials);
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex justify-center mb-6">
            <ShieldAlert size={40} className="text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            ResQConnect
          </h2>

          <h3 className="text-xl font-medium text-center text-gray-800 mb-6">
            Sign in to your account
          </h3>

          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError(null)}
            />
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Your email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full pl-10 p-2.5"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full pl-10 p-2.5"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-green-300"
                  />
                </div>
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-green-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors"
            >
              Log in
            </button>

            <div className="text-sm text-gray-600 text-center">
              Don't have an account? <Link to="/register" className="text-green-600 hover:underline">Register Here</Link>
            </div>
          </form>

          <button
            onClick={toggleCredentials}
            className="mt-6 flex items-center justify-center w-full text-xs text-gray-500 hover:text-green-600"
          >
            <Info size={16} className="mr-1" />
            {showCredentials ? 'Hide demo credentials' : 'Show demo credentials'}
          </button>

          {showCredentials && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
              <div className="mb-2">
                <p className="text-gray-700"><strong>Admin:</strong></p>
                <p>Email: admin@gmail.com</p>
                <p>Password: 12345</p>
              </div>
              <div>
                <p className="text-gray-700"><strong>User:</strong></p>
                <p>Email: user@gmail.com</p>
                <p>Password: 12345</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;