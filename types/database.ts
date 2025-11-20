// Database types for Supabase tables
// These types match the data model specified in CLAUDE.md

export type Profile = {
  id: string; // uuid, ties to auth.users
  full_name: string;
  grad_year: number;
  interests: string[];
  created_at: string;
};

export type College = {
  id: string;
  name: string;
  slug: string;
  location: string;
  type: "public" | "private" | "community" | "other";
  metadata: Record<string, unknown>; // jsonb for extra info
};

export type ApplicationRound = "ED" | "EA" | "RD" | "rolling";
export type ApplicationStatus =
  | "not_started"
  | "researching"
  | "in_progress"
  | "submitted"
  | "decision_received";
export type Decision = "pending" | "accepted" | "rejected" | "waitlisted";

export type UserCollege = {
  id: string;
  user_id: string;
  college_id: string;
  application_round: ApplicationRound;
  app_deadline: string | null;
  status: ApplicationStatus;
  decision: Decision;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type TaskType =
  | "essay"
  | "recommendation"
  | "test_score"
  | "admin"
  | "habit";
export type TaskStatus = "todo" | "in_progress" | "done";

export type Task = {
  id: string;
  user_id: string;
  user_college_id: string | null; // nullable if general task
  title: string;
  description: string | null;
  due_date: string | null;
  status: TaskStatus;
  type: TaskType;
  created_at: string;
  updated_at: string;
};

export type GamificationState = {
  user_id: string;
  xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
};

export type Achievement = {
  id: string;
  code: string; // unique identifier
  name: string;
  description: string;
  xp_reward: number;
};

export type UserAchievement = {
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
};

// Helper types for joins and extended data
export type UserCollegeWithCollege = UserCollege & {
  college: College;
};

export type TaskWithCollege = Task & {
  user_college: UserCollegeWithCollege | null;
};
