import React from 'react';
import { EnhancementMode } from '../services/geminiService';
import { FaceIcon } from './icons/FaceIcon';
import { UpscaleIcon } from './icons/UpscaleIcon';
import { ColorFixIcon } from './icons/ColorFixIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { Tooltip } from './Tooltip';
import { ReferenceIcon } from './icons/ReferenceIcon';
import { ReferenceImageUploader } from './ReferenceImageUploader';

interface ControlPanelProps {
  selectedMode: EnhancementMode;
  onModeChange: (mode: EnhancementMode) => void;
  onEnhance: () => void;
  isEnhanceDisabled: boolean;
  isProcessing: boolean;
  referenceImageUrl: string | null;
  onReferenceImageUpload: (file: File) => void;
  onRemoveReferenceImage: () => void;
}

const tools: { id: EnhancementMode; name: string; icon: React.FC<React.SVGProps<SVGSVGElement>>; description: string }[] = [
  { id: 'beautify', name: 'Face Beautify', icon: FaceIcon, description: 'Smooths skin, removes blemishes, and enhances facial features for a professional portrait look.' },
  { id: 'upscale', name: 'Upscale to 4K', icon: UpscaleIcon, description: 'Increases image resolution and sharpens details for a crisp, high-definition result.' },
  { id: 'colorfix', name: 'Color & Light Fix', icon: ColorFixIcon, description: 'Automatically corrects white balance, improves vibrancy, and balances lighting.' },
  { id: 'reference', name: 'Reference Style', icon: ReferenceIcon, description: 'Applies the style, color, and lighting from a reference image to your photo.' },
];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedMode,
  onModeChange,
  onEnhance,
  isEnhanceDisabled,
  isProcessing,
  referenceImageUrl,
  onReferenceImageUpload,
  onRemoveReferenceImage,
}) => {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 h-full flex flex-col">
      <h2 className="text-xl font-bold text-white mb-4">Enhancement Tools</h2>
      <div className="space-y-3 mb-6 flex-grow">
        {tools.map((tool) => (
          <Tooltip key={tool.id} text={tool.description} display="block">
            <button
              onClick={() => onModeChange(tool.id)}
              className={`w-full flex items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedMode === tool.id
                  ? 'bg-cyan-900/50 border-cyan-500 text-white'
                  : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
              }`}
            >
              <tool.icon className="w-6 h-6 mr-4" />
              <span className="font-semibold">{tool.name}</span>
            </button>
          </Tooltip>
        ))}
        {selectedMode === 'reference' && (
          <div className="mt-4">
             <ReferenceImageUploader 
                onImageUpload={onReferenceImageUpload}
                imageUrl={referenceImageUrl}
                onRemove={onRemoveReferenceImage}
              />
          </div>
        )}
      </div>
      <button
        onClick={onEnhance}
        disabled={isEnhanceDisabled}
        className="w-full inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <SparklesIcon className="w-6 h-6 mr-2" />
            Enhance Image
          </>
        )}
      </button>
    </div>
  );
};