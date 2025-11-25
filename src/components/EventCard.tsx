import React from 'react';
import { CalendarDays, MapPin } from 'lucide-react';

interface EventCardProps {
  id: string;
  title: string;
  organization: string;
  description: string;
  location: string;
  date: string;
  isUpcoming?: boolean;
  logoUrl?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  organization,
  description,
  location,
  date,
  isUpcoming = true,
  logoUrl,
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 p-4">
      <div className="flex items-start mb-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center mr-3">
          {logoUrl ? (
            <img src={logoUrl} alt={organization} className="w-full h-full object-cover" />
          ) : (
            <div className="text-gray-500 font-bold text-xs">{organization.substring(0, 2).toUpperCase()}</div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600">{organization}</p>
        </div>
      </div>
      
      <p className="text-gray-700 text-sm mb-4">{description}</p>
      
      <div className="flex items-center text-sm text-gray-600 mb-2">
        <MapPin size={18} className="mr-2" />
        <span>{location}</span>
      </div>
      
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <CalendarDays size={18} className="mr-2" />
        <span>{date}</span>
      </div>
      
      {isUpcoming && (
        <button 
          className="bg-gray-800 hover:bg-gray-900 text-white text-sm uppercase font-medium py-2 px-4 rounded transition-colors"
        >
          REGISTER
        </button>
      )}
    </div>
  );
};

export default EventCard;