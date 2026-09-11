-- ==============================================================================
-- Migration: 202610010004_generalize_institutions.sql
-- Description: Generalize AxiomProof from a single-school pilot to a universal multi-institution
--              platform. Removes hardcoded Canubing NHS defaults, updates the auth provisioning
--              trigger to support dynamic schools/universities, and relaxes default constraints.
-- ==============================================================================

-- 1. Relax school_name default on profiles table
ALTER TABLE profiles ALTER COLUMN school_name DROP DEFAULT;
ALTER TABLE profiles ALTER COLUMN school_name SET DEFAULT 'Independent Research Group';

-- 2. Relax school_name default on sections table
ALTER TABLE sections ALTER COLUMN school_name DROP DEFAULT;
ALTER TABLE sections ALTER COLUMN school_name SET DEFAULT 'Independent Research Group';

-- 3. Update the handle_new_user() trigger to dynamically store any school name supplied on signup
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
    COALESCE(NULLIF(TRIM(new.raw_user_meta_data->>'school_name'), ''), 'Independent Research Group'),
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

-- 4. Re-bind trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Comment: AxiomProof Multi-Institution Generalization Complete
COMMENT ON TABLE profiles IS 'AxiomProof User Profiles supporting multi-institution and independent research teams';
COMMENT ON TABLE sections IS 'AxiomProof Cohort Sections supporting any academic track or institution';
