
import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import PromptCard from '../components/PromptCard';

const Prompts = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Sample data - in a real app, this would come from an API or database
  const prompts = [
    {
      id: '1',
      title: 'Full-Stack Software Developer',
      description: 'Act as a full-stack software developer who can provide guidance on designing, developing, and deploying full-stack applications. Share insights on working with various technologies and best practices.',
      category: 'Fullstack',
      views: 4013,
      copies: 1552,
      likes: 87,
      tags: ['React', 'Node.js', 'Database', 'API Design']
    },
    {
      id: '2',
      title: 'React Component Patterns',
      description: 'Expert guidance on React component patterns, hooks usage, and best practices for building maintainable React applications.',
      category: 'Frontend',
      views: 2845,
      copies: 923,
      likes: 64,
      tags: ['React', 'Hooks', 'Components', 'TypeScript']
    },
    {
      id: '3',
      title: 'API Design & Backend Architecture',
      description: 'Comprehensive guidance on designing RESTful APIs, database schemas, and backend architecture patterns.',
      category: 'Backend',
      views: 1876,
      copies: 542,
      likes: 43,
      tags: ['API', 'Database', 'Architecture', 'REST']
    },
    {
      id: '4',
      title: 'Database Optimization Expert',
      description: 'Database design patterns, query optimization techniques, and performance tuning strategies.',
      category: 'Database',
      views: 1234,
      copies: 389,
      likes: 28,
      tags: ['SQL', 'PostgreSQL', 'Optimization', 'Performance']
    }
  ];

  const categories = ['All', 'Fullstack', 'Frontend', 'Backend', 'Database'];
  const allTags = [...new Set(prompts.flatMap(prompt => prompt.tags))];

  const filteredPrompts = prompts.filter(prompt => {
    const categoryMatch = selectedCategory === 'All' || prompt.category === selectedCategory;
    const tagMatch = selectedTags.length === 0 || selectedTags.some(tag => prompt.tags.includes(tag));
    return categoryMatch && tagMatch;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="h-5 w-5 text-slate-400" />
                <h3 className="text-lg font-semibold text-white">Filters</h3>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-300 mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-3 py-1 rounded-full transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-slate-400">
                {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredPrompts.map(prompt => (
                <PromptCard key={prompt.id} {...prompt} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prompts;
