import express from 'express';
import { randomUUID } from 'crypto';
import { readData, writeData, findById } from '../utils/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Register for an event (User only)
router.post('/', authenticate, (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id;

    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    // Check if event exists
    const event = findById('events.json', eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.isCompleted) {
      return res.status(400).json({ message: 'Cannot register for completed events' });
    }

    // Check if already registered
    const registrations = readData('registrations.json');
    const existingRegistration = registrations.find(
      r => r.eventId === eventId && r.userId === userId
    );

    if (existingRegistration) {
      return res.status(409).json({ message: 'Already registered for this event' });
    }

    const newRegistration = {
      id: randomUUID(),
      eventId,
      userId,
      registeredAt: new Date().toISOString(),
    };

    writeData('registrations.json', [...registrations, newRegistration]);

    res.status(201).json({
      message: 'Successfully registered for event',
      registration: newRegistration,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Failed to register for event' });
  }
});

// Get user's registrations
router.get('/my-registrations', authenticate, (req, res) => {
  try {
    const userId = req.user.id;
    const registrations = readData('registrations.json');
    const events = readData('events.json');

    const userRegistrations = registrations
      .filter(r => r.userId === userId)
      .map(reg => {
        const event = events.find(e => e.id === reg.eventId);
        return {
          ...reg,
          event: event || null,
        };
      })
      .filter(reg => reg.event !== null); // Only include if event still exists

    res.json({ registrations: userRegistrations });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ message: 'Failed to fetch registrations' });
  }
});

// Check if user is registered for an event
router.get('/check/:eventId', authenticate, (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const registrations = readData('registrations.json');
    const isRegistered = registrations.some(
      r => r.eventId === eventId && r.userId === userId
    );

    res.json({ isRegistered });
  } catch (error) {
    console.error('Check registration error:', error);
    res.status(500).json({ message: 'Failed to check registration' });
  }
});

// Cancel registration
router.delete('/:eventId', authenticate, (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const registrations = readData('registrations.json');
    const filtered = registrations.filter(
      r => !(r.eventId === eventId && r.userId === userId)
    );

    if (filtered.length === registrations.length) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    writeData('registrations.json', filtered);

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({ message: 'Failed to cancel registration' });
  }
});

// Get all registrations for an event (Admin only)
router.get('/event/:eventId', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { eventId } = req.params;
    const registrations = readData('registrations.json');
    const users = readData('users.json');

    const eventRegistrations = registrations
      .filter(r => r.eventId === eventId)
      .map(reg => {
        const user = users.find(u => u.id === reg.userId);
        return {
          ...reg,
          user: user ? { id: user.id, name: user.name, email: user.email } : null,
        };
      });

    res.json({ registrations: eventRegistrations });
  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({ message: 'Failed to fetch event registrations' });
  }
});

export default router;

