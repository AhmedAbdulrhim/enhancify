import React from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  display?: 'block' | 'inline-block';
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children, display = 'inline-block' }) => {
  return (
    <div className={`relative group ${display}`}>
      {children}
      <div
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 text-center text-sm font-medium text-white bg-gray-700 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50"
        role="tooltip"
      >
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-700"></div>
      </div>
    </div>
  );
};
