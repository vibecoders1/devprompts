
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MCPCard from './MCPCard';
import { ArrowRight, Server } from 'lucide-react';

const mockMCPs = [
  {
    id: 'java-conferences',
    name: 'Java Conferences',
    description: 'Provides access to Java conference information by parsing GitHub-hosted markdown files, enabling filtering by location, date, and topic to help developers find relevant events.',
    author: 'Martin Lippert',
    version: '1.0.0',
    downloads: 1234,
    rating: 4.3,
    tags: ['conferences', 'java', 'events', 'github'],
    category: 'Development'
  },
  {
    id: 'dummyjson-user',
    name: 'DummyJSON User Management',
    description: 'Java-based user management server that integrates with DummyJSON API to provide retrieval, search, creation, and user management capabilities.',
    author: 'DummyJSON',
    version: '1.2.0',
    downloads: 2456,
    rating: 4.2,
    tags: ['user-management', 'api', 'json', 'rest'],
    category: 'API'
  },
  {
    id: 'agentic-system-monitoring',
    name: 'Agentic (System Monitoring & RAG)',
    description: 'Spring Boot-based server that connects system monitoring tools with a RAG service, enabling real-time access to system metrics and intelligent monitoring.',
    author: 'SpringIO',
    version: '2.1.0',
    downloads: 3421,
    rating: 4.1,
    tags: ['monitoring', 'rag', 'spring-boot', 'metrics'],
    category: 'Monitoring'
  },
  {
    id: 'confluence-cloud',
    name: 'Confluence Cloud',
    description: 'Integrates with Confluence Cloud to enable listing, creating, and analyzing organizational knowledge stored in Confluence workspaces.',
    author: 'Atlassian',
    version: '1.3.1',
    downloads: 2934,
    rating: 4.5,
    tags: ['confluence', 'cloud', 'knowledge-management', 'atlassian'],
    category: 'Productivity'
  },
  {
    id: 'sparql-server',
    name: 'SPARQL',
    description: 'Integrates with SPARQL servers to enable querying and manipulation of RDF data sources, facilitating semantic data operations.',
    author: 'W3C',
    version: '1.0.2',
    downloads: 1876,
    rating: 4.2,
    tags: ['sparql', 'rdf', 'semantic-web', 'query'],
    category: 'Database'
  },
  {
    id: 'redis-server',
    name: 'Redis',
    description: 'Enables AI tools to interact with Redis databases through key-value operations, pattern-based key listing, and advanced data manipulation.',
    author: 'Redis Labs',
    version: '3.2.0',
    downloads: 4532,
    rating: 4.8,
    tags: ['redis', 'database', 'key-value', 'caching'],
    category: 'Database'
  }
];

const MCPSection = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [languageFilter, setLanguageFilter] = useState('all');

  const categories = ['all', ...new Set(mockMCPs.map(mcp => mcp.category.toLowerCase()))];

  const filteredAndSortedMCPs = mockMCPs
    .filter(mcp => {
      const matchesSearch = mcp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           mcp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           mcp.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = languageFilter === 'all' || mcp.category.toLowerCase() === languageFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'downloads':
          return b.downloads - a.downloads;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Server className="h-8 w-8 text-green-400" />
            <span className="text-sm font-medium text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
              5.0K servers (and counting)
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Find MCP servers to give AI <br />
            <span className="text-gradient bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              agents superpowers
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            MCP servers give your AI agents access to external tools and services. 
            Search our huge MCP directory and add to Cursor, Claude, Windsurf, and more.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search servers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="rating">Sort by Rating</option>
                <option value="downloads">Sort by Downloads</option>
                <option value="name">Sort by Name</option>
              </select>
              <select 
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.filter(cat => cat !== 'all').map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* MCP Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredAndSortedMCPs.map((mcp) => (
            <MCPCard key={mcp.id} {...mcp} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button 
            onClick={() => navigate('/tools')}
            className="group inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-200 hover:transform hover:scale-105"
          >
            <span>Explore All MCPs</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default MCPSection;
