import express from 'express';
import { readData, writeData, findById } from '../utils/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all users (Admin only)
router.get('/', authenticate, requireAdmin, (req, res) => {
  try {
    const users = readData('users.json');
    
    // Remove password from response
    const sanitizedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location || 'Not specified',
      verified: user.verified !== undefined ? user.verified : true, // Default to verified
      createdAt: user.createdAt || new Date().toISOString(),
    }));

    res.json({ users: sanitizedUsers });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Get single user (Admin only)
router.get('/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const user = findById('users.json', req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove password from response
    const sanitizedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location || 'Not specified',
      verified: user.verified !== undefined ? user.verified : true,
      createdAt: user.createdAt || new Date().toISOString(),
    };

    res.json({ user: sanitizedUser });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// Update user verification status (Admin only)
router.put('/:id/verify', authenticate, requireAdmin, (req, res) => {
  try {
    const { verified } = req.body;
    const users = readData('users.json');
    const userIndex = users.findIndex(u => u.id === req.params.id);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    users[userIndex].verified = verified !== undefined ? verified : true;
    writeData('users.json', users);

    const sanitizedUser = {
      id: users[userIndex].id,
      name: users[userIndex].name,
      email: users[userIndex].email,
      role: users[userIndex].role,
      location: users[userIndex].location || 'Not specified',
      verified: users[userIndex].verified,
      createdAt: users[userIndex].createdAt || new Date().toISOString(),
    };

    res.json({ user: sanitizedUser });
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ message: 'Failed to update user verification' });
  }
});

// Delete user (Admin only)
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const users = readData('users.json');
    const filtered = users.filter(u => u.id !== req.params.id);

    if (filtered.length === users.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    writeData('users.json', filtered);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

export default router;

