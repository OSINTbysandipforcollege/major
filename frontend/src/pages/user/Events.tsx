import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import EventCard from '../../components/EventCard';
import { Event } from '../../models/interfaces';
import { Loader2 } from 'lucide-react';
import { fetchEvents } from '../../services/eventsApi';

const Events: React.FC = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [completedEvents, setCompletedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const events = await fetchEvents();
      
      const upcoming = events.filter(event => !event.isCompleted);
      const completed = events.filter(event => event.isCompleted);

      setUpcomingEvents(upcoming);
      setCompletedEvents(completed);
    } catch (err) {
      setError('Failed to fetch events. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-green-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Upcoming Events
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
          {upcomingEvents.map(event => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              organization={event.organization}
              description={event.description}
              location={event.location}
              date={new Date(event.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              isUpcoming={true}
              onRegistrationChange={loadEvents}
            />
          ))}
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Completed Events
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedEvents.map(event => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              organization={event.organization}
              description={event.description}
              location={event.location}
              date={new Date(event.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              isUpcoming={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;