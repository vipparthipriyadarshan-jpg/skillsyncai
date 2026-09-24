-- ==============================================================================
-- Skill Sync AI (Problem Statement ID 26134)
-- Migration 001: Initial Schema, Role-Based Access Control & User Profiles
-- ==============================================================================

-- 1. Create User Roles Enum
CREATE TYPE user_role AS ENUM (
  'admin',
  'government',
  'institution',
  'employer',
  'candidate'
);

-- 2. Create User Profiles Table linked to Supabase Auth
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'government',
  district_id UUID,
  organization_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Profiles RLS Policies
-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Admins and Government officers can view all stakeholder profiles
CREATE POLICY "Admins and Government can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'government')
    )
  );

-- 4. Automatic Profile Creation Trigger on Supabase Auth Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role user_role := 'candidate';
  user_full_name TEXT := '';
BEGIN
  -- Strict RBAC: Prevent self-granting of privileged roles ('admin', 'government') via client metadata
  IF new.raw_user_meta_data->>'role' IS NOT NULL THEN
    IF (new.raw_user_meta_data->>'role') IN ('admin', 'government') THEN
      assigned_role := 'candidate'::user_role; -- Reject privilege escalation attempt
    ELSE
      assigned_role := (new.raw_user_meta_data->>'role')::user_role;
    END IF;
  ELSE
    assigned_role := 'candidate'::user_role;
  END IF;

  IF new.raw_user_meta_data->>'full_name' IS NOT NULL THEN
    user_full_name := new.raw_user_meta_data->>'full_name';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, user_full_name, assigned_role);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. Create Districts Table
CREATE TABLE IF NOT EXISTS public.districts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Districts are viewable by all authenticated users"
  ON public.districts
  FOR SELECT
  TO authenticated
  USING (true);

-- Done Migration 001
