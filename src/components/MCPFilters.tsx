
import React from 'react';
import { Filter } from 'lucide-react';

interface MCPFiltersProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const MCPFilters = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm
}: MCPFiltersProps) => {
  return (
    <div className="lg:w-64 flex-shrink-0">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 sticky top-24">
        <div className="flex items-center space-x-2 mb-6">
          <Filter className="h-5 w-5 text-slate-400" />
          <h3 className="text-lg font-semibold text-white">Filters</h3>
        </div>

        {/* Search */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Search</h4>
          <input
            type="text"
            placeholder="Search MCP servers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-3">Category</h4>
          <div className="space-y-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCPFilters;
