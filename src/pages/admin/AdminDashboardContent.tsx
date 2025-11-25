import React, { useState } from "react";
import {
    Calendar, Trash2, Edit, PlusCircle,
    CheckCircle
} from "lucide-react";

interface User {
    id: number;
    name: string;
    email: string;
    verified: boolean;
}

interface Event {
    id: number;
    title: string;
    location: string;
    date: string;
    description: string;
}

const AdminDashboardContent: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([
        { id: 1, title: "NDRF Mock Drill Exercise", location: "Reliance Mall", date: "2025-09-20", description: "Community Service Programme" },
        { id: 2, title: "SDRF Drill", location: "City Stadium", date: "2025-08-15", description: "Preparedness drill" },
    ]);

    const [newEvent, setNewEvent] = useState({ title: "", location: "", date: "", description: "" });

    const addEvent = () => {
        if (newEvent.title && newEvent.date) {
            setEvents([...events, { id: Date.now(), ...newEvent }]);
            setNewEvent({ title: "", location: "", date: "", description: "" });
        }
    };

    const deleteEvent = (id: number) => {
        setEvents(events.filter(e => e.id !== id));
    };

    const today = new Date().toISOString().split("T")[0];
    const upcomingEvents = events.filter(e => e.date >= today);
    const completedEvents = events.filter(e => e.date < today);

    const [users, setUsers] = useState<User[]>([
        { id: 1, name: "Arman Ahmad", email: "arman@example.com", verified: false },
        { id: 2, name: "John Doe", email: "john@example.com", verified: true },
        { id: 3, name: "Jane Smith", email: "jane@example.com", verified: false },
    ]);

    const verifyUser = (id: number) => {
        setUsers(users.map(u => u.id === id ? { ...u, verified: true } : u));
    };

    const deleteUser = (id: number) => {
        setUsers(users.filter(u => u.id !== id));
    };

    return (
        <div className="p-6 space-y-8">
            {/* Upcoming Events */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Calendar className="mr-2 text-green-600" /> Upcoming Events
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {upcomingEvents.map(event => (
                        <div key={event.id} className="border rounded-lg p-4 bg-gray-50 shadow-sm">
                            <h3 className="font-bold text-lg">{event.title}</h3>
                            <p className="text-gray-600">{event.description}</p>
                            <p className="text-sm mt-2">📍 {event.location}</p>
                            <p className="text-sm">📅 {event.date}</p>
                            <div className="flex gap-2 mt-3">
                                <button className="flex items-center text-sm bg-yellow-200 px-3 py-1 rounded-lg">
                                    <Edit size={14} className="mr-1" /> Edit
                                </button>
                                <button
                                    onClick={() => deleteEvent(event.id)}
                                    className="flex items-center text-sm bg-red-200 px-3 py-1 rounded-lg">
                                    <Trash2 size={14} className="mr-1" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add New Event */}
                <div className="mt-6">
                    <h3 className="font-semibold mb-2">➕ Add New Event</h3>
                    <div className="grid gap-2">
                        <input className="border p-2 rounded" placeholder="Event Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
                        <input className="border p-2 rounded" placeholder="Location" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} />
                        <input className="border p-2 rounded" type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
                        <textarea className="border p-2 rounded" placeholder="Description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}></textarea>
                        <button onClick={addEvent} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center mt-2">
                            <PlusCircle size={16} className="mr-1" /> Add Event
                        </button>
                    </div>
                </div>
            </div>

            {/* Completed Events */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">✅ Completed Events</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {completedEvents.length === 0 ? (
                        <p className="text-gray-500">No completed events yet.</p>
                    ) : (
                        completedEvents.map(event => (
                            <div key={event.id} className="border rounded-lg p-4 bg-gray-50 shadow-sm">
                                <h3 className="font-bold text-lg">{event.title}</h3>
                                <p className="text-gray-600">{event.description}</p>
                                <p className="text-sm mt-2">📍 {event.location}</p>
                                <p className="text-sm">📅 {event.date}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Registered Users */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">👥 Registered Users</h2>
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="text-center">
                                <td className="border p-2">{user.name}</td>
                                <td className="border p-2">{user.email}</td>
                                <td className="border p-2">
                                    {user.verified ? "✅ Verified" : "⏳ Pending"}
                                </td>
                                <td className="border p-2 flex justify-center gap-2">
                                    {!user.verified && (
                                        <button
                                            onClick={() => verifyUser(user.id)}
                                            className="bg-green-200 px-3 py-1 rounded flex items-center">
                                            <CheckCircle size={14} className="mr-1" /> Verify
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteUser(user.id)}
                                        className="bg-red-200 px-3 py-1 rounded flex items-center">
                                        <Trash2 size={14} className="mr-1" /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboardContent;
