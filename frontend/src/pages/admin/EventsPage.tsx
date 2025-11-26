import React, { useState, useEffect } from "react";
import { Event } from "../../models/interfaces";
import { fetchEvents, createEvent, updateEvent, deleteEvent } from "../../services/eventsApi";

const EventsPage: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newEvent, setNewEvent] = useState({
        title: "",
        organization: "",
        location: "",
        date: "",
        description: ""
    });

    const loadEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedEvents = await fetchEvents();
            setEvents(fetchedEvents);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load events");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEvents();
    }, []);

    const handleAddEvent = async () => {
        if (!newEvent.title || !newEvent.location || !newEvent.date) {
            alert("Please fill in title, location, and date");
            return;
        }

        try {
            await createEvent({
                title: newEvent.title,
                organization: newEvent.organization || "ResQConnect",
                description: newEvent.description,
                location: newEvent.location,
                date: newEvent.date,
            });
            setNewEvent({ title: "", organization: "", location: "", date: "", description: "" });
            await loadEvents();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to create event");
        }
    };

    const handleDeleteEvent = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event?")) {
            return;
        }

        try {
            await deleteEvent(id);
            await loadEvents();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to delete event");
        }
    };

    const handleToggleCompleted = async (event: Event) => {
        try {
            await updateEvent(event.id, { isCompleted: !event.isCompleted });
            await loadEvents();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to update event");
        }
    };

    if (loading) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
            <h2 className="text-xl font-semibold">📅 Manage Events</h2>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Add New Event */}
            <div className="p-4 bg-gray-100 rounded space-y-3">
                <h3 className="font-medium">Add New Event</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                        className="border border-gray-300 rounded p-2"
                        placeholder="Title *"
                        value={newEvent.title}
                        onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                    />
                    <input
                        className="border border-gray-300 rounded p-2"
                        placeholder="Organization"
                        value={newEvent.organization}
                        onChange={e => setNewEvent({ ...newEvent, organization: e.target.value })}
                    />
                    <input
                        className="border border-gray-300 rounded p-2"
                        placeholder="Location *"
                        value={newEvent.location}
                        onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                    />
                    <input
                        type="date"
                        className="border border-gray-300 rounded p-2"
                        value={newEvent.date}
                        onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                </div>
                <textarea
                    className="w-full border border-gray-300 rounded p-2"
                    placeholder="Description"
                    rows={3}
                    value={newEvent.description}
                    onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                />
                <button
                    onClick={handleAddEvent}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                >
                    Add Event
                </button>
            </div>

            {/* Event List */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">All Events ({events.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {events.map(event => (
                        <div key={event.id} className="border border-gray-200 p-4 rounded bg-white shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg">{event.title}</h3>
                                <button
                                    onClick={() => handleDeleteEvent(event.id)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{event.organization}</p>
                            <p className="text-sm text-gray-700 mb-2">{event.description}</p>
                            <p className="text-sm text-gray-600 mb-2">
                                📍 {event.location} • 📅 {new Date(event.date).toLocaleDateString()}
                            </p>
                            <button
                                onClick={() => handleToggleCompleted(event)}
                                className={`text-sm px-3 py-1 rounded ${
                                    event.isCompleted
                                        ? "bg-gray-200 text-gray-700"
                                        : "bg-green-100 text-green-700"
                                }`}
                            >
                                {event.isCompleted ? "Mark as Upcoming" : "Mark as Completed"}
                            </button>
                        </div>
                    ))}
                </div>
                {events.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No events yet. Create one above!</p>
                )}
            </div>
        </div>
    );
};

export default EventsPage;
