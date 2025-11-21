-- Row Level Security (RLS) Policies
-- This migration sets up security policies so users can only access their own data

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- COLLEGES POLICIES
-- ============================================================================
-- All authenticated users can view colleges (public data)
CREATE POLICY "Anyone can view colleges"
  ON colleges FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can insert colleges (for now, disable public inserts)
-- Users can suggest colleges through a separate flow if needed later

-- ============================================================================
-- USER_COLLEGES POLICIES
-- ============================================================================
-- Users can view their own college applications
CREATE POLICY "Users can view own colleges"
  ON user_colleges FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own college applications
CREATE POLICY "Users can insert own colleges"
  ON user_colleges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own college applications
CREATE POLICY "Users can update own colleges"
  ON user_colleges FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own college applications
CREATE POLICY "Users can delete own colleges"
  ON user_colleges FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- TASKS POLICIES
-- ============================================================================
-- Users can view their own tasks
CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own tasks
CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own tasks
CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own tasks
CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- GAMIFICATION_STATE POLICIES
-- ============================================================================
-- Users can view their own gamification state
CREATE POLICY "Users can view own gamification state"
  ON gamification_state FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own gamification state
CREATE POLICY "Users can insert own gamification state"
  ON gamification_state FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own gamification state
CREATE POLICY "Users can update own gamification state"
  ON gamification_state FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- ACHIEVEMENTS POLICIES
-- ============================================================================
-- All authenticated users can view achievements (public data)
CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================================
-- USER_ACHIEVEMENTS POLICIES
-- ============================================================================
-- Users can view their own achievements
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own achievements (when unlocked)
CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Note: Users cannot update or delete achievements once unlocked

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================
-- Function to automatically create gamification_state when a profile is created
CREATE OR REPLACE FUNCTION create_gamification_state_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO gamification_state (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create gamification_state automatically
CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_gamification_state_for_new_user();
