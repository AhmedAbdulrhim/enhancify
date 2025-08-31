import React, { useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface ReferenceImageUploaderProps {
  onImageUpload: (file: File) => void;
  imageUrl: string | null;
  onRemove: () => void;
}

export const ReferenceImageUploader: React.FC<ReferenceImageUploaderProps> = ({ onImageUpload, imageUrl, onRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full p-3 bg-gray-700/50 rounded-lg border-2 border-gray-600">
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      {imageUrl ? (
        <div className="relative group w-full aspect-square">
            <img src={imageUrl} alt="Reference" className="w-full h-full object-cover rounded-md" />
            <button
                onClick={onRemove}
                className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove reference image"
            >
                <XCircleIcon className="w-6 h-6" />
            </button>
        </div>
      ) : (
        <button
          onClick={handleClick}
          className="w-full aspect-square flex flex-col items-center justify-center text-center cursor-pointer p-4 border-2 border-dashed border-gray-500 rounded-md hover:border-cyan-400 hover:bg-gray-700 transition-colors"
        >
          <UploadIcon className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm font-semibold text-gray-300">Upload Reference</p>
          <p className="text-xs text-gray-500">Style, color, lighting</p>
        </button>
      )}
    </div>
  );
};