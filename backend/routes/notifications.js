import express from 'express';
import { randomUUID } from 'crypto';
import { readData, writeData } from '../utils/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Initialize default notifications if database is empty
const initializeNotifications = () => {
  const notifications = readData('notifications.json');
  
  if (notifications.length === 0) {
    const defaultNotifications = [
      {
        id: '1',
        userId: '2', // Regular user
        title: 'Welcome to ResQConnect!',
        message: 'Thank you for registering. Stay safe and informed.',
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
      },
    ];
    writeData('notifications.json', defaultNotifications);
  }
};

initializeNotifications();

// Get user's notifications
router.get('/', authenticate, (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = readData('notifications.json');
    
    // Get notifications for this user (or all if admin)
    const userNotifications = req.user.role === 'admin' 
      ? notifications 
      : notifications.filter(n => n.userId === userId || !n.userId);
    
    // Sort by date (newest first)
    const sorted = userNotifications.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json({ notifications: sorted });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.put('/:id/read', authenticate, (req, res) => {
  try {
    const { id } = req.params;
    const notifications = readData('notifications.json');
    const index = notifications.findIndex(n => n.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notifications[index].read = true;
    writeData('notifications.json', notifications);

    res.json({ notification: notifications[index] });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ message: 'Failed to update notification' });
  }
});

// Mark all notifications as read
router.put('/read-all', authenticate, (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = readData('notifications.json');
    
    const updated = notifications.map(n => {
      if ((req.user.role === 'admin' || n.userId === userId || !n.userId) && !n.read) {
        return { ...n, read: true };
      }
      return n;
    });

    writeData('notifications.json', updated);

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ message: 'Failed to update notifications' });
  }
});

// Delete notification
router.delete('/:id', authenticate, (req, res) => {
  try {
    const notifications = readData('notifications.json');
    const filtered = notifications.filter(n => n.id !== req.params.id);

    if (filtered.length === notifications.length) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    writeData('notifications.json', filtered);

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Failed to delete notification' });
  }
});

// Get unread count
router.get('/unread/count', authenticate, (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = readData('notifications.json');
    
    const unread = req.user.role === 'admin'
      ? notifications.filter(n => !n.read).length
      : notifications.filter(n => (n.userId === userId || !n.userId) && !n.read).length;

    res.json({ count: unread });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Failed to get unread count' });
  }
});

export default router;

