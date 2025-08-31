import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { DownloadButton } from './components/DownloadButton';
import { enhanceImage, analyzeImageSafety, EnhancementMode } from './services/geminiService';
import { ErrorIcon } from './components/icons/ErrorIcon';
import { ControlPanel } from './components/ControlPanel';
import { ImagePreviewer } from './components/ImagePreviewer';
import { Tooltip } from './components/Tooltip';

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center text-center p-4 bg-gray-800 rounded-2xl border-2 border-red-500/50 w-full max-w-4xl aspect-video">
        <ErrorIcon className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-lg font-semibold text-red-400">Request Blocked</p>
        <p className="text-sm text-gray-400 mt-2">{message}</p>
    </div>
);


const App: React.FC = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [referenceImageFile, setReferenceImageFile] = useState<File | null>(null);
  const [referenceImageUrl, setReferenceImageUrl] = useState<string | null>(null);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [enhancementMode, setEnhancementMode] = useState<EnhancementMode>('beautify');

  const handleRemoveReferenceImage = useCallback(() => {
    if (referenceImageUrl) URL.revokeObjectURL(referenceImageUrl);
    setReferenceImageFile(null);
    setReferenceImageUrl(null);
  }, [referenceImageUrl]);

  const handleReset = useCallback(() => {
    if (originalImageUrl) URL.revokeObjectURL(originalImageUrl);
    if (enhancedImageUrl) URL.revokeObjectURL(enhancedImageUrl);
    handleRemoveReferenceImage();
    setOriginalImageFile(null);
    setOriginalImageUrl(null);
    setEnhancedImageUrl(null);
    setError(null);
    setIsLoading(false);
  }, [originalImageUrl, enhancedImageUrl, handleRemoveReferenceImage]);

  const handleImageUpload = useCallback((file: File) => {
    handleReset();
    setOriginalImageFile(file);
    setOriginalImageUrl(URL.createObjectURL(file));
  }, [handleReset]);
  
  const handleReferenceImageUpload = useCallback((file: File) => {
    handleRemoveReferenceImage();
    setReferenceImageFile(file);
    setReferenceImageUrl(URL.createObjectURL(file));
  }, [handleRemoveReferenceImage]);


  const handleEnhance = useCallback(async () => {
    if (!originalImageFile) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEnhancedImageUrl(null);

    try {
      const safetyResult = await analyzeImageSafety(originalImageFile);
      if (!safetyResult.isSafe) {
        setError(`For safety reasons, images of ${safetyResult.reason}s cannot be processed. Please upload a different photo.`);
        return;
      }

      const enhancedImageBase64 = await enhanceImage(originalImageFile, enhancementMode, referenceImageFile);
      if (enhancedImageBase64) {
        const mimeType = originalImageFile.type || 'image/png';
        setEnhancedImageUrl(`data:${mimeType};base64,${enhancedImageBase64}`);
      } else {
        setError('The AI could not process this image. Please try another one.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while enhancing the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImageFile, enhancementMode, referenceImageFile]);

  const isEnhanceDisabled = !originalImageFile || isLoading || (enhancementMode === 'reference' && !referenceImageFile);
  
  return (
    <div className="min-h-screen bg-gray-900 font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <Header />
      <main className="w-full max-w-7xl flex-grow flex flex-col items-center">
        {error ? (
          <div className="flex flex-col items-center w-full">
            <ErrorDisplay message={error} />
            <button
              onClick={handleReset}
              className="mt-8 inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {!originalImageUrl ? (
                 <ImageUploader onImageUpload={handleImageUpload} currentImageUrl={null} />
              ) : (
                <ImagePreviewer
                  originalImageUrl={originalImageUrl}
                  enhancedImageUrl={enhancedImageUrl}
                  isLoading={isLoading}
                />
              )}
            </div>
            <div className="lg:col-span-1">
              <ControlPanel
                selectedMode={enhancementMode}
                onModeChange={setEnhancementMode}
                onEnhance={handleEnhance}
                isEnhanceDisabled={isEnhanceDisabled}
                isProcessing={isLoading}
                referenceImageUrl={referenceImageUrl}
                onReferenceImageUpload={handleReferenceImageUpload}
                onRemoveReferenceImage={handleRemoveReferenceImage}
              />
              {enhancedImageUrl && !isLoading && (
                 <div className="mt-6 flex flex-col items-center gap-4">
                    <Tooltip text="Download the enhanced image as a PNG file.">
                      <DownloadButton imageUrl={enhancedImageUrl} />
                    </Tooltip>
                     <Tooltip text="Start over with a new image." display="block">
                       <button
                          onClick={handleReset}
                          className="w-full inline-flex items-center justify-center px-6 py-3 text-md font-semibold text-cyan-200 bg-gray-700 border border-gray-600 rounded-full shadow-md transition-colors duration-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500"
                        >
                          Enhance Another
                        </button>
                    </Tooltip>
                 </div>
              )}
            </div>
          </div>
        )}
      </main>
      <footer className="w-full text-center p-4 mt-8 text-gray-500 text-sm">
        <p>Powered by Gemini AI. For best results, use high-quality photos.</p>
      </footer>
    </div>
  );
};

export default App;