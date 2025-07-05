
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Download, Code } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Rule } from '@/hooks/useRules';

const RuleDetail = () => {
  const { id } = useParams();
  const [rule, setRule] = useState<Rule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchRule = async () => {
      try {
        const { data, error } = await supabase
          .from('rules')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching rule:', error);
          toast.error('Failed to fetch rule details');
          return;
        }

        setRule(data);
      } catch (error) {
        console.error('Error fetching rule:', error);
        toast.error('Failed to fetch rule details');
      } finally {
        setLoading(false);
      }
    };

    fetchRule();
  }, [id]);

  const handleCopy = async () => {
    if (!rule) return;

    const ruleContent = `---
description: ${rule.description || ''}
globs: ${rule.glob || '**/*'}
alwaysApply: ${rule.always_apply || false}
---

${rule.content}`;
    
    navigator.clipboard.writeText(ruleContent);
    
    // Update copy count
    await supabase
      .from('rules')
      .update({ copies: (rule.copies || 0) + 1 })
      .eq('id', rule.id);

    toast.success('Rule copied to clipboard!');
  };

  const handleDownload = async () => {
    if (!rule) return;

    const ruleContent = `---
description: ${rule.description || ''}
globs: ${rule.glob || '**/*'}
alwaysApply: ${rule.always_apply || false}
---

${rule.content}`;
    
    const element = document.createElement('a');
    const file = new Blob([ruleContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${rule.title.toLowerCase().replace(/\s+/g, '-')}.mdc`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    // Update download count
    await supabase
      .from('rules')
      .update({ downloads: (rule.downloads || 0) + 1 })
      .eq('id', rule.id);

    toast.success('Rule downloaded!');
  };

  if (loading) {
    return (
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-white">Loading rule details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!rule) {
    return (
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-white mb-4">Rule not found</div>
            <Link to="/rules" className="text-blue-400 hover:text-blue-300">
              Back to rules
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/rules"
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to rules</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Code className="h-5 w-5 text-purple-400" />
            <span className="text-sm font-medium text-purple-400">{rule.framework}</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">{rule.language}</span>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">{rule.title}</h1>
          <p className="text-xl text-slate-300 leading-relaxed">{rule.description}</p>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-6 mb-8 text-slate-400">
          <span>{(rule.downloads || 0).toLocaleString()} downloads</span>
          <span>{(rule.copies || 0).toLocaleString()} copies</span>
        </div>

        {/* Tags */}
        {rule.tags && rule.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {rule.tags.map((tag, index) => (
              <span
                key={index}
                className="text-sm text-slate-300 bg-slate-700/50 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Copy className="h-4 w-4" />
            <span>Copy Rule</span>
          </button>
          
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download .mdc</span>
          </button>
        </div>

        {/* Rule Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Configuration</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-slate-400">Glob Pattern:</span>
                <code className="block bg-slate-900/50 px-3 py-2 rounded mt-1 text-sm text-slate-200 font-mono">
                  {rule.glob || '**/*'}
                </code>
              </div>
              <div>
                <span className="text-sm text-slate-400">Always Apply:</span>
                <span className="block mt-1 text-sm text-slate-200">
                  {rule.always_apply ? 'true' : 'false'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Compatible With</h3>
            <div className="space-y-2">
              <div className="text-sm text-slate-300">{rule.framework}</div>
              <div className="text-sm text-slate-300">Modern IDEs</div>
              <div className="text-sm text-slate-300">AI Code Assistants</div>
            </div>
          </div>
        </div>

        {/* Rule Content */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Rule Content</h3>
          <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
            <pre className="text-slate-200 font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {rule.content}
            </pre>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">How to Use</h3>
          <div className="text-slate-300 space-y-2">
            <p>1. Download the .mdc file or copy the rule content</p>
            <p>2. Place the file in your project's <code className="bg-slate-700 px-2 py-1 rounded text-sm">.cursorrules</code> directory</p>
            <p>3. The rule will automatically apply to files matching the glob pattern</p>
            <p>4. Restart Cursor for the rules to take effect</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleDetail;
