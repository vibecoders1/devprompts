
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Code, Download, Copy, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useRules } from '@/hooks/useRules';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RuleCardProps {
  id: string;
  title: string;
  description: string;
  framework: string;
  language: string;
  downloads: number;
  copies: number;
  tags: string[];
  showMyRulesActions?: boolean;
  onUpdate?: () => void;
}

const RuleCard = ({ 
  id, 
  title, 
  description, 
  framework, 
  language, 
  downloads, 
  copies, 
  tags,
  showMyRulesActions = false,
  onUpdate 
}: RuleCardProps) => {
  const { copyRule, downloadRule } = useRules();
  const { user } = useAuth();
  const [rule, setRule] = useState<any>(null);
  const [showActions, setShowActions] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!rule) {
      // Fetch rule content for copying
      const { data } = await supabase
        .from('rules')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) {
        setRule(data);
        const ruleContent = `---
description: ${data.description || ''}
globs: ${data.glob || '**/*'}
alwaysApply: ${data.always_apply || false}
---

${data.content}`;
        
        navigator.clipboard.writeText(ruleContent);
      }
    }
    
    await copyRule(id);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!rule) {
      // Fetch rule content for downloading
      const { data } = await supabase
        .from('rules')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) {
        setRule(data);
        const ruleContent = `---
description: ${data.description || ''}
globs: ${data.glob || '**/*'}
alwaysApply: ${data.always_apply || false}
---

${data.content}`;
        
        const element = document.createElement('a');
        const file = new Blob([ruleContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${data.title.toLowerCase().replace(/\s+/g, '-')}.mdc`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
    }
    
    await downloadRule(id);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this rule?')) return;
    
    try {
      const { error } = await supabase
        .from('rules')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting rule:', error);
        toast.error('Failed to delete rule');
        return;
      }

      toast.success('Rule deleted successfully');
      onUpdate?.();
    } catch (error) {
      console.error('Error deleting rule:', error);
      toast.error('Failed to delete rule');
    }
  };

  const toggleVisibility = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // First get current visibility
      const { data: currentRule } = await supabase
        .from('rules')
        .select('is_public')
        .eq('id', id)
        .single();

      if (!currentRule) return;

      const { error } = await supabase
        .from('rules')
        .update({ is_public: !currentRule.is_public })
        .eq('id', id);

      if (error) {
        console.error('Error updating visibility:', error);
        toast.error('Failed to update visibility');
        return;
      }

      toast.success(`Rule is now ${!currentRule.is_public ? 'public' : 'private'}`);
      onUpdate?.();
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast.error('Failed to update visibility');
    }
  };

  return (
    <div 
      className="group bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-[1.02]"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Code className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-400">{framework}</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">{language}</span>
          </div>
          <Link to={`/rules/${id}`}>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
          <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 mb-4">
            {description}
          </p>
        </div>
      </div>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1"
          >
            {tag}
          </Badge>
        ))}
      </div>
      
      {/* Stats and Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4 text-sm text-slate-400">
          <span>{downloads.toLocaleString()} downloads</span>
          <span>{copies.toLocaleString()} copies</span>
        </div>
        
        <div className={`flex items-center space-x-2 transition-opacity ${showActions || showMyRulesActions ? 'opacity-100' : 'opacity-0'}`}>
          {showMyRulesActions ? (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleVisibility}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700"
                title="Toggle visibility"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // TODO: Implement edit functionality
                  toast.info('Edit functionality coming soon!');
                }}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700"
                title="Edit rule"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDelete}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700"
                title="Delete rule"
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
                title="Copy rule"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDownload}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700"
                title="Download rule"
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

export default RuleCard;
