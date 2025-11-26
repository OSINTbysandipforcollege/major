import express from 'express';
import { randomUUID } from 'crypto';
import { readData, writeData, findById, findIndex } from '../utils/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Initialize default events if database is empty
const initializeEvents = () => {
  const events = readData('events.json');
  
  if (events.length === 0) {
    const defaultEvents = [
      {
        id: '1',
        title: 'NDRF Mock Drill Exercise',
        organization: 'NDRF',
        description: 'Advanced disaster response training with practical demonstrations and hands-on exercises',
        location: 'Reliance Shopping Mall',
        date: '2025-05-15',
        isCompleted: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'SDRF Emergency Response Workshop',
        organization: 'SDRF',
        description: 'Comprehensive workshop on emergency response protocols and rescue operations',
        location: 'City Stadium',
        date: '2025-06-20',
        isCompleted: false,
        createdAt: new Date().toISOString(),
      },
    ];
    writeData('events.json', defaultEvents);
  }
};

initializeEvents();

// Get all events (public, but authenticated users see more info)
router.get('/', authenticate, (req, res) => {
  try {
    const events = readData('events.json');
    
    // Sort: upcoming first, then by date
    const sorted = events.sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      return new Date(a.date) - new Date(b.date);
    });

    res.json({ events: sorted });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
});

// Get single event
router.get('/:id', authenticate, (req, res) => {
  try {
    const event = findById('events.json', req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ event });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Failed to fetch event' });
  }
});

// Create event (Admin only)
router.post('/', authenticate, requireAdmin, (req, res) => {
  try {
    const { title, organization, description, location, date } = req.body;

    if (!title || !location || !date) {
      return res.status(400).json({ message: 'Title, location, and date are required' });
    }

    const events = readData('events.json');
    
    const newEvent = {
      id: randomUUID(),
      title,
      organization: organization || 'ResQConnect',
      description: description || '',
      location,
      date,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };

    writeData('events.json', [...events, newEvent]);

    res.status(201).json({ event: newEvent });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Failed to create event' });
  }
});

// Update event (Admin only)
router.put('/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const { title, organization, description, location, date, isCompleted } = req.body;
    
    const event = findById('events.json', req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (organization !== undefined) updates.organization = organization;
    if (description !== undefined) updates.description = description;
    if (location !== undefined) updates.location = location;
    if (date !== undefined) updates.date = date;
    if (isCompleted !== undefined) updates.isCompleted = isCompleted;

    const events = readData('events.json');
    const index = findIndex('events.json', req.params.id);
    
    events[index] = { ...events[index], ...updates };
    writeData('events.json', events);

    res.json({ event: events[index] });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Failed to update event' });
  }
});

// Delete event (Admin only)
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const event = findById('events.json', req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const events = readData('events.json');
    const filtered = events.filter(e => e.id !== req.params.id);
    writeData('events.json', filtered);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Failed to delete event' });
  }
});

export default router;

