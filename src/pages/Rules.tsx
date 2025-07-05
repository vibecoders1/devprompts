
import React from 'react';
import RulesList from '@/components/RulesList';

const Rules = () => {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Cursor Rules</h1>
          <p className="text-xl text-slate-300">
            Curated .mdc rules to enhance your AI development experience
          </p>
        </div>

        <RulesList />
      </div>
    </div>
  );
};

export default Rules;
