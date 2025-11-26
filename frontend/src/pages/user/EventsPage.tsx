import React from 'react';
import EventCard from '../../components/EventCard';

const EventsPage: React.FC = () => {
    const events = [
        {
            id: '1',
            title: 'Flood Awareness Seminar',
            organization: 'Disaster Relief Org',
            description: 'Join us to learn about flood safety measures.',
            location: 'Community Hall, Springfield',
            date: '2025-09-01',
            logoUrl: '',
        },
        {
            id: '2',
            title: 'Earthquake Preparedness Workshop',
            organization: 'Safety First',
            description: 'Learn how to stay safe during earthquakes.',
            location: 'Downtown Library',
            date: '2025-09-10',
            logoUrl: '',
        },
    ];

    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map(event => (
                <EventCard key={event.id} {...event} />
            ))}
        </div>
    );
};

export default EventsPage;
