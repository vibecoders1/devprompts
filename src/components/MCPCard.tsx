
import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Copy, ExternalLink, Star } from 'lucide-react';

interface MCPCardProps {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  downloads: number;
  rating: number;
  tags: string[];
  category: string;
}

const MCPCard = ({ id, name, description, author, version, downloads, rating, tags, category }: MCPCardProps) => {
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Copy MCP:', name);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Download MCP:', name);
  };

  return (
    <div className="group bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-green-400">{category}</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">v{version}</span>
          </div>
          <Link to={`/mcp/${id}`}>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
              {name}
            </h3>
          </Link>
          <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 mb-2">
            {description}
          </p>
          <p className="text-xs text-slate-400">by {author}</p>
        </div>
      </div>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      
      {/* Stats and Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4 text-sm text-slate-400">
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span>{rating}</span>
          </div>
          <span>{downloads.toLocaleString()} downloads</span>
        </div>
        
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            title="Copy MCP server"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            title="Download MCP server"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            title="View details"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MCPCard;
