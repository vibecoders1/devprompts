
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Github, ExternalLink, Download, Calendar, User } from 'lucide-react';

const MCPDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in a real app, this would be fetched based on the ID
  const mcpData = {
    'java-conferences': {
      title: 'Java Conferences',
      description: 'Provides access to Java conference information by parsing GitHub-hosted markdown files, enabling filtering by location, date, and topic to help developers find relevant events.',
      fullDescription: 'This MCP server connects to various GitHub repositories that maintain lists of Java conferences worldwide. It provides comprehensive filtering capabilities allowing developers to find conferences by location, date range, topic focus, and conference type. The server parses markdown files containing structured conference data and presents it in a queryable format.',
      provider: 'Martin Lippert',
      language: 'Java',
      stars: 3,
      releaseDate: 'Jan 23, 2025',
      tags: ['conferences', 'java', 'events', 'github'],
      installCommand: 'npm install @mcp/java-conferences',
      githubUrl: 'https://github.com/example/java-conferences-mcp',
      features: [
        'Search conferences by location',
        'Filter by date range',
        'Topic-based filtering',
        'Real-time GitHub data parsing',
        'Conference type categorization'
      ]
    },
    'dummyjson-user': {
      title: 'DummyJSON User Management',
      description: 'Java-based user management server that integrates with DummyJSON API to provide retrieval, search, creation, and user management capabilities.',
      fullDescription: 'This MCP server provides comprehensive user management capabilities by integrating with the DummyJSON API. It offers full CRUD operations for user data, advanced search and filtering options, and real-time synchronization with external data sources.',
      provider: 'DummyJSON',
      language: 'JavaScript',
      stars: 2,
      releaseDate: 'Jan 20, 2025',
      tags: ['user-management', 'api', 'json', 'rest'],
      installCommand: 'npm install @mcp/dummyjson-user',
      githubUrl: 'https://github.com/example/dummyjson-user-mcp',
      features: [
        'User CRUD operations',
        'Advanced search capabilities',
        'Bulk user management',
        'Real-time data sync',
        'API rate limiting'
      ]
    },
    'agentic-system-monitoring': {
      title: 'Agentic (System Monitoring & RAG)',
      description: 'Spring Boot-based server that connects system monitoring tools with a RAG service, enabling real-time access to system metrics and intelligent monitoring.',
      fullDescription: 'This advanced MCP server combines system monitoring capabilities with Retrieval-Augmented Generation (RAG) technology. Built on Spring Boot, it provides intelligent monitoring solutions that can analyze system metrics, generate insights, and provide contextual recommendations based on historical data patterns.',
      provider: 'SpringIO',
      language: 'Java',
      stars: 1,
      releaseDate: 'Jan 18, 2025',
      tags: ['monitoring', 'rag', 'spring-boot', 'metrics'],
      installCommand: 'npm install @mcp/agentic-monitoring',
      githubUrl: 'https://github.com/example/agentic-monitoring-mcp',
      features: [
        'Real-time system monitoring',
        'RAG-powered insights',
        'Intelligent alerting',
        'Historical data analysis',
        'Custom metric tracking'
      ]
    },
    'confluence-cloud': {
      title: 'Confluence Cloud',
      description: 'Integrates with Confluence Cloud to enable listing, creating, and analyzing organizational knowledge stored in Confluence workspaces.',
      fullDescription: 'This MCP server provides seamless integration with Atlassian Confluence Cloud, allowing AI agents to interact with your organization\'s knowledge base. It supports reading, writing, and analyzing content across spaces, pages, and comments.',
      provider: 'Atlassian',
      language: 'TypeScript',
      stars: 2,
      releaseDate: 'Jan 15, 2025',
      tags: ['confluence', 'cloud', 'knowledge-management', 'atlassian'],
      installCommand: 'npm install @mcp/confluence-cloud',
      githubUrl: 'https://github.com/example/confluence-cloud-mcp',
      features: [
        'Read Confluence pages and spaces',
        'Create and update content',
        'Search across knowledge base',
        'Comment management',
        'Permission-aware operations'
      ]
    },
    'sparql-server': {
      title: 'SPARQL',
      description: 'Integrates with SPARQL servers to enable querying and manipulation of RDF data sources, facilitating semantic data operations.',
      fullDescription: 'This MCP server provides comprehensive SPARQL endpoint integration, enabling seamless interaction with RDF databases and semantic web technologies. It supports complex queries, data manipulation, and semantic reasoning capabilities.',
      provider: 'W3C',
      language: 'Python',
      stars: 2,
      releaseDate: 'Jan 12, 2025',
      tags: ['sparql', 'rdf', 'semantic-web', 'query'],
      installCommand: 'pip install mcp-sparql-server',
      githubUrl: 'https://github.com/example/sparql-mcp',
      features: [
        'SPARQL query execution',
        'RDF data manipulation',
        'Semantic reasoning',
        'Multiple endpoint support',
        'Query optimization'
      ]
    },
    'redis-server': {
      title: 'Redis',
      description: 'Enables AI tools to interact with Redis databases through key-value operations, pattern-based key listing, and advanced data manipulation.',
      fullDescription: 'This MCP server provides comprehensive Redis database integration, offering full support for key-value operations, advanced data structures, and performance optimization. It enables AI agents to efficiently interact with Redis instances for caching, session management, and real-time data processing.',
      provider: 'Redis Labs',
      language: 'Go',
      stars: 2,
      releaseDate: 'Jan 10, 2025',
      tags: ['redis', 'database', 'key-value', 'caching'],
      installCommand: 'go get github.com/example/redis-mcp',
      githubUrl: 'https://github.com/example/redis-mcp',
      features: [
        'Key-value operations',
        'Pattern-based key listing',
        'Data structure support',
        'Connection pooling',
        'Performance monitoring'
      ]
    }
  };

  const mcp = mcpData[id as keyof typeof mcpData];

  if (!mcp) {
    return (
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-white mb-4">MCP Server Not Found</h1>
          <button 
            onClick={() => navigate('/tools')}
            className="text-blue-400 hover:text-blue-300"
          >
            Back to Tools
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-medium text-yellow-400">{mcp.stars}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{mcp.language}</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">{mcp.title}</h1>
                <p className="text-xl text-slate-300 leading-relaxed mb-6">
                  {mcp.description}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {mcp.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-sm text-slate-300 bg-slate-700/50 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mb-6 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Provider: {mcp.provider}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Released: {mcp.releaseDate}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                <Download className="h-4 w-4" />
                <span>Install</span>
              </button>
              <a 
                href={mcp.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 border border-slate-600 hover:border-slate-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Github className="h-4 w-4" />
                <span>View Source</span>
              </a>
              <button className="flex items-center space-x-2 border border-slate-600 hover:border-slate-500 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                <ExternalLink className="h-4 w-4" />
                <span>Documentation</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">About</h2>
              <p className="text-slate-300 leading-relaxed">
                {mcp.fullDescription}
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Features</h2>
              <ul className="space-y-2">
                {mcp.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Installation</h2>
              <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
                <code className="text-green-400 text-sm font-mono">
                  {mcp.installCommand}
                </code>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Stars</span>
                  <span className="text-white">{mcp.stars}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Language</span>
                  <span className="text-white">{mcp.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Provider</span>
                  <span className="text-white">{mcp.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Released</span>
                  <span className="text-white">{mcp.releaseDate}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Links</h3>
              <div className="space-y-3">
                <a href={mcp.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
                  <Github className="h-4 w-4" />
                  <span>Source Code</span>
                </a>
                <a href="#" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
                  <ExternalLink className="h-4 w-4" />
                  <span>Documentation</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCPDetail;
