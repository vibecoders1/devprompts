
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Prompt {
  id: string;
  title: string;
  description: string | null;
  content: string;
  category: string;
  tags: string[] | null;
  is_public: boolean;
  views: number;
  copies: number;
  likes: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const usePrompts = (showOnlyMyPrompts = false) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['prompts', showOnlyMyPrompts, user?.id],
    queryFn: async () => {
      let query = supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false });

      if (showOnlyMyPrompts && user) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching prompts:', error);
        throw error;
      }

      return data as Prompt[];
    },
    enabled: !showOnlyMyPrompts || !!user,
  });
};

export const useCopyPrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promptId: string) => {
      // First get the current copies count
      const { data: currentPrompt, error: fetchError } = await supabase
        .from('prompts')
        .select('copies')
        .eq('id', promptId)
        .single();

      if (fetchError) {
        console.error('Error fetching current prompt:', fetchError);
        throw fetchError;
      }

      // Then update with incremented value
      const { error } = await supabase
        .from('prompts')
        .update({ copies: (currentPrompt.copies || 0) + 1 })
        .eq('id', promptId);

      if (error) {
        console.error('Error updating copy count:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
  });
};

export const useDeletePrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promptId: string) => {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', promptId);

      if (error) {
        console.error('Error deleting prompt:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
  });
};

export const useUpdatePrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Prompt> }) => {
      const { error } = await supabase
        .from('prompts')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating prompt:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
  });
};
