
import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import RuleCard from './RuleCard';
import AddRuleForm from './AddRuleForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Rule } from '@/hooks/useRules';

interface RulesListProps {
  showOnlyMyRules?: boolean;
  initialFramework?: string;
  initialLanguage?: string;
}

const RulesList = ({ showOnlyMyRules = false, initialFramework = 'All', initialLanguage = 'All' }: RulesListProps) => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState(initialFramework);
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();

  const ITEMS_PER_PAGE = 12;

  const fetchRules = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('rules')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (showOnlyMyRules && user) {
        query = query.eq('user_id', user.id);
      } else if (!showOnlyMyRules) {
        query = query.eq('is_public', true);
      }

      if (selectedFramework !== 'All') {
        query = query.eq('framework', selectedFramework);
      }

      if (selectedLanguage !== 'All') {
        query = query.eq('language', selectedLanguage);
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      // Pagination
      const from = (pageNum - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching rules:', error);
        toast.error('Failed to fetch rules');
        return;
      }

      const newRules = data || [];
      
      if (reset || pageNum === 1) {
        setRules(newRules);
      } else {
        setRules(prev => [...prev, ...newRules]);
      }

      setHasMore(newRules.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching rules:', error);
      toast.error('Failed to fetch rules');
    } finally {
      setLoading(false);
    }
  };

  // Get unique frameworks and languages for filters
  const [frameworks, setFrameworks] = useState<string[]>(['All']);
  const [languages, setLanguages] = useState<string[]>(['All']);

  const fetchFilterOptions = async () => {
    try {
      let query = supabase.from('rules').select('framework, language');
      
      if (showOnlyMyRules && user) {
        query = query.eq('user_id', user.id);
      } else if (!showOnlyMyRules) {
        query = query.eq('is_public', true);
      }

      const { data } = await query;
      
      if (data) {
        const uniqueFrameworks = ['All', ...new Set(data.map(r => r.framework))];
        const uniqueLanguages = ['All', ...new Set(data.map(r => r.language))];
        setFrameworks(uniqueFrameworks);
        setLanguages(uniqueLanguages);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, [showOnlyMyRules, user]);

  useEffect(() => {
    setPage(1);
    fetchRules(1, true);
  }, [selectedFramework, selectedLanguage, searchTerm, showOnlyMyRules, user]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRules(nextPage, false);
  };

  const handleRuleCreated = () => {
    setShowAddForm(false);
    fetchRules(1, true);
    fetchFilterOptions();
  };

  if (showAddForm) {
    return (
      <AddRuleForm 
        onSuccess={handleRuleCreated}
        onCancel={() => setShowAddForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {showOnlyMyRules ? 'My Rules' : 'All Rules'}
          </h2>
          <p className="text-slate-400">
            {showOnlyMyRules 
              ? 'Rules you have created' 
              : 'Discover and share .mdc rules for better development'
            }
          </p>
        </div>
        
        {user && (
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Rule
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search rules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedFramework}
            onChange={(e) => setSelectedFramework(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white text-sm"
          >
            {frameworks.map(framework => (
              <option key={framework} value={framework}>{framework}</option>
            ))}
          </select>
          
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white text-sm"
          >
            {languages.map(language => (
              <option key={language} value={language}>{language}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-slate-400 text-sm">
        {rules.length} rule{rules.length !== 1 ? 's' : ''} found
      </div>

      {/* Rules Grid */}
      {loading && rules.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          Loading rules...
        </div>
      ) : rules.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            {showOnlyMyRules ? "You haven't created any rules yet." : "No rules found matching your criteria."}
          </div>
          {showOnlyMyRules && user && (
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Rule
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {rules.map(rule => (
              <RuleCard 
                key={rule.id}
                id={rule.id}
                title={rule.title}
                description={rule.description || ''}
                framework={rule.framework}
                language={rule.language}
                downloads={rule.downloads || 0}
                copies={rule.copies || 0}
                tags={rule.tags || []}
                showMyRulesActions={showOnlyMyRules}
                onUpdate={() => fetchRules(1, true)}
              />
            ))}
          </div>
          
          {/* Load More Button */}
          {hasMore && (
            <div className="text-center">
              <Button 
                onClick={loadMore}
                disabled={loading}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RulesList;
