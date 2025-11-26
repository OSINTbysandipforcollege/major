import React, { useState, useEffect } from 'react';
import { CalendarDays, MapPin, CheckCircle2 } from 'lucide-react';
import { registerForEvent, checkRegistration, cancelRegistration } from '../services/registrationsApi';

interface EventCardProps {
  id: string;
  title: string;
  organization: string;
  description: string;
  location: string;
  date: string;
  isUpcoming?: boolean;
  logoUrl?: string;
  onRegistrationChange?: () => void;
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
  onRegistrationChange,
}) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      if (isUpcoming) {
        try {
          const registered = await checkRegistration(id);
          setIsRegistered(registered);
        } catch (error) {
          console.error('Error checking registration:', error);
        } finally {
          setIsChecking(false);
        }
      } else {
        setIsChecking(false);
      }
    };
    checkStatus();
  }, [id, isUpcoming]);

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      if (isRegistered) {
        await cancelRegistration(id);
        setIsRegistered(false);
      } else {
        await registerForEvent(id);
        setIsRegistered(true);
      }
      if (onRegistrationChange) {
        onRegistrationChange();
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update registration');
    } finally {
      setIsLoading(false);
    }
  };

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
      
      {isUpcoming && !isChecking && (
        <button 
          onClick={handleRegister}
          disabled={isLoading}
          className={`w-full text-sm uppercase font-medium py-2 px-4 rounded transition-colors ${
            isRegistered
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-800 hover:bg-gray-900 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
        >
          {isLoading ? (
            'Processing...'
          ) : isRegistered ? (
            <>
              <CheckCircle2 size={16} />
              REGISTERED
            </>
          ) : (
            'REGISTER'
          )}
        </button>
      )}
    </div>
  );
};

export default EventCard;