
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-7xl text-center mb-8 sm:mb-12">
      <div className="inline-flex items-center gap-3">
        <SparklesIcon className="w-10 h-10 text-cyan-400" />
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500">
          4K Skin Enhancer AI
        </h1>
      </div>
      <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
        Upload a personal portrait and let our AI perfect the skin to a flawless, ultra-high-definition finish.
      </p>
      <p className="mt-2 text-sm text-gray-500 max-w-3xl mx-auto">
        For safety and privacy, please avoid uploading photos of celebrities or children.
      </p>
    </header>
  );
};