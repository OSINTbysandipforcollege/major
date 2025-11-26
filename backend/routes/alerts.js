import express from 'express';
import { randomUUID } from 'crypto';
import { readData, writeData, findById, findIndex } from '../utils/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Initialize default alerts if database is empty
const initializeAlerts = () => {
  const alerts = readData('alerts.json');
  
  if (alerts.length === 0) {
    const defaultAlerts = [
      {
        id: '1',
        title: 'Flood Alert in Assam',
        severity: 'major',
        date: new Date().toISOString(),
        affectedAreas: ['Assam', 'Guwahati'],
        details: 'Heavy rainfall expected in the region',
        region: 'India',
        createdAt: new Date().toISOString(),
      },
    ];
    writeData('alerts.json', defaultAlerts);
  }
};

initializeAlerts();

// Get all alerts (public, but authenticated users see more info)
router.get('/', authenticate, (req, res) => {
  try {
    const alerts = readData('alerts.json');
    
    // Sort by date (newest first)
    const sorted = alerts.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ alerts: sorted });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ message: 'Failed to fetch alerts' });
  }
});

// Get single alert
router.get('/:id', authenticate, (req, res) => {
  try {
    const alert = findById('alerts.json', req.params.id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json({ alert });
  } catch (error) {
    console.error('Get alert error:', error);
    res.status(500).json({ message: 'Failed to fetch alert' });
  }
});

// Create alert (Admin only)
router.post('/', authenticate, requireAdmin, (req, res) => {
  try {
    const { title, severity, affectedAreas, details, region } = req.body;

    if (!title || !severity) {
      return res.status(400).json({ message: 'Title and severity are required' });
    }

    const validSeverities = ['minor', 'moderate', 'major', 'catastrophic'];
    if (!validSeverities.includes(severity)) {
      return res.status(400).json({ message: 'Invalid severity. Must be: minor, moderate, major, or catastrophic' });
    }

    const alerts = readData('alerts.json');
    
    const newAlert = {
      id: randomUUID(),
      title,
      severity,
      date: new Date().toISOString(),
      affectedAreas: Array.isArray(affectedAreas) ? affectedAreas : (affectedAreas ? [affectedAreas] : []),
      details: details || '',
      region: region || 'General',
      createdAt: new Date().toISOString(),
    };

    writeData('alerts.json', [...alerts, newAlert]);

    // Create notification for all users about new alert
    const notifications = readData('notifications.json');
    const users = readData('users.json');
    
    // Create notification for each user
    const userNotifications = users
      .filter(u => u.role === 'user')
      .map(user => ({
        id: randomUUID(),
        userId: user.id,
        title: `New ${newAlert.severity.toUpperCase()} Alert`,
        message: `${newAlert.title}${newAlert.affectedAreas.length > 0 ? ` - Affected: ${newAlert.affectedAreas.join(', ')}` : ''}`,
        type: newAlert.severity === 'catastrophic' || newAlert.severity === 'major' ? 'error' : 'warning',
        read: false,
        createdAt: new Date().toISOString(),
      }));

    writeData('notifications.json', [...notifications, ...userNotifications]);

    res.status(201).json({ alert: newAlert });
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ message: 'Failed to create alert' });
  }
});

// Update alert (Admin only)
router.put('/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const { title, severity, affectedAreas, details, region } = req.body;
    
    const alert = findById('alerts.json', req.params.id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (severity !== undefined) {
      const validSeverities = ['minor', 'moderate', 'major', 'catastrophic'];
      if (!validSeverities.includes(severity)) {
        return res.status(400).json({ message: 'Invalid severity' });
      }
      updates.severity = severity;
    }
    if (affectedAreas !== undefined) {
      updates.affectedAreas = Array.isArray(affectedAreas) ? affectedAreas : [affectedAreas];
    }
    if (details !== undefined) updates.details = details;
    if (region !== undefined) updates.region = region;

    const alerts = readData('alerts.json');
    const index = findIndex('alerts.json', req.params.id);
    
    alerts[index] = { ...alerts[index], ...updates };
    writeData('alerts.json', alerts);

    res.json({ alert: alerts[index] });
  } catch (error) {
    console.error('Update alert error:', error);
    res.status(500).json({ message: 'Failed to update alert' });
  }
});

// Delete alert (Admin only)
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const alert = findById('alerts.json', req.params.id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    const alerts = readData('alerts.json');
    const filtered = alerts.filter(a => a.id !== req.params.id);
    writeData('alerts.json', filtered);

    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({ message: 'Failed to delete alert' });
  }
});

export default router;

