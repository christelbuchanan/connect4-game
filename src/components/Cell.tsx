import React from 'react';

interface CellProps {
  value: number | null;
  onClick: () => void;
  columnHover: boolean;
  isFalling?: boolean;
}

const Cell: React.FC<CellProps> = ({ value, onClick, columnHover, isFalling = false }) => {
  const getDiscColor = () => {
    if (value === 1) return 'bg-connect-red';
    if (value === 2) return 'bg-connect-yellow';
    return 'bg-transparent';
  };

  return (
    <div 
      className={`w-14 h-14 relative rounded-full cursor-pointer transition-all duration-300 
                 ${columnHover && !value ? 'bg-blue-700/30' : 'bg-transparent'}`}
      onClick={onClick}
    >
      {/* Disc */}
      <div 
        className={`absolute inset-1 rounded-full ${getDiscColor()} 
                   transition-all duration-150 transform ${value ? 'scale-100' : 'scale-0'} 
                   ${isFalling ? 'animate-pulse' : ''}`}
      >
        {/* Disc highlight */}
        {value && (
          <div className="absolute top-1 left-1 right-1 h-1/3 bg-white opacity-20 rounded-t-full"></div>
        )}
      </div>
    </div>
  );
};

export default Cell;
