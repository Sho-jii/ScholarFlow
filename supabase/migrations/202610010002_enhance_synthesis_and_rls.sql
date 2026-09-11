-- ==============================================================================
-- Migration: 202610010002_enhance_synthesis_and_rls.sql
-- Description: Add user_id and timestamps to synthesis_sessions, make group_id nullable,
--              and implement comprehensive RLS policies for past chats and manuscript audits.
-- ==============================================================================

-- 1. Alter synthesis_sessions table
ALTER TABLE public.synthesis_sessions 
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.synthesis_sessions 
  ALTER COLUMN group_id DROP NOT NULL;

ALTER TABLE public.synthesis_sessions 
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_synthesis_sessions_user ON public.synthesis_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_synthesis_sessions_group ON public.synthesis_sessions(group_id);
CREATE INDEX IF NOT EXISTS idx_synthesis_messages_session ON public.synthesis_messages(session_id);

-- 2. Synthesis Sessions Policies
DROP POLICY IF EXISTS "Users and teachers access synthesis sessions" ON public.synthesis_sessions;
DROP POLICY IF EXISTS "Users create own synthesis sessions" ON public.synthesis_sessions;
DROP POLICY IF EXISTS "Users update own synthesis sessions" ON public.synthesis_sessions;
DROP POLICY IF EXISTS "Users delete own synthesis sessions" ON public.synthesis_sessions;

CREATE POLICY "Users and teachers access synthesis sessions" ON public.synthesis_sessions
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() 
    OR (group_id IS NOT NULL AND (is_member_of_group(auth.uid(), group_id) OR is_teacher_of_group(auth.uid(), group_id)))
  );

CREATE POLICY "Users create own synthesis sessions" ON public.synthesis_sessions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own synthesis sessions" ON public.synthesis_sessions
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users delete own synthesis sessions" ON public.synthesis_sessions
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- 3. Synthesis Messages Policies
DROP POLICY IF EXISTS "Users and teachers access synthesis messages" ON public.synthesis_messages;
DROP POLICY IF EXISTS "Users insert synthesis messages" ON public.synthesis_messages;

CREATE POLICY "Users and teachers access synthesis messages" ON public.synthesis_messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.synthesis_sessions ss
      WHERE ss.id = synthesis_messages.session_id
      AND (
        ss.user_id = auth.uid() 
        OR (ss.group_id IS NOT NULL AND (is_member_of_group(auth.uid(), ss.group_id) OR is_teacher_of_group(auth.uid(), ss.group_id)))
      )
    )
  );

CREATE POLICY "Users insert synthesis messages" ON public.synthesis_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.synthesis_sessions ss
      WHERE ss.id = synthesis_messages.session_id
      AND ss.user_id = auth.uid()
    )
  );

-- 4. Manuscripts & Audit Reports Policies for Students & Teachers
DROP POLICY IF EXISTS "Group members insert manuscripts" ON public.manuscripts;
CREATE POLICY "Group members insert manuscripts" ON public.manuscripts
  FOR INSERT TO authenticated
  WITH CHECK (uploaded_by = auth.uid());

DROP POLICY IF EXISTS "Users create audit reports" ON public.audit_reports;
CREATE POLICY "Users create audit reports" ON public.audit_reports
  FOR INSERT TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users create alignment issues" ON public.alignment_issues;
CREATE POLICY "Users create alignment issues" ON public.alignment_issues
  FOR INSERT TO authenticated
  WITH CHECK (true);
