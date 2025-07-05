
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

const ruleSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  framework: z.string().min(1, 'Framework is required'),
  language: z.string().min(1, 'Language is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  glob: z.string().optional(),
  always_apply: z.boolean(),
  is_public: z.boolean(),
});

type RuleFormData = z.infer<typeof ruleSchema>;

const frameworks = [
  'React', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'Node.js', 
  'Express', 'FastAPI', 'Django', 'Laravel', 'Rails', 'Other'
];

const languages = [
  'JavaScript', 'TypeScript', 'Python', 'PHP', 'Ruby', 'Go', 
  'Java', 'C#', 'Rust', 'Swift', 'Kotlin', 'Other'
];

interface AddRuleFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddRuleForm = ({ onSuccess, onCancel }: AddRuleFormProps) => {
  const { user } = useAuth();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  const form = useForm<RuleFormData>({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      title: '',
      description: '',
      framework: '',
      language: '',
      content: '',
      glob: '**/*',
      always_apply: false,
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

  const onSubmit = async (data: RuleFormData) => {
    if (!user) {
      toast.error('You must be logged in to create a rule');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('rules')
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description || null,
          framework: data.framework,
          language: data.language,
          content: data.content,
          glob: data.glob || '**/*',
          always_apply: data.always_apply,
          is_public: data.is_public,
          tags: tags.length > 0 ? tags : null,
        });

      if (error) {
        console.error('Error creating rule:', error);
        toast.error('Failed to create rule');
        return;
      }

      toast.success('Rule created successfully!');
      form.reset();
      setTags([]);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating rule:', error);
      toast.error('Failed to create rule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Add New Rule</CardTitle>
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
                        placeholder="React Best Practices"
                        className="bg-slate-700 border-slate-600 text-white"
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select framework" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {frameworks.map((framework) => (
                          <SelectItem key={framework} value={framework} className="text-white">
                            {framework}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {languages.map((language) => (
                          <SelectItem key={language} value={language} className="text-white">
                            {language}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                        {...field} 
                        placeholder="**/*.tsx,**/*.ts"
                        className="bg-slate-700 border-slate-600 text-white"
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
                      {...field} 
                      placeholder="Brief description of this rule..."
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
                  <FormLabel className="text-slate-300">Rule Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter your .mdc rule content here..."
                      className="bg-slate-700 border-slate-600 text-white min-h-[200px] font-mono text-sm"
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

            {/* Visibility and Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <FormField
                control={form.control}
                name="always_apply"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Always Apply</FormLabel>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="text-purple-600"
                        />
                        <span className="text-white">Apply to all files</span>
                      </label>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                {loading ? 'Creating...' : 'Create Rule'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddRuleForm;
