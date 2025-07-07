
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Download, Heart, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useCopyPrompt, useDeletePrompt, useUpdatePrompt } from '@/hooks/usePrompts';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface PromptCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  views: number;
  copies: number;
  likes: number;
  tags: string[];
  user_id?: string;
  is_public?: boolean;
  showMyPromptsActions?: boolean;
  onEdit?: (id: string) => void;
  onUpdate?: () => void;
}

const PromptCard = ({ 
  id, 
  title, 
  description, 
  category, 
  views, 
  copies, 
  likes, 
  tags, 
  user_id,
  is_public = true,
  showMyPromptsActions = false,
  onEdit,
  onUpdate 
}: PromptCardProps) => {
  const { user } = useAuth();
  const copyPrompt = useCopyPrompt();
  const deletePrompt = useDeletePrompt();
  const updatePrompt = useUpdatePrompt();
  const [showActions, setShowActions] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await copyPrompt.mutateAsync(id);
      toast.success('Prompt copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy prompt');
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Download functionality will be implemented
    console.log('Download prompt:', title);
    toast.success('Download feature coming soon!');
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this prompt?')) return;
    
    try {
      await deletePrompt.mutateAsync(id);
      toast.success('Prompt deleted successfully');
      onUpdate?.();
    } catch (error) {
      toast.error('Failed to delete prompt');
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(id);
  };

  const toggleVisibility = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await updatePrompt.mutateAsync({
        id,
        updates: { is_public: !is_public }
      });
      toast.success(`Prompt is now ${!is_public ? 'public' : 'private'}`);
      onUpdate?.();
    } catch (error) {
      toast.error('Failed to update visibility');
    }
  };

  const isOwner = user && user_id === user.id;

  return (
    <div 
      className="group bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-[1.02]"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-medium text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full">
              {category}
            </span>
            {!is_public && isOwner && (
              <span className="text-xs font-medium text-slate-400 bg-slate-600/50 px-2 py-1 rounded-full">
                Private
              </span>
            )}
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
        
        <div className={`flex items-center space-x-2 transition-opacity ${showActions || showMyPromptsActions ? 'opacity-100' : 'opacity-0'}`}>
          {showMyPromptsActions && isOwner ? (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleVisibility}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700"
                title="Toggle visibility"
              >
                {is_public ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleEdit}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700"
                title="Edit prompt"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDelete}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700"
                title="Delete prompt"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700"
                title="Copy prompt"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDownload}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700"
                title="Download prompt"
              >
                <Download className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
