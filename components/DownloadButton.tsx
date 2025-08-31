
import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';

interface DownloadButtonProps {
  imageUrl: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ imageUrl }) => {
  return (
    <a
      href={imageUrl}
      download={`enhanced-photo-${Date.now()}.png`}
      className="inline-flex items-center justify-center px-6 py-3 text-md font-semibold text-cyan-200 bg-gray-700 border border-gray-600 rounded-full shadow-md transition-colors duration-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500"
    >
      <DownloadIcon className="w-5 h-5 mr-2" />
      Download Image
    </a>
  );
};
