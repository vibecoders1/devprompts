
-- Create a table for prompts
CREATE TABLE public.prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,
  copies INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only manage their own prompts
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view public prompts or their own prompts
CREATE POLICY "Users can view public prompts or their own prompts" 
  ON public.prompts 
  FOR SELECT 
  USING (is_public = true OR auth.uid() = user_id);

-- Create policy that allows users to INSERT their own prompts
CREATE POLICY "Users can create their own prompts" 
  ON public.prompts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own prompts
CREATE POLICY "Users can update their own prompts" 
  ON public.prompts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own prompts
CREATE POLICY "Users can delete their own prompts" 
  ON public.prompts 
  FOR DELETE 
  USING (auth.uid() = user_id);
