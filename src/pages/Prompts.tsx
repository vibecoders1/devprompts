
import React from 'react';
import PromptsList from '@/components/PromptsList';

const Prompts = () => {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">AI Prompts</h1>
          <p className="text-xl text-slate-300">
            Curated prompts for modern software development
          </p>
        </div>

        <PromptsList />
      </div>
    </div>
  );
};

export default Prompts;
