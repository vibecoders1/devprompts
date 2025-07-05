
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MCPSection from '../components/MCPSection';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            DevPrompts for <br />
            <span className="text-gradient bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Modern Developers
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Curated AI prompts, Cursor rules, and multi-context prompts for modern software development. 
            Enhance your coding workflow with powerful AI tools and resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/prompts')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-colors"
            >
              Explore Prompts
            </button>
            <button 
              onClick={() => navigate('/rules')}
              className="border border-slate-700 hover:border-slate-600 text-white px-8 py-4 rounded-lg font-medium transition-colors"
            >
              Browse Rules
            </button>
          </div>
        </div>
      </section>
      
      {/* MCP Section */}
      <MCPSection />
      
      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-slate-300">AI Prompts</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">200+</div>
              <div className="text-slate-300">Cursor Rules</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">5K+</div>
              <div className="text-slate-300">MCP Servers</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
