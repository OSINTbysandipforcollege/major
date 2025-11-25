import React from "react";

const ContactsPage: React.FC = () => {
    const contacts = [
        { id: 1, name: "NDRF HQ", phone: "+91-1122334455", email: "ndrf@india.gov.in" },
        { id: 2, name: "SDRF Bihar", phone: "+91-9988776655", email: "sdrf-bihar@rescue.in" },
        { id: 3, name: "Local Fire Station", phone: "101", email: "fire@local.in" },
        { id: 4, name: "Hospital Emergency", phone: "108", email: "hospital@emergency.in" },
    ];

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">📞 Emergency Contacts</h2>
            <ul className="space-y-4">
                {contacts.map(contact => (
                    <li key={contact.id} className="border p-4 rounded bg-gray-50">
                        <p className="font-bold">{contact.name}</p>
                        <p>📞 {contact.phone}</p>
                        <p>✉️ {contact.email}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContactsPage;
