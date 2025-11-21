-- Col-Legit Initial Database Schema
-- This migration creates all the tables needed for the gamified college application tracker

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
-- User profiles tied to auth.users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  grad_year INTEGER NOT NULL,
  interests TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- COLLEGES TABLE
-- ============================================================================
-- Master list of colleges
CREATE TABLE colleges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  location TEXT,
  type TEXT NOT NULL CHECK (type IN ('public', 'private', 'community', 'other')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX colleges_slug_idx ON colleges(slug);
CREATE INDEX colleges_type_idx ON colleges(type);

-- ============================================================================
-- USER_COLLEGES TABLE
-- ============================================================================
-- Tracks which colleges each user is applying to
CREATE TABLE user_colleges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  application_round TEXT NOT NULL CHECK (application_round IN ('ED', 'EA', 'RD', 'rolling')),
  app_deadline DATE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (
    status IN ('not_started', 'researching', 'in_progress', 'submitted', 'decision_received')
  ),
  decision TEXT NOT NULL DEFAULT 'pending' CHECK (
    decision IN ('pending', 'accepted', 'rejected', 'waitlisted')
  ),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, college_id)
);

CREATE INDEX user_colleges_user_id_idx ON user_colleges(user_id);
CREATE INDEX user_colleges_status_idx ON user_colleges(status);
CREATE INDEX user_colleges_deadline_idx ON user_colleges(app_deadline);

-- ============================================================================
-- TASKS TABLE
-- ============================================================================
-- Tasks for college applications
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_college_id UUID REFERENCES user_colleges(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  type TEXT NOT NULL CHECK (type IN ('essay', 'recommendation', 'test_score', 'admin', 'habit')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX tasks_user_id_idx ON tasks(user_id);
CREATE INDEX tasks_user_college_id_idx ON tasks(user_college_id);
CREATE INDEX tasks_status_idx ON tasks(status);
CREATE INDEX tasks_due_date_idx ON tasks(due_date);

-- ============================================================================
-- GAMIFICATION_STATE TABLE
-- ============================================================================
-- Tracks XP, level, and streaks for each user
CREATE TABLE gamification_state (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- ACHIEVEMENTS TABLE
-- ============================================================================
-- Master list of achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX achievements_code_idx ON achievements(code);

-- ============================================================================
-- USER_ACHIEVEMENTS TABLE
-- ============================================================================
-- Tracks which achievements each user has unlocked
CREATE TABLE user_achievements (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

CREATE INDEX user_achievements_user_id_idx ON user_achievements(user_id);
CREATE INDEX user_achievements_unlocked_at_idx ON user_achievements(unlocked_at);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================
-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_colleges_updated_at BEFORE UPDATE ON user_colleges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gamification_state_updated_at BEFORE UPDATE ON gamification_state
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED ACHIEVEMENTS DATA
-- ============================================================================
-- Insert the predefined achievements
INSERT INTO achievements (code, name, description, xp_reward) VALUES
  ('first_steps', 'First Steps', 'Complete your profile setup', 25),
  ('college_explorer', 'College Explorer', 'Add your first 5 colleges', 50),
  ('college_master', 'College Master', 'Add 10 or more colleges', 100),
  ('task_starter', 'Task Starter', 'Complete your first task', 15),
  ('task_warrior', 'Task Warrior', 'Complete 25 tasks', 100),
  ('essay_writer', 'Essay Writer', 'Complete your first essay task', 30),
  ('submission_ready', 'Submission Ready', 'Complete all tasks for one college', 150),
  ('first_submission', 'First Submission', 'Submit your first college application', 200),
  ('streak_starter', 'Streak Starter', 'Maintain a 3-day streak', 25),
  ('week_warrior', 'Week Warrior', 'Maintain a 7-day streak', 75),
  ('dedicated_student', 'Dedicated Student', 'Maintain a 14-day streak', 150),
  ('unstoppable', 'Unstoppable', 'Maintain a 30-day streak', 300),
  ('level_up', 'Level Up', 'Reach level 5', 50),
  ('rising_star', 'Rising Star', 'Reach level 10', 150),
  ('application_master', 'Application Master', 'Submit applications to 5 colleges', 500)
ON CONFLICT (code) DO NOTHING;
