
import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { usePrompts } from '@/hooks/usePrompts';
import AddPromptForm from './AddPromptForm';
import EditPromptForm from './EditPromptForm';
import PromptCard from './PromptCard';

interface PromptsListProps {
  showOnlyMyPrompts?: boolean;
}

const PromptsList = ({ showOnlyMyPrompts = false }: PromptsListProps) => {
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: prompts = [], isLoading, error, refetch } = usePrompts(showOnlyMyPrompts);

  const categories = ['All', 'Fullstack', 'Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'AI/ML', 'Testing', 'Design', 'Other'];
  const allTags = [...new Set(prompts.flatMap(prompt => prompt.tags || []))];

  const filteredPrompts = prompts.filter(prompt => {
    const categoryMatch = selectedCategory === 'All' || prompt.category === selectedCategory;
    const tagMatch = selectedTags.length === 0 || selectedTags.some(tag => prompt.tags?.includes(tag));
    return categoryMatch && tagMatch;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleFormSuccess = () => {
    setShowAddForm(false);
    setEditingPrompt(null);
    refetch();
  };

  const handleEdit = (promptId: string) => {
    setEditingPrompt(promptId);
  };

  const editingPromptData = editingPrompt ? prompts.find(p => p.id === editingPrompt) : null;

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-white">Loading prompts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400">Error loading prompts</div>
      </div>
    );
  }

  if (showAddForm) {
    return (
      <AddPromptForm 
        onSuccess={handleFormSuccess}
        onCancel={() => setShowAddForm(false)}
      />
    );
  }

  if (editingPrompt && editingPromptData) {
    return (
      <EditPromptForm
        prompt={editingPromptData}
        onSuccess={handleFormSuccess}
        onCancel={() => setEditingPrompt(null)}
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {showOnlyMyPrompts ? 'My Prompts' : 'All Prompts'}
          </h2>
          <p className="text-slate-300">
            {showOnlyMyPrompts 
              ? 'Manage your personal prompt collection'
              : 'Discover and use community prompts'
            }
          </p>
        </div>
        
        {user && (
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Prompt
          </Button>
        )}
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
            {allTags.length > 0 && (
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
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-slate-400">
              {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {filteredPrompts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-slate-400">No prompts found matching your criteria</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredPrompts.map(prompt => (
                <PromptCard 
                  key={prompt.id} 
                  {...prompt} 
                  showMyPromptsActions={showOnlyMyPrompts}
                  onEdit={handleEdit}
                  onUpdate={refetch}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptsList;
