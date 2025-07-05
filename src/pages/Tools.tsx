
import React, { useState } from 'react';
import MCPCard from '../components/MCPCard';
import MCPFilters from '../components/MCPFilters';

const Tools = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample MCP data
  const mcpServers = [
    {
      id: 'brave-search',
      name: 'Brave Search MCP',
      description: 'Search the web using Brave Search API for real-time information and research.',
      author: 'Brave Software',
      version: '1.2.0',
      downloads: 2341,
      rating: 4.8,
      tags: ['Search', 'Web', 'Research'],
      category: 'Search'
    },
    {
      id: 'github-mcp',
      name: 'GitHub MCP Server',
      description: 'Interact with GitHub repositories, issues, pull requests and manage your development workflow.',
      author: 'GitHub Inc.',
      version: '2.1.0',
      downloads: 5672,
      rating: 4.9,
      tags: ['Git', 'Repository', 'Development'],
      category: 'Development'
    },
    {
      id: 'postgres-mcp',
      name: 'PostgreSQL MCP',
      description: 'Connect and query PostgreSQL databases with full SQL support and schema introspection.',
      author: 'PostgreSQL Team',
      version: '1.5.2',
      downloads: 3421,
      rating: 4.7,
      tags: ['Database', 'SQL', 'PostgreSQL'],
      category: 'Database'
    },
    {
      id: 'slack-mcp',
      name: 'Slack MCP Server',
      description: 'Send messages, create channels, and manage Slack workspace communications.',
      author: 'Slack Technologies',
      version: '1.0.8',
      downloads: 1876,
      rating: 4.6,
      tags: ['Communication', 'Team', 'Notifications'],
      category: 'Communication'
    },
    {
      id: 'notion-mcp',
      name: 'Notion MCP',
      description: 'Create, read, and update Notion pages and databases for knowledge management.',
      author: 'Notion Labs',
      version: '1.3.1',
      downloads: 2934,
      rating: 4.5,
      tags: ['Productivity', 'Notes', 'Database'],
      category: 'Productivity'
    },
    {
      id: 'anthropic-mcp',
      name: 'Anthropic MCP Kit',
      description: 'Official MCP development tools and utilities from Anthropic for building custom servers.',
      author: 'Anthropic',
      version: '0.9.0',
      downloads: 4532,
      rating: 4.8,
      tags: ['Development', 'Tools', 'SDK'],
      category: 'Development'
    }
  ];

  const categories = ['All', ...new Set(mcpServers.map(server => server.category))];

  const filteredServers = mcpServers.filter(server => {
    const categoryMatch = selectedCategory === 'All' || server.category === selectedCategory;
    const searchMatch = searchTerm === '' || 
      server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return categoryMatch && searchMatch;
  });

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">MCP Servers</h1>
          <p className="text-xl text-slate-300">
            Model Context Protocol servers to extend your AI capabilities
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <MCPFilters
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-slate-400">
                {filteredServers.length} server{filteredServers.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredServers.map(server => (
                <MCPCard key={server.id} {...server} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
