import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { Phone, MapPin } from 'lucide-react';

const ContactInfo: React.FC = () => {
  const contactData: Record<string, any[]> = {
    "Delhi": [
      { id: '1', name: 'Delhi Police Control Room', location: 'Police HQ, ITO, Delhi', phone: '+91-9810012345' },
      { id: '2', name: 'NDRF HQ', location: 'NDCC-II Building, Jai Singh Road, New Delhi', phone: '+91-9812345678' },
      { id: '3', name: 'SDRF Delhi', location: 'Civil Lines, Delhi', phone: '+91-9876543210' },
      { id: '4', name: 'Local Rescue & Fire Dept', location: 'Connaught Place, New Delhi', phone: '+91-9955443322' },
    ],
    "Mumbai": [
      { id: '1', name: 'Mumbai Police Control Room', location: 'Police HQ, Crawford Market, Mumbai', phone: '+91-9823456789' },
      { id: '2', name: 'NDRF Mumbai Unit', location: 'Andheri (E), Mumbai', phone: '+91-9833344556' },
      { id: '3', name: 'SDRF Maharashtra', location: 'Andheri East, Mumbai', phone: '+91-9765432109' },
      { id: '4', name: 'Mumbai Fire Brigade', location: 'Byculla, Mumbai', phone: '+91-9988776655' },
    ],
    "Chennai": [
      { id: '1', name: 'Chennai Police Control Room', location: 'Egmore, Chennai', phone: '+91-9841234567' },
      { id: '2', name: 'NDRF Tamil Nadu Unit', location: 'Arakkonam, Tamil Nadu', phone: '+91-9867894321' },
      { id: '3', name: 'SDRF Tamil Nadu', location: 'Kancheepuram, TN', phone: '+91-9944556677' },
      { id: '4', name: 'Chennai Fire & Rescue Services', location: 'Teynampet, Chennai', phone: '+91-9876501234' },
    ],
    "Guwahati": [
      { id: '1', name: 'Guwahati Police Control Room', location: 'Pan Bazaar, Guwahati', phone: '+91-9871112233' },
      { id: '2', name: 'NDRF Assam Unit', location: 'Patgaon, Guwahati', phone: '+91-9887766554' },
      { id: '3', name: 'SDRF Assam', location: 'Dispur, Guwahati', phone: '+91-9812233445' },
      { id: '4', name: 'Assam State Disaster Helpline', location: 'Dispur, Assam', phone: '+91-9844556677' },
    ],
    "Bhubaneswar": [
      { id: '1', name: 'Odisha Police Control Room', location: 'Bhubaneswar, Odisha', phone: '+91-9822123456' },
      { id: '2', name: 'NDRF Odisha Unit', location: 'Mundali, Cuttack', phone: '+91-9834456677' },
      { id: '3', name: 'Odisha SDRF', location: 'Cuttack, Odisha', phone: '+91-9876554433' },
      { id: '4', name: 'Fire & Disaster Response', location: 'Bhubaneswar', phone: '+91-9811002233' },
    ],
    "Himachal Pradesh": [
      { id: '1', name: 'Himachal Police Control Room', location: 'Shimla, HP', phone: '+91-9800012345' },
      { id: '2', name: 'NDRF Himachal Unit', location: 'Mandi, HP', phone: '+91-9812234567' },
      { id: '3', name: 'SDRF Himachal', location: 'Shimla, HP', phone: '+91-9876009988' },
      { id: '4', name: 'Fire & Rescue Services', location: 'Shimla, HP', phone: '+91-9899988776' },
    ],
    "Jammu & Kashmir": [
      { id: '1', name: 'J&K Police Control Room', location: 'Srinagar, J&K', phone: '+91-9797012345' },
      { id: '2', name: 'NDRF J&K Unit', location: 'Srinagar, J&K', phone: '+91-9798123456' },
      { id: '3', name: 'SDRF Jammu & Kashmir', location: 'Jammu', phone: '+91-9900123456' },
      { id: '4', name: 'Disaster Helpline', location: 'Srinagar/Jammu', phone: '+91-9798998877' },
    ],
    "West Bengal": [
      { id: '1', name: 'Kolkata Police Control Room', location: 'Lalbazar, Kolkata', phone: '+91-9830012345' },
      { id: '2', name: 'NDRF WB Unit', location: 'Haringhata, WB', phone: '+91-9831123456' },
      { id: '3', name: 'SDRF West Bengal', location: 'Nabanna, Howrah', phone: '+91-9832234567' },
      { id: '4', name: 'Fire & Emergency Services', location: 'Kolkata, WB', phone: '+91-9833344556' },
    ],
    "Kerala": [
      { id: '1', name: 'Kerala Police Control Room', location: 'Thiruvananthapuram, Kerala', phone: '+91-9847012345' },
      { id: '2', name: 'NDRF Kerala Unit', location: 'Thrissur, Kerala', phone: '+91-9848123456' },
      { id: '3', name: 'SDRF Kerala', location: 'Kottayam, Kerala', phone: '+91-9849234567' },
      { id: '4', name: 'Fire & Rescue Services', location: 'Ernakulam, Kerala', phone: '+91-9850011223' },
    ],
  };



  const [selectedCity, setSelectedCity] = useState("Delhi");

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Emergency Contact Details
        </h1>

        {/* Location Selector */}
        <div className="flex justify-center mb-6">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="border px-4 py-2 rounded-md shadow-sm"
          >
            {Object.keys(contactData).map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contactData[selectedCity].map((contact, index) => (
                  <tr key={contact.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <MapPin size={16} className="text-gray-500 mt-1 mr-1 flex-shrink-0" />
                        <div className="text-sm text-gray-900">{contact.location}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Phone size={16} className="text-gray-500 mr-1" />
                        <div className="text-sm text-gray-900">{contact.phone}</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
