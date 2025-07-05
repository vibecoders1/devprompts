
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rules table
CREATE TABLE public.rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  framework TEXT NOT NULL,
  language TEXT NOT NULL,
  content TEXT NOT NULL,
  glob TEXT DEFAULT '**/*',
  always_apply BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  downloads INTEGER DEFAULT 0,
  copies INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rules ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Rules policies
CREATE POLICY "Users can view public rules" ON public.rules
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can view their own rules" ON public.rules
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own rules" ON public.rules
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rules" ON public.rules
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rules" ON public.rules
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_rules_user_id ON public.rules(user_id);
CREATE INDEX idx_rules_framework ON public.rules(framework);
CREATE INDEX idx_rules_language ON public.rules(language);
CREATE INDEX idx_rules_public ON public.rules(is_public);
