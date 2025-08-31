import React, { useState, useRef, WheelEvent, MouseEvent as ReactMouseEvent } from 'react';
import { ComparisonSlider } from './ComparisonSlider';
import { ZoomInIcon } from './icons/ZoomInIcon';
import { ZoomOutIcon } from './icons/ZoomOutIcon';
import { ResetZoomIcon } from './icons/ResetZoomIcon';
import { Tooltip } from './Tooltip';

interface ImagePreviewerProps {
  originalImageUrl: string;
  enhancedImageUrl: string | null;
  isLoading: boolean;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-fuchsia-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="mt-4 text-lg font-semibold text-gray-300">Enhancing Image...</p>
      <p className="text-sm text-gray-500">This may take a moment.</p>
    </div>
);

export const ImagePreviewer: React.FC<ImagePreviewerProps> = ({ originalImageUrl, enhancedImageUrl, isLoading }) => {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const newScale = scale - e.deltaY * 0.001;
    setScale(Math.min(Math.max(1, newScale), 5));
  };

  const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (scale > 1) {
        setIsPanning(true);
        e.currentTarget.style.cursor = 'grabbing';
    }
  };

  const handleMouseUp = (e: ReactMouseEvent<HTMLDivElement>) => {
    setIsPanning(false);
    e.currentTarget.style.cursor = scale > 1 ? 'grab' : 'default';
  };

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    setOffset(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
    }));
  };

  const handleMouseLeave = (e: ReactMouseEvent<HTMLDivElement>) => {
    setIsPanning(false);
    e.currentTarget.style.cursor = scale > 1 ? 'grab' : 'default';
  };
  
  const resetZoom = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };
  
  return (
    <div className="relative w-full aspect-video bg-gray-800 rounded-2xl border-2 border-gray-700 flex items-center justify-center p-2 overflow-hidden" ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: scale > 1 ? 'grab' : 'default' }}
    >
      <div className="absolute inset-0 flex items-center justify-center transition-transform duration-100" style={{ transform: `scale(${scale}) translate(${offset.x}px, ${offset.y}px)` }}>
        {enhancedImageUrl ? (
            <ComparisonSlider originalImageUrl={originalImageUrl} enhancedImageUrl={enhancedImageUrl} />
        ) : (
            <img src={originalImageUrl} alt="Original Preview" className="max-w-full max-h-full object-contain rounded-lg" />
        )}
      </div>

       {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-2xl z-20">
            <LoadingSpinner />
          </div>
        )}
      
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
         <Tooltip text="Zoom In">
           <button onClick={() => setScale(s => Math.min(s + 0.2, 5))} className="p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors">
              <ZoomInIcon className="w-6 h-6" />
           </button>
         </Tooltip>
         <Tooltip text="Zoom Out">
           <button onClick={() => setScale(s => Math.max(s - 0.2, 1))} className="p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors">
              <ZoomOutIcon className="w-6 h-6" />
           </button>
         </Tooltip>
         {scale > 1 && (
            <Tooltip text="Reset Zoom">
              <button onClick={resetZoom} className="p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors">
                  <ResetZoomIcon className="w-6 h-6" />
              </button>
            </Tooltip>
         )}
      </div>
    </div>
  );
};