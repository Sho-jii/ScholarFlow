-- ==============================================================================
-- Migration: 202610010001_fix_rls_and_auth_trigger.sql
-- Description: Fix infinite recursion in RLS policies, add missing insert policy on profiles,
--              and add automatic auth.users profile creation trigger.
-- ==============================================================================

-- 1. Drop existing problematic / circular policies
DROP POLICY IF EXISTS "Users read own profile" ON profiles;
DROP POLICY IF EXISTS "Teachers read student profiles" ON profiles;
DROP POLICY IF EXISTS "Users insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users update own profile" ON profiles;
DROP POLICY IF EXISTS "Teachers manage sections" ON sections;
DROP POLICY IF EXISTS "Students view enrolled sections" ON sections;
DROP POLICY IF EXISTS "Group members and teachers access groups" ON research_groups;
DROP POLICY IF EXISTS "Teachers manage groups in their sections" ON research_groups;

-- 2. Non-recursive, robust RLS Policies for `profiles`
CREATE POLICY "Profiles readable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 3. Non-recursive RLS Policies for `sections`
CREATE POLICY "Teachers can manage own sections"
  ON sections FOR ALL
  TO authenticated
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Students and teachers can view sections"
  ON sections FOR SELECT
  TO authenticated
  USING (true);

-- 4. Non-recursive RLS Policies for `research_groups`
CREATE POLICY "Teachers can manage groups in their sections"
  ON research_groups FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sections s
      WHERE s.id = research_groups.section_id
      AND s.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sections s
      WHERE s.id = research_groups.section_id
      AND s.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Group members and students can view groups"
  ON research_groups FOR SELECT
  TO authenticated
  USING (true);

-- 5. Automatic Profile Provisioning Trigger on auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    school_name,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'student'::user_role),
    COALESCE(new.raw_user_meta_data->>'school_name', 'Canubing National High School'),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    school_name = EXCLUDED.school_name,
    updated_at = NOW();

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Bind trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also ensure public table permissions are granted
GRANT ALL ON profiles TO authenticated, service_role;
GRANT ALL ON sections TO authenticated, service_role;
GRANT ALL ON research_groups TO authenticated, service_role;
GRANT ALL ON group_members TO authenticated, service_role;
GRANT ALL ON manuscripts TO authenticated, service_role;
GRANT ALL ON audit_reports TO authenticated, service_role;
GRANT ALL ON alignment_issues TO authenticated, service_role;
GRANT ALL ON synthesis_sessions TO authenticated, service_role;
GRANT ALL ON synthesis_messages TO authenticated, service_role;
GRANT ALL ON defense_sessions TO authenticated, service_role;
GRANT ALL ON defense_turns TO authenticated, service_role;
