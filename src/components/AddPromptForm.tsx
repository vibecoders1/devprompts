
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const promptSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  is_public: z.boolean(),
});

type PromptFormData = z.infer<typeof promptSchema>;

const categories = [
  'Fullstack', 'Frontend', 'Backend', 'Database', 'DevOps', 
  'Mobile', 'AI/ML', 'Testing', 'Design', 'Other'
];

interface AddPromptFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddPromptForm = ({ onSuccess, onCancel }: AddPromptFormProps) => {
  const { user } = useAuth();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  const form = useForm<PromptFormData>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      content: '',
      is_public: true,
    },
  });

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (data: PromptFormData) => {
    if (!user) {
      toast.error('You must be logged in to create a prompt');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('prompts')
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description || null,
          category: data.category,
          content: data.content,
          is_public: data.is_public,
          tags: tags.length > 0 ? tags : null,
        });

      if (error) {
        console.error('Error creating prompt:', error);
        toast.error('Failed to create prompt');
        return;
      }

      toast.success('Prompt created successfully!');
      form.reset();
      setTags([]);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating prompt:', error);
      toast.error('Failed to create prompt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Add New Prompt</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Title</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Full-Stack Developer Assistant"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {categories.map((category) => (
                          <SelectItem key={category} value={category} className="text-white">
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Brief description of this prompt..."
                      className="bg-slate-700 border-slate-600 text-white min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Prompt Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter your prompt content here..."
                      className="bg-slate-700 border-slate-600 text-white min-h-[200px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags Input */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-300">Tags</label>
              <div className="flex space-x-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tag..."
                  className="bg-slate-700 border-slate-600 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-slate-600 text-white">
                      {tag}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Visibility Setting */}
            <FormField
              control={form.control}
              name="is_public"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Visibility</FormLabel>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={field.value === true}
                        onChange={() => field.onChange(true)}
                        className="text-purple-600"
                      />
                      <span className="text-white">Public</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={field.value === false}
                        onChange={() => field.onChange(false)}
                        className="text-purple-600"
                      />
                      <span className="text-white">Private</span>
                    </label>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                {loading ? 'Creating...' : 'Create Prompt'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddPromptForm;
