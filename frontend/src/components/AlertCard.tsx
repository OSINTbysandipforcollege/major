import React from 'react';
import { Calendar, Eye } from 'lucide-react';

interface AlertCardProps {
  title: string;
  severity: 'minor' | 'moderate' | 'major' | 'catastrophic';
  date: string;
  affectedAreas: string[];
  onViewDetails: () => void;
}

const AlertCard: React.FC<AlertCardProps> = ({
  title,
  severity,
  date,
  affectedAreas,
  onViewDetails,
}) => {
  const severityColors = {
    minor: 'bg-blue-100 text-blue-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    major: 'bg-orange-500 text-white',
    catastrophic: 'bg-red-500 text-white',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <span 
            className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${severityColors[severity]}`}
          >
            {severity}
          </span>
        </div>
        
        <h4 className="text-sm font-medium text-gray-700 mb-2">Affected States</h4>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {affectedAreas.map((area, index) => (
            <span 
              key={index} 
              className="text-sm text-red-600"
            >
              {area}
              {index < affectedAreas.length - 1 && <span className="text-gray-400 ml-2 mr-2">|</span>}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-1" />
            <span>{date}</span>
          </div>
          
          <button 
            onClick={onViewDetails}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-4 rounded transition-colors"
          >
            <Eye size={16} className="mr-1" />
            VIEW ALERT !
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;