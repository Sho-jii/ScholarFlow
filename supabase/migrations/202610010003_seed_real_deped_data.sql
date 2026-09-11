-- ==============================================================================
-- Migration: 202610010003_seed_real_deped_data.sql
-- Description: Real DepEd Senior High School research baseline data for Canubing National High School
--              including Teacher (Mrs. Carmela Reyes), Sections, Student Groups, Manuscripts,
--              Audit Reports, Alignment Issues, Synthesis Chat Sessions, and Defense Turns.
-- ==============================================================================

-- Note: The users in auth.users should exist. This script associates data with profiles
-- created for carmela.reyes@canubing.deped.gov.ph and students.

DO $$
DECLARE
  v_teacher_id UUID;
  v_johnmark_id UUID;
  v_alyssa_id UUID;
  v_bea_id UUID;
  v_christian_id UUID;

  v_section_stem_id UUID;
  v_section_humss_id UUID;
  v_section_tvl_id UUID;

  v_group_stem_id UUID;
  v_group_humss_id UUID;
  v_group_tvl_id UUID;

  v_manuscript_stem_id UUID;
  v_manuscript_humss_id UUID;
  v_manuscript_tvl_id UUID;

  v_audit_stem_id UUID;
  v_audit_humss_id UUID;
  v_audit_tvl_id UUID;

  v_syn_stem1_id UUID;
  v_syn_stem2_id UUID;
  v_syn_humss_id UUID;
  v_syn_tvl_id UUID;

  v_defense_stem_id UUID;
BEGIN
  -- 1. Locate Profile IDs
  SELECT id INTO v_teacher_id FROM profiles WHERE email = 'carmela.reyes@canubing.deped.gov.ph';
  SELECT id INTO v_johnmark_id FROM profiles WHERE email = 'johnmark.santos@student.deped.gov.ph';
  SELECT id INTO v_alyssa_id FROM profiles WHERE email = 'alyssa.ramos@student.deped.gov.ph';
  SELECT id INTO v_bea_id FROM profiles WHERE email = 'bea.dalisay@student.deped.gov.ph';
  SELECT id INTO v_christian_id FROM profiles WHERE email = 'christian.reyes@student.deped.gov.ph';

  IF v_teacher_id IS NULL THEN
    RAISE NOTICE 'Teacher profile not found. Ensure auth users are created first.';
    RETURN;
  END IF;

  -- 2. Clean Existing Records
  DELETE FROM defense_turns;
  DELETE FROM defense_sessions;
  DELETE FROM synthesis_messages;
  DELETE FROM synthesis_sessions;
  DELETE FROM alignment_issues;
  DELETE FROM audit_reports;
  DELETE FROM manuscripts;
  DELETE FROM group_members;
  DELETE FROM research_groups;
  DELETE FROM sections;

  -- 3. Insert Sections
  INSERT INTO sections (teacher_id, name, school_name, academic_track, enrollment_code)
  VALUES (v_teacher_id, 'Grade 12 STEM - Section Archimedes', 'Canubing National High School', 'STEM', 'STEM12A')
  RETURNING id INTO v_section_stem_id;

  INSERT INTO sections (teacher_id, name, school_name, academic_track, enrollment_code)
  VALUES (v_teacher_id, 'Grade 12 HUMSS - Section Mabini', 'Canubing National High School', 'HUMSS', 'HUMSS12M')
  RETURNING id INTO v_section_humss_id;

  INSERT INTO sections (teacher_id, name, school_name, academic_track, enrollment_code)
  VALUES (v_teacher_id, 'Grade 12 TVL - Section Tesla', 'Canubing National High School', 'TVL_IA', 'TVL12T')
  RETURNING id INTO v_section_tvl_id;

  -- 4. Insert Research Groups & Group Members
  -- STEM Group 4
  INSERT INTO research_groups (section_id, title, subject, defense_clearance_issued)
  VALUES (v_section_stem_id, 'Automated Solar-Powered Hydroponic Monitoring System in Calapan City', 'PR2_QUANTITATIVE', FALSE)
  RETURNING id INTO v_group_stem_id;

  IF v_johnmark_id IS NOT NULL THEN
    INSERT INTO group_members (group_id, student_id, is_leader) VALUES (v_group_stem_id, v_johnmark_id, TRUE);
  END IF;
  IF v_alyssa_id IS NOT NULL THEN
    INSERT INTO group_members (group_id, student_id, is_leader) VALUES (v_group_stem_id, v_alyssa_id, FALSE);
  END IF;

  -- HUMSS Group 2
  INSERT INTO research_groups (section_id, title, subject, defense_clearance_issued, clearance_issued_at)
  VALUES (v_section_humss_id, 'Lived Experiences of Senior High Students Balancing Academic Demands and Agricultural Gig Work in Oriental Mindoro', 'PR1_QUALITATIVE', TRUE, NOW())
  RETURNING id INTO v_group_humss_id;

  IF v_bea_id IS NOT NULL THEN
    INSERT INTO group_members (group_id, student_id, is_leader) VALUES (v_group_humss_id, v_bea_id, TRUE);
  END IF;

  -- TVL Group 7
  INSERT INTO research_groups (section_id, title, subject, defense_clearance_issued)
  VALUES (v_section_tvl_id, 'Mechanical Tensile Testing of Treated Banana Pseudostem Fibers for Biodegradable Public Market Packaging', '3IS', FALSE)
  RETURNING id INTO v_group_tvl_id;

  IF v_christian_id IS NOT NULL THEN
    INSERT INTO group_members (group_id, student_id, is_leader) VALUES (v_group_tvl_id, v_christian_id, TRUE);
  END IF;

  -- 5. Insert Manuscripts & Audit Reports
  -- STEM Manuscript
  INSERT INTO manuscripts (group_id, file_path, file_name, file_hash, uploaded_by)
  VALUES (v_group_stem_id, 'manuscripts/STEM12_Group4_Hydroponics.pdf', 'STEM12_Group4_Hydroponics.pdf', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', COALESCE(v_johnmark_id, v_teacher_id))
  RETURNING id INTO v_manuscript_stem_id;

  INSERT INTO audit_reports (manuscript_id, readiness_score, local_context_detected, synthesis_grade, summary_critique)
  VALUES (v_manuscript_stem_id, 84, TRUE, 'A', 'Strong quantitative design with clear municipal grounding in Calapan City lettuce farming. However, SOP 3 mentions electrical conductivity logging, but the Chapter 3 sensor calibration protocol lacks a standard 1413 µS/cm buffer solution step before daily deployment.')
  RETURNING id INTO v_audit_stem_id;

  INSERT INTO alignment_issues (audit_report_id, sop_statement, mapped_variable, instrument_item, status, feedback)
  VALUES 
    (v_audit_stem_id, 'SOP 1: What is the ambient nutrient solution temperature recorded across 21 days?', 'Water Temperature (°C)', 'DS18B20 Waterproof Thermal Probe', 'ALIGNED', 'Instrument valid and properly specified in methodology Section 3.2.'),
    (v_audit_stem_id, 'SOP 2: Is there a statistically significant difference in leaf count between automated NPK dosing and manual control?', 'Vegetative Leaf Count', 'Daily Growth Metric Log & One-Way ANOVA', 'ALIGNED', 'Statistical treatment correctly paired with hypothesis in Section 3.5.'),
    (v_audit_stem_id, 'SOP 3: How does electrical conductivity sensor drift affect EC reading precision over time?', 'EC Sensor Drift (µS/cm)', 'Analog EC Sensor V1.0', 'MISALIGNED', 'Methodology lacks sensor calibration protocol with standard buffer solution in Section 3.4.');

  -- HUMSS Manuscript
  INSERT INTO manuscripts (group_id, file_path, file_name, file_hash, uploaded_by)
  VALUES (v_group_humss_id, 'manuscripts/HUMSS12_Group2_GigWork.pdf', 'HUMSS12_Group2_GigWork.pdf', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', COALESCE(v_bea_id, v_teacher_id))
  RETURNING id INTO v_manuscript_humss_id;

  INSERT INTO audit_reports (manuscript_id, readiness_score, local_context_detected, synthesis_grade, summary_critique)
  VALUES (v_manuscript_humss_id, 92, TRUE, 'A', 'Exemplary phenomenological research investigating working SHS students in agricultural Oriental Mindoro. Excellent qualitative bracketing and thematic coding scheme. Fully cleared for oral defense.')
  RETURNING id INTO v_audit_humss_id;

  INSERT INTO alignment_issues (audit_report_id, sop_statement, mapped_variable, instrument_item, status, feedback)
  VALUES 
    (v_audit_humss_id, 'SOP 1: What are the lived experiences of senior high school students engaging in agricultural harvesting?', 'Lived Experiences & Work-Study Balance', 'Semi-Structured In-Depth Interview Guide', 'ALIGNED', 'Interview questions directly map to participant work routines in Section 3.3.'),
    (v_audit_humss_id, 'SOP 2: How do participant coping mechanisms mitigate academic backlogs?', 'Adaptive Coping Mechanisms', 'Thematic Analysis Matrix (Braun & Clarke)', 'ALIGNED', 'Rigorous qualitative data analysis protocol detailed in Section 3.4.');

  -- TVL Manuscript
  INSERT INTO manuscripts (group_id, file_path, file_name, file_hash, uploaded_by)
  VALUES (v_group_tvl_id, 'manuscripts/TVL12_Group7_BananaFiber.pdf', 'TVL12_Group7_BananaFiber.pdf', '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069', COALESCE(v_christian_id, v_teacher_id))
  RETURNING id INTO v_manuscript_tvl_id;

  INSERT INTO audit_reports (manuscript_id, readiness_score, local_context_detected, synthesis_grade, summary_critique)
  VALUES (v_manuscript_tvl_id, 58, TRUE, 'C', 'Significant methodological gap in Chapter 3. SOP 3 measures tensile breaking strength (MPa), but the methodology fails to specify the Universal Testing Machine (UTM) specifications, crosshead speed, or gauge length standards (ASTM D3039).')
  RETURNING id INTO v_audit_tvl_id;

  INSERT INTO alignment_issues (audit_report_id, sop_statement, mapped_variable, instrument_item, status, feedback)
  VALUES 
    (v_audit_tvl_id, 'SOP 1: What is the optimal sodium hydroxide (NaOH) soaking duration for fiber retting?', 'Chemical Retting Duration', 'Chemical Bath Protocol Guide', 'PARTIALLY_ALIGNED', 'Safety protocols and PPE requirements for handling 5% NaOH solution must be detailed in Section 3.3.'),
    (v_audit_tvl_id, 'SOP 2: What is the maximum tensile strength of woven pseudostem strips under dry conditions?', 'Tensile Strength (MPa)', 'Unspecified Pull Rig', 'CRITICAL_GAP', 'Critical gap: Must specify ASTM D3039 test protocol, crosshead speed (mm/min), and calibrated load cell in Section 3.4.');

  -- 6. Insert Synthesis Sessions & Messages
  IF v_johnmark_id IS NOT NULL THEN
    INSERT INTO synthesis_sessions (user_id, group_id, topic, created_at, updated_at)
    VALUES (v_johnmark_id, v_group_stem_id, 'Comparing Hydroponic Nutrient Solutions vs Soil Control in MIMAROPA', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour')
    RETURNING id INTO v_syn_stem1_id;

    INSERT INTO synthesis_messages (session_id, sender, content, created_at) VALUES
      (v_syn_stem1_id, 'user', 'Coach, can you help us compare the findings of Santos (2023) and Alcantara (2021) regarding nutrient solution electrical conductivity in tropical lettuce?', NOW() - INTERVAL '115 minutes'),
      (v_syn_stem1_id, 'model', 'Let us examine how both authors structured their independent variables. Santos (2023) conducted his study in an open-field greenhouse in Laguna, whereas Alcantara (2021) utilized indoor LED racks. How might ambient daytime solar radiation and water evaporation rates in Calapan City influence the electrical conductivity threshold compared to indoor conditions?', NOW() - INTERVAL '114 minutes'),
      (v_syn_stem1_id, 'user', 'In Calapan, higher ambient temperature causes water to evaporate faster from the reservoir, which concentrates the dissolved salts and artificially spikes the EC reading.', NOW() - INTERVAL '65 minutes'),
      (v_syn_stem1_id, 'model', 'Spot-on deduction! That insight represents true synthesis rather than a passive literature summary. In your Chapter 2 synthesis paragraph, explicitly contrast Alcantara''s controlled indoor parameters against the tropical climatic factors you just described. How will your Chapter 3 methodology calibrate for this daily water replenishment?', NOW() - INTERVAL '64 minutes');

    INSERT INTO synthesis_sessions (user_id, group_id, topic, created_at, updated_at)
    VALUES (v_johnmark_id, v_group_stem_id, 'Sensor Calibration Protocols vs Manual Refractometers', NOW() - INTERVAL '1 day', NOW() - INTERVAL '23 hours')
    RETURNING id INTO v_syn_stem2_id;

    INSERT INTO synthesis_messages (session_id, sender, content, created_at) VALUES
      (v_syn_stem2_id, 'user', 'Our group wants to know if we should just write that analog probes are superior to optical handheld meters.', NOW() - INTERVAL '24 hours'),
      (v_syn_stem2_id, 'model', 'Under DepEd research integrity, sweeping claims require empirical justification. Look at your literature: What trade-offs exist between analog sensor drift requiring frequent buffer re-calibration versus optical refractometers requiring manual, time-consuming sampling? What does the local literature from DOST recommend for secondary school labs?', NOW() - INTERVAL '23 hours 58 minutes');
  END IF;

  IF v_bea_id IS NOT NULL THEN
    INSERT INTO synthesis_sessions (user_id, group_id, topic, created_at, updated_at)
    VALUES (v_bea_id, v_group_humss_id, 'Phenomenological Bracketing in Agrarian Student Gig Work', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days')
    RETURNING id INTO v_syn_humss_id;

    INSERT INTO synthesis_messages (session_id, sender, content, created_at) VALUES
      (v_syn_humss_id, 'user', 'How do I synthesize foreign literature on work-study balance with local studies in agrarian towns like Canubing?', NOW() - INTERVAL '72 hours'),
      (v_syn_humss_id, 'model', 'Western literature on student employment predominantly studies service-sector shifts (e.g., barista or retail jobs with scheduled hourly shifts). In contrast, agricultural labor in Oriental Mindoro follows seasonal harvesting cycles and weather dependency. How does this seasonality impact academic deadlines differently than a predictable 20-hour retail shift?', NOW() - INTERVAL '71 hours 55 minutes');
  END IF;

  IF v_christian_id IS NOT NULL THEN
    INSERT INTO synthesis_sessions (user_id, group_id, topic, created_at, updated_at)
    VALUES (v_christian_id, v_group_tvl_id, 'ASTM D3039 Tensile Testing Parameters for Natural Banana Fiber', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '3 hours')
    RETURNING id INTO v_syn_tvl_id;

    INSERT INTO synthesis_messages (session_id, sender, content, created_at) VALUES
      (v_syn_tvl_id, 'user', 'Can you write the ASTM standard protocol paragraph for our tensile testing?', NOW() - INTERVAL '240 minutes'),
      (v_syn_tvl_id, 'model', 'I must decline drafting standard protocol text directly into your manuscript under DepEd research integrity guidelines. Instead, let us review ASTM D3039 guidelines: What standard crosshead displacement rate (e.g., 2 mm/min) and gauge length did similar Philippine studies from DOST-FPRDI adopt when evaluating abaca or banana fibers?', NOW() - INTERVAL '239 minutes');
  END IF;

  -- 7. Insert Defense Sessions & Turns
  INSERT INTO defense_sessions (group_id, manuscript_id, stage, overall_score, is_completed)
  VALUES (v_group_stem_id, v_manuscript_stem_id, 'PROPOSAL_DEFENSE', 86, TRUE)
  RETURNING id INTO v_defense_stem_id;

  INSERT INTO defense_turns (defense_session_id, question_index, panelist_question, targeted_weakness, student_transcript, mastery_score, justification_score, evaluator_feedback)
  VALUES (
    v_defense_stem_id,
    1,
    'Your third research question investigates electrical conductivity drift under varying salinity levels, yet your Chapter 3 methodology provides no calibration protocol. How do you intend to validate sensor precision during daily data collection?',
    'Missing Salinity Calibration Instrument in Methodology',
    'During our pilot setup, our team observed that temperature fluctuations alter reading accuracy. To mitigate this, we will procure standard 1413 µS/cm buffer solution from the school chemistry laboratory and recalibrate our analog sensor every 72 hours before morning logging.',
    88,
    84,
    'Commendable defense. Specifying the 1413 µS/cm buffer solution directly resolves the panel''s primary concern. Ensure this recalibration cadence is formally added to your revised Chapter 3 methodology.'
  );

  RAISE NOTICE 'Real DepEd research baseline seeded successfully!';
END $$;
