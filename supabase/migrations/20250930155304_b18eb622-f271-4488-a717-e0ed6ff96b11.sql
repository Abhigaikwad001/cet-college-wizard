-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create colleges table
CREATE TABLE public.colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  type TEXT NOT NULL, -- Government, Autonomous, Private
  university TEXT NOT NULL, -- e.g., "Pune University", "Mumbai University"
  naac_rating TEXT,
  nirf_rank INTEGER,
  established_year INTEGER,
  fees_per_year DECIMAL(10, 2),
  hostel_available BOOLEAN DEFAULT false,
  campus_area TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Colleges are viewable by everyone"
  ON public.colleges FOR SELECT
  USING (true);

-- Create branches table
CREATE TABLE public.branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- Engineering, Medical, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Branches are viewable by everyone"
  ON public.branches FOR SELECT
  USING (true);

-- Create cutoff_data table (historical cutoffs)
CREATE TABLE public.cutoff_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  round INTEGER NOT NULL, -- CAP Round 1, 2, 3
  category TEXT NOT NULL, -- OPEN, OBC, SC, ST, EWS
  quota TEXT NOT NULL, -- Home University, Outside University, All India
  cutoff_rank INTEGER NOT NULL,
  seats_available INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(college_id, branch_id, year, round, category, quota)
);

ALTER TABLE public.cutoff_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cutoff data is viewable by everyone"
  ON public.cutoff_data FOR SELECT
  USING (true);

-- Create placement_data table
CREATE TABLE public.placement_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  average_package DECIMAL(10, 2),
  highest_package DECIMAL(10, 2),
  placement_percentage DECIMAL(5, 2),
  top_recruiters TEXT[], -- Array of company names
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.placement_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Placement data is viewable by everyone"
  ON public.placement_data FOR SELECT
  USING (true);

-- Create user_bookmarks table
CREATE TABLE public.user_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, college_id, branch_id)
);

ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookmarks"
  ON public.user_bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks"
  ON public.user_bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON public.user_bookmarks FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks"
  ON public.user_bookmarks FOR UPDATE
  USING (auth.uid() = user_id);

-- Create scholarships table
CREATE TABLE public.scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  eligibility_category TEXT[], -- Array: OPEN, OBC, SC, ST, EWS
  income_limit DECIMAL(10, 2),
  amount DECIMAL(10, 2),
  provider TEXT, -- Government, College, Private
  application_link TEXT,
  deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Scholarships are viewable by everyone"
  ON public.scholarships FOR SELECT
  USING (true);

-- Create cap_rounds table (counseling information)
CREATE TABLE public.cap_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL,
  round_number INTEGER NOT NULL,
  round_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  description TEXT,
  required_documents TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(year, round_number)
);

ALTER TABLE public.cap_rounds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CAP rounds are viewable by everyone"
  ON public.cap_rounds FOR SELECT
  USING (true);

-- Create admission_alerts table
CREATE TABLE public.admission_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  alert_type TEXT NOT NULL, -- info, warning, urgent
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.admission_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admission alerts are viewable by everyone"
  ON public.admission_alerts FOR SELECT
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_cutoff_data_college ON public.cutoff_data(college_id);
CREATE INDEX idx_cutoff_data_branch ON public.cutoff_data(branch_id);
CREATE INDEX idx_cutoff_data_year ON public.cutoff_data(year);
CREATE INDEX idx_cutoff_data_category ON public.cutoff_data(category);
CREATE INDEX idx_placement_data_college ON public.placement_data(college_id);
CREATE INDEX idx_user_bookmarks_user ON public.user_bookmarks(user_id);
CREATE INDEX idx_colleges_city ON public.colleges(city);
CREATE INDEX idx_colleges_type ON public.colleges(type);