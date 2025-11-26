import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { readData, writeData, findById } from '../utils/database.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

// Initialize default users if database is empty
const initializeUsers = () => {
  const users = readData('users.json');
  
  if (users.length === 0) {
    const defaultUsers = [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@gmail.com',
        role: 'admin',
        password: bcrypt.hashSync('12345', 10),
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Regular User',
        email: 'user@gmail.com',
        role: 'user',
        password: bcrypt.hashSync('12345', 10),
        createdAt: new Date().toISOString(),
      },
    ];
    writeData('users.json', defaultUsers);
  } else {
    // Ensure all passwords are hashed
    let updated = false;
    const updatedUsers = users.map(user => {
      if (!user.password.startsWith('$2')) {
        updated = true;
        return {
          ...user,
          password: bcrypt.hashSync(user.password, 10),
        };
      }
      return user;
    });
    
    if (updated) {
      writeData('users.json', updatedUsers);
    }
  }
};

// Initialize on module load
initializeUsers();

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, location } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 4) {
      return res.status(400).json({ message: 'Password must be at least 4 characters' });
    }

    const users = readData('users.json');
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: randomUUID(),
      name,
      email: email.toLowerCase().trim(),
      role: 'user',
      password: hashedPassword,
      location: location || 'Not specified', // Location from registration form
      verified: false, // New users start as unverified
      createdAt: new Date().toISOString(),
    };

    writeData('users.json', [...users, newUser]);

    const token = generateToken(newUser);

    res.status(201).json({
      token,
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const users = readData('users.json');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Ensure password is hashed
    if (!user.password.startsWith('$2')) {
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const users = readData('users.json');
    const user = users.find(u => u.id === decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: sanitizeUser(user),
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    res.status(500).json({ message: 'Failed to get user' });
  }
});

// Logout (client-side token removal, but endpoint for consistency)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;

