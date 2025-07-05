
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Rule {
  id: string;
  title: string;
  description: string | null;
  framework: string;
  language: string;
  content: string;
  glob: string | null;
  always_apply: boolean | null;
  tags: string[] | null;
  downloads: number | null;
  copies: number | null;
  is_public: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  user_id: string;
}

export const useRules = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchRules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching rules:', error);
        toast.error('Failed to fetch rules');
        return;
      }

      setRules(data || []);
    } catch (error) {
      console.error('Error fetching rules:', error);
      toast.error('Failed to fetch rules');
    } finally {
      setLoading(false);
    }
  };

  const copyRule = async (ruleId: string) => {
    try {
      // Get current rule data
      const { data: currentRule, error: fetchError } = await supabase
        .from('rules')
        .select('copies')
        .eq('id', ruleId)
        .single();

      if (fetchError) {
        console.error('Error fetching rule:', fetchError);
        toast.error('Failed to copy rule');
        return;
      }

      const newCopies = (currentRule.copies || 0) + 1;

      // Update the database
      const { error: updateError } = await supabase
        .from('rules')
        .update({ copies: newCopies })
        .eq('id', ruleId);

      if (updateError) {
        console.error('Error updating copy count:', updateError);
        toast.error('Failed to copy rule');
        return;
      }

      // Update local state
      setRules(prevRules => 
        prevRules.map(rule => 
          rule.id === ruleId 
            ? { ...rule, copies: newCopies }
            : rule
        )
      );

      toast.success('Rule copied to clipboard!');
    } catch (error) {
      console.error('Error copying rule:', error);
      toast.error('Failed to copy rule');
    }
  };

  const downloadRule = async (ruleId: string) => {
    try {
      // Get current rule data
      const { data: currentRule, error: fetchError } = await supabase
        .from('rules')
        .select('downloads')
        .eq('id', ruleId)
        .single();

      if (fetchError) {
        console.error('Error fetching rule:', fetchError);
        toast.error('Failed to download rule');
        return;
      }

      const newDownloads = (currentRule.downloads || 0) + 1;

      // Update the database
      const { error: updateError } = await supabase
        .from('rules')
        .update({ downloads: newDownloads })
        .eq('id', ruleId);

      if (updateError) {
        console.error('Error updating download count:', updateError);
        toast.error('Failed to download rule');
        return;
      }

      // Update local state
      setRules(prevRules => 
        prevRules.map(rule => 
          rule.id === ruleId 
            ? { ...rule, downloads: newDownloads }
            : rule
        )
      );

      toast.success('Rule downloaded!');
    } catch (error) {
      console.error('Error downloading rule:', error);
      toast.error('Failed to download rule');
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  return {
    rules,
    loading,
    fetchRules,
    copyRule,
    downloadRule,
  };
};
