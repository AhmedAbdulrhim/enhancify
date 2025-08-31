import React, { useState } from 'react';
import { LeftRightIcon } from './icons/LeftRightIcon';

interface ComparisonSliderProps {
  originalImageUrl: string;
  enhancedImageUrl: string;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ originalImageUrl, enhancedImageUrl }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleInteractionStart = () => {
    setIsDragging(true);
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  const handleInteractionEnd = () => {
    setIsDragging(false);
    // Snap logic
    setSliderPosition(currentPosition => {
      if (currentPosition < 15) return 0;
      if (currentPosition > 85) return 100;
      if (currentPosition > 40 && currentPosition < 60) return 50;
      return currentPosition;
    });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };
  
  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden group select-none">
      {/* Original Image */}
      <img
        src={originalImageUrl}
        alt="Original"
        className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
      />
      
      {/* Enhanced Image container, clipped by slider */}
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ 
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          transition: isDragging ? 'none' : 'clip-path 0.3s ease-out'
        }}
      >
        <img
          src={enhancedImageUrl}
          alt="Enhanced"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Slider input */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={handleSliderChange}
        onMouseDown={handleInteractionStart}
        onMouseUp={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
        className="absolute top-0 left-0 w-full h-full cursor-col-resize opacity-0"
        aria-label="Image comparison slider"
      />

      {/* Slider Handle visual */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white/75 pointer-events-none transition-all duration-300 ease-out opacity-0 group-hover:opacity-100"
        style={{ 
          left: `${sliderPosition}%`, 
          transform: 'translateX(-50%)',
          transition: isDragging ? 'none' : 'left 0.3s ease-out'
        }}
      >
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/50 border-2 border-white flex items-center justify-center shadow-lg transition-transform duration-200 ease-in-out ${isDragging ? 'scale-125' : 'scale-100'}`}>
          <LeftRightIcon className="w-6 h-6 text-gray-900" />
        </div>
      </div>

      {/* Instructional Text - Fades out on interaction */}
      <div 
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 text-white text-sm font-bold rounded-full pointer-events-none transition-opacity duration-500 ${hasInteracted ? 'opacity-0' : 'opacity-100 animate-pulse'}`}
      >
        Drag to Compare
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 text-white text-sm font-bold rounded-full pointer-events-none" style={{ opacity: sliderPosition > 10 ? 1 : 0, transition: 'opacity 0.3s' }}>
        Original
      </div>
      <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 text-white text-sm font-bold rounded-full pointer-events-none" style={{ opacity: sliderPosition < 90 ? 1 : 0, transition: 'opacity 0.3s' }}>
        Enhanced
      </div>
    </div>
  );
};
