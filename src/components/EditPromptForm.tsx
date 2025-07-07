
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { useUpdatePrompt, type Prompt } from '@/hooks/usePrompts';
import { X } from 'lucide-react';

const promptSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().optional(),
  howToUse: z.string().optional(),
  is_public: z.boolean().default(true),
});

type PromptFormData = z.infer<typeof promptSchema>;

interface EditPromptFormProps {
  prompt: Prompt;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditPromptForm = ({ prompt, onSuccess, onCancel }: EditPromptFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updatePrompt = useUpdatePrompt();

  const form = useForm<PromptFormData>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      title: prompt.title,
      description: prompt.description || '',
      content: prompt.content,
      category: prompt.category,
      tags: prompt.tags?.join(', ') || '',
      howToUse: '',
      is_public: prompt.is_public,
    },
  });

  const onSubmit = async (data: PromptFormData) => {
    try {
      setIsSubmitting(true);
      
      const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
      
      await updatePrompt.mutateAsync({
        id: prompt.id,
        updates: {
          title: data.title,
          description: data.description || null,
          content: data.content,
          category: data.category,
          tags,
          is_public: data.is_public,
        }
      });

      toast.success('Prompt updated successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error updating prompt:', error);
      toast.error('Failed to update prompt');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ['Fullstack', 'Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'AI/ML', 'Testing', 'Design', 'Other'];

  return (
    <Card className="max-w-4xl mx-auto bg-slate-800/50 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Edit Prompt</CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
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
                        placeholder="Enter prompt title"
                        className="bg-slate-700/50 border-slate-600 text-white"
                        {...field}
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
                    <FormControl>
                      <select
                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white"
                        {...field}
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </FormControl>
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
                      placeholder="Brief description of what this prompt does"
                      className="bg-slate-700/50 border-slate-600 text-white min-h-[80px]"
                      {...field}
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
                      placeholder="Enter the full prompt content here..."
                      className="bg-slate-700/50 border-slate-600 text-white min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="howToUse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">How to Use</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain how to use this prompt effectively..."
                      className="bg-slate-700/50 border-slate-600 text-white min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Tags</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="react, typescript, api (comma separated)"
                      className="bg-slate-700/50 border-slate-600 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-4">
              <FormField
                control={form.control}
                name="is_public"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="rounded border-slate-600"
                      />
                    </FormControl>
                    <FormLabel className="text-slate-300">Make this prompt public</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isSubmitting ? 'Updating...' : 'Update Prompt'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditPromptForm;
