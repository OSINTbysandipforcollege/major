import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import EventCard from '../../components/EventCard';
import { Event } from '../../models/interfaces';
import { Loader2 } from 'lucide-react';

const Events: React.FC = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [completedEvents, setCompletedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock API call - replace with real API endpoint later
  const fetchEvents = async () => {
    try {
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const currentDate = new Date();
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'NDRF Mock Drill Exercise',
          organization: 'NDRF',
          description: 'Advanced disaster response training with practical demonstrations and hands-on exercises',
          location: 'Reliance Shopping Mall',
          date: '2025-05-15',
          isCompleted: false
        },
        {
          id: '2',
          title: 'SDRF Emergency Response Workshop',
          organization: 'SDRF',
          description: 'Comprehensive workshop on emergency response protocols and rescue operations',
          location: 'City Stadium',
          date: '2025-06-20',
          isCompleted: false
        },
        {
          id: '3',
          title: 'Urban Search & Rescue Training',
          organization: 'NDRF',
          description: 'Specialized training for urban disaster scenarios and search operations',
          location: 'Metro Convention Center',
          date: '2025-07-10',
          isCompleted: false
        },
        {
          id: '4',
          title: 'Community Preparedness Seminar',
          organization: 'Civil Defense',
          description: 'Educational seminar on disaster preparedness for community leaders',
          location: 'Civic Center',
          date: '2025-01-08',
          isCompleted: true
        },
        {
          id: '5',
          title: 'Earthquake Response Drill',
          organization: 'NDRF',
          description: 'Large-scale earthquake response simulation with multiple agencies',
          location: 'District Training Center',
          date: '2025-02-20',
          isCompleted: true
        },
        {
          id: '6',
          title: 'Flood Rescue Operations Training',
          organization: 'SDRF',
          description: 'Specialized training for flood rescue and evacuation procedures',
          location: 'River Training Facility',
          date: '2025-03-15',
          isCompleted: true
        }
      ];

      const upcoming = mockEvents.filter(event => !event.isCompleted);
      const completed = mockEvents.filter(event => event.isCompleted);

      setUpcomingEvents(upcoming);
      setCompletedEvents(completed);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch events. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
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