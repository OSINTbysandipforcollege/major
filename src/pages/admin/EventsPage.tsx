import React, { useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";

interface Event {
    id: number;
    title: string;
    location: string;
    date: string;
    description: string;
}

const EventsPage: React.FC = () => {
    const [events, setEvents] = useLocalStorage<Event[]>("events", [
        { id: 1, title: "NDRF Mock Drill Exercise", location: "Reliance Mall", date: "2025-09-20", description: "Community Service Programme" },
        { id: 2, title: "SDRF Drill", location: "City Stadium", date: "2025-08-15", description: "Preparedness drill" },
        { id: 3, title: "Flood Relief Camp", location: "Bihar", date: "2025-07-12", description: "Medical & rescue operations" },
    ]);

    const [newEvent, setNewEvent] = useState<Event>({ id: 0, title: "", location: "", date: "", description: "" });

    const addEvent = () => {
        if (newEvent.title && newEvent.date) {
            setEvents([...events, { ...newEvent, id: events.length + 1 }]);
            setNewEvent({ id: 0, title: "", location: "", date: "", description: "" });
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
            <h2 className="text-xl font-semibold">📅 Manage Events</h2>

            {/* Add New Event */}
            <div className="p-4 bg-gray-100 rounded">
                <h3 className="font-medium mb-2">Add New Event</h3>
                <input className="border p-2 mr-2" placeholder="Title" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
                <input className="border p-2 mr-2" placeholder="Location" value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} />
                <input type="date" className="border p-2 mr-2" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} />
                <input className="border p-2 mr-2" placeholder="Description" value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} />
                <button onClick={addEvent} className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
            </div>

            {/* Event List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map(event => (
                    <div key={event.id} className="border p-4 rounded bg-white shadow">
                        <h3 className="font-bold">{event.title}</h3>
                        <p className="text-sm">{event.location} • {event.date}</p>
                        <p>{event.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventsPage;
