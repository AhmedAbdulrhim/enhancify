import React, { useCallback, useRef, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  currentImageUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, currentImageUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const uploaderClasses = `w-full aspect-video bg-gray-800 rounded-2xl border-2 border-dashed flex items-center justify-center p-2 transition-all duration-300 ${isDragging ? 'border-cyan-400 bg-gray-700 scale-105' : 'border-gray-600 hover:border-cyan-400'}`;

  return (
    <div className={uploaderClasses}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      {currentImageUrl ? (
        <img src={currentImageUrl} alt="Original" className="max-w-full max-h-full object-contain rounded-lg" />
      ) : (
        <label
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          className="w-full h-full flex flex-col items-center justify-center text-center cursor-pointer p-4"
        >
          <UploadIcon className="w-16 h-16 text-gray-500 mb-4" />
          <p className="text-lg font-semibold text-gray-300">Click to upload or drag & drop</p>
          <p className="text-sm text-gray-500">PNG, JPG, or WEBP</p>
        </label>
      )}
    </div>
  );
};