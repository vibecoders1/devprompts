
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { X } from 'lucide-react';
import type { Rule } from '@/hooks/useRules';

const ruleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  framework: z.string().min(1, 'Framework is required'),
  language: z.string().min(1, 'Language is required'),
  content: z.string().min(1, 'Rule content is required'),
  glob: z.string().optional(),
  always_apply: z.boolean().default(false),
  tags: z.string().optional(),
  howToUse: z.string().optional(),
  is_public: z.boolean().default(true),
});

type RuleFormData = z.infer<typeof ruleSchema>;

interface EditRuleFormProps {
  rule: Rule;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditRuleForm = ({ rule, onSuccess, onCancel }: EditRuleFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RuleFormData>({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      title: rule.title,
      description: rule.description || '',
      framework: rule.framework,
      language: rule.language,
      content: rule.content,
      glob: rule.glob || '**/*',
      always_apply: rule.always_apply || false,
      tags: rule.tags?.join(', ') || '',
      howToUse: '',
      is_public: rule.is_public || true,
    },
  });

  const onSubmit = async (data: RuleFormData) => {
    try {
      setIsSubmitting(true);
      
      const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
      
      const { error } = await supabase
        .from('rules')
        .update({
          title: data.title,
          description: data.description || null,
          framework: data.framework,
          language: data.language,
          content: data.content,
          glob: data.glob || '**/*',
          always_apply: data.always_apply,
          tags,
          is_public: data.is_public,
          updated_at: new Date().toISOString(),
        })
        .eq('id', rule.id);

      if (error) {
        console.error('Error updating rule:', error);
        toast.error('Failed to update rule');
        return;
      }

      toast.success('Rule updated successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error updating rule:', error);
      toast.error('Failed to update rule');
    } finally {
      setIsSubmitting(false);
    }
  };

  const frameworks = ['React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Node.js', 'Express', 'FastAPI', 'Django', 'Rails', 'Other'];
  const languages = ['TypeScript', 'JavaScript', 'Python', 'Java', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Other'];

  return (
    <Card className="max-w-4xl mx-auto bg-slate-800/50 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Edit Rule</CardTitle>
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
                        placeholder="Enter rule title"
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
                name="framework"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Framework</FormLabel>
                    <FormControl>
                      <select
                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white"
                        {...field}
                      >
                        <option value="">Select framework</option>
                        {frameworks.map(framework => (
                          <option key={framework} value={framework}>{framework}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Language</FormLabel>
                    <FormControl>
                      <select
                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white"
                        {...field}
                      >
                        <option value="">Select language</option>
                        {languages.map(language => (
                          <option key={language} value={language}>{language}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="glob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Glob Pattern</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="**/*"
                        className="bg-slate-700/50 border-slate-600 text-white"
                        {...field}
                      />
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
                      placeholder="Brief description of what this rule does"
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
                  <FormLabel className="text-slate-300">Rule Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the rule content here..."
                      className="bg-slate-700/50 border-slate-600 text-white min-h-[200px] font-mono"
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
                      placeholder="Explain how to use this rule effectively..."
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
                name="always_apply"
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
                    <FormLabel className="text-slate-300">Always apply this rule</FormLabel>
                  </FormItem>
                )}
              />

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
                    <FormLabel className="text-slate-300">Make this rule public</FormLabel>
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
                {isSubmitting ? 'Updating...' : 'Update Rule'}
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

export default EditRuleForm;
