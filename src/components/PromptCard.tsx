
import React from 'react';
import { Link } from 'react-router-dom';
import { Copy, Download, Heart } from 'lucide-react';

interface PromptCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  views: number;
  copies: number;
  likes: number;
  tags: string[];
}

const PromptCard = ({ id, title, description, category, views, copies, likes, tags }: PromptCardProps) => {
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Copy functionality will be implemented
    console.log('Copy prompt:', title);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Download functionality will be implemented
    console.log('Download prompt:', title);
  };

  return (
    <div className="group bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-medium text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full">
              {category}
            </span>
          </div>
          <Link to={`/prompts/${id}`}>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
              {title}
            </h3>
          </Link>
          <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
            {description}
          </p>
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
          <span>{views.toLocaleString()} views</span>
          <span>{copies.toLocaleString()} copies</span>
          <span className="flex items-center space-x-1">
            <Heart className="h-4 w-4" />
            <span>{likes}</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            title="Copy prompt"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            title="Download prompt"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
