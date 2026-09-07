-- ==============================================================================
-- Migration: 202610010000_scholarflow_schema.sql
-- Description: DepEd Senior High School Research Verification Engine Schema (ScholarFlow)
-- ==============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE academic_track AS ENUM ('STEM', 'HUMSS', 'GAS', 'TVL_ICT', 'TVL_IA');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE research_subject AS ENUM ('PR1_QUALITATIVE', 'PR2_QUANTITATIVE', '3IS');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE alignment_status AS ENUM ('ALIGNED', 'MISALIGNED', 'PARTIALLY_ALIGNED', 'CRITICAL_GAP');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE defense_stage AS ENUM ('TITLE_DEFENSE', 'PROPOSAL_DEFENSE', 'FINAL_DEFENSE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    school_name TEXT NOT NULL DEFAULT 'Canubing National High School',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Sections Table
CREATE TABLE IF NOT EXISTS sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    school_name TEXT NOT NULL DEFAULT 'Canubing National High School',
    academic_track academic_track NOT NULL,
    enrollment_code VARCHAR(8) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Research Groups Table
CREATE TABLE IF NOT EXISTS research_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subject research_subject NOT NULL,
    defense_clearance_issued BOOLEAN NOT NULL DEFAULT FALSE,
    clearance_issued_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Group Members Junction Table
CREATE TABLE IF NOT EXISTS group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES research_groups(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    is_leader BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE(group_id, student_id)
);

-- 5. Manuscripts Table (with SHA-256 Hash Deduplication)
CREATE TABLE IF NOT EXISTS manuscripts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES research_groups(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_hash CHAR(64) NOT NULL,
    extracted_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    uploaded_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Audit Reports Table
CREATE TABLE IF NOT EXISTS audit_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    manuscript_id UUID NOT NULL REFERENCES manuscripts(id) ON DELETE CASCADE,
    readiness_score INT NOT NULL CHECK (readiness_score BETWEEN 0 AND 100),
    local_context_detected BOOLEAN NOT NULL DEFAULT FALSE,
    synthesis_grade VARCHAR(2) NOT NULL,
    summary_critique TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Alignment Issues Table
CREATE TABLE IF NOT EXISTS alignment_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_report_id UUID NOT NULL REFERENCES audit_reports(id) ON DELETE CASCADE,
    sop_statement TEXT NOT NULL,
    mapped_variable TEXT,
    instrument_item TEXT,
    status alignment_status NOT NULL,
    feedback TEXT NOT NULL
);

-- 8. Synthesis Chat Sessions
CREATE TABLE IF NOT EXISTS synthesis_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES research_groups(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS synthesis_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES synthesis_sessions(id) ON DELETE CASCADE,
    sender VARCHAR(10) NOT NULL CHECK (sender IN ('user', 'model')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Defense Sessions
CREATE TABLE IF NOT EXISTS defense_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES research_groups(id) ON DELETE CASCADE,
    manuscript_id UUID NOT NULL REFERENCES manuscripts(id) ON DELETE CASCADE,
    stage defense_stage NOT NULL,
    overall_score INT CHECK (overall_score BETWEEN 0 AND 100),
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS defense_turns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    defense_session_id UUID NOT NULL REFERENCES defense_sessions(id) ON DELETE CASCADE,
    question_index INT NOT NULL,
    panelist_question TEXT NOT NULL,
    targeted_weakness TEXT NOT NULL,
    student_transcript TEXT,
    audio_storage_path TEXT,
    mastery_score INT CHECK (mastery_score BETWEEN 0 AND 100),
    justification_score INT CHECK (justification_score BETWEEN 0 AND 100),
    evaluator_feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_sections_teacher ON sections(teacher_id);
CREATE INDEX IF NOT EXISTS idx_research_groups_section ON research_groups(section_id);
CREATE INDEX IF NOT EXISTS idx_manuscripts_group ON manuscripts(group_id);
CREATE INDEX IF NOT EXISTS idx_manuscripts_hash ON manuscripts(file_hash);
CREATE INDEX IF NOT EXISTS idx_audit_reports_manuscript ON audit_reports(manuscript_id);
CREATE INDEX IF NOT EXISTS idx_defense_turns_session ON defense_turns(defense_session_id);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE manuscripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE alignment_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE synthesis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE synthesis_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE defense_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE defense_turns ENABLE ROW LEVEL SECURITY;

-- Helper Functions
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS user_role AS $$ 
  SELECT role FROM profiles WHERE id = user_id; 
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_member_of_group(user_id UUID, g_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM group_members 
    WHERE student_id = user_id AND group_id = g_id
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_teacher_of_group(user_id UUID, g_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM research_groups rg
    JOIN sections s ON rg.section_id = s.id
    WHERE rg.id = g_id AND s.teacher_id = user_id
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- RLS Policies
DO $$ BEGIN
  CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Teachers read student profiles" ON profiles FOR SELECT USING (get_user_role(auth.uid()) = 'teacher');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Teachers manage sections" ON sections FOR ALL USING (teacher_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Students view enrolled sections" ON sections FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members gm
      JOIN research_groups rg ON gm.group_id = rg.id
      WHERE gm.student_id = auth.uid() AND rg.section_id = sections.id
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Group members and teachers access groups" ON research_groups FOR SELECT USING (
    is_member_of_group(auth.uid(), id) OR is_teacher_of_group(auth.uid(), id)
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Teachers manage groups in their sections" ON research_groups FOR ALL USING (
    EXISTS (
      SELECT 1 FROM sections 
      WHERE sections.id = research_groups.section_id 
      AND sections.teacher_id = auth.uid()
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Group members and teachers access manuscripts" ON manuscripts FOR ALL USING (
    is_member_of_group(auth.uid(), group_id) OR is_teacher_of_group(auth.uid(), group_id)
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Audit reports access" ON audit_reports FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM manuscripts m
      WHERE m.id = audit_reports.manuscript_id
      AND (is_member_of_group(auth.uid(), m.group_id) OR is_teacher_of_group(auth.uid(), m.group_id))
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Alignment issues access" ON alignment_issues FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM audit_reports ar
      JOIN manuscripts m ON ar.manuscript_id = m.id
      WHERE ar.id = alignment_issues.audit_report_id
      AND (is_member_of_group(auth.uid(), m.group_id) OR is_teacher_of_group(auth.uid(), m.group_id))
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Defense sessions access" ON defense_sessions FOR ALL USING (
    is_member_of_group(auth.uid(), group_id) OR is_teacher_of_group(auth.uid(), group_id)
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Defense turns access" ON defense_turns FOR ALL USING (
    EXISTS (
      SELECT 1 FROM defense_sessions ds
      WHERE ds.id = defense_turns.defense_session_id
      AND (is_member_of_group(auth.uid(), ds.group_id) OR is_teacher_of_group(auth.uid(), ds.group_id))
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
