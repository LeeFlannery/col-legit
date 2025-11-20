// XP calculation utilities
// All XP rewards are configurable in one place for easy adjustment

export const XP_REWARDS = {
  // Task completion
  TASK_COMPLETE_SMALL: 10,
  TASK_COMPLETE_MEDIUM: 25,
  TASK_COMPLETE_LARGE: 50,

  // College milestones
  COLLEGE_ADDED: 5,
  COLLEGE_SUBMITTED: 100,
  COLLEGE_DECIDED: 50,

  // Onboarding
  ONBOARDING_COMPLETE: 25,
  PROFILE_SETUP: 15,

  // Streak milestones
  STREAK_7_DAYS: 50,
  STREAK_14_DAYS: 100,
  STREAK_30_DAYS: 250,
} as const;

/**
 * Calculate XP reward for completing a task
 * Can be extended to consider task complexity, type, etc.
 */
export function calculateTaskXP(taskType?: string): number {
  switch (taskType) {
    case "essay":
      return XP_REWARDS.TASK_COMPLETE_LARGE;
    case "recommendation":
      return XP_REWARDS.TASK_COMPLETE_MEDIUM;
    case "test_score":
      return XP_REWARDS.TASK_COMPLETE_MEDIUM;
    case "habit":
      return XP_REWARDS.TASK_COMPLETE_SMALL;
    default:
      return XP_REWARDS.TASK_COMPLETE_MEDIUM;
  }
}

/**
 * Calculate level from total XP
 * Uses a slightly increasing curve: XP needed = 100 * level^1.5
 * This makes early levels quick and later levels more challenging
 */
export function calculateLevel(xp: number): number {
  if (xp < 0) return 1;

  let level = 1;
  let xpNeeded = 0;

  while (xpNeeded <= xp) {
    level++;
    xpNeeded = calculateXPForLevel(level);
  }

  return level - 1;
}

/**
 * Calculate total XP needed to reach a specific level
 */
export function calculateXPForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(100 * Math.pow(level - 1, 1.5));
}

/**
 * Calculate XP needed for the next level
 */
export function calculateXPForNextLevel(currentXP: number): {
  currentLevel: number;
  nextLevel: number;
  xpForNextLevel: number;
  xpProgress: number;
  xpNeeded: number;
} {
  const currentLevel = calculateLevel(currentXP);
  const nextLevel = currentLevel + 1;
  const xpForCurrentLevel = calculateXPForLevel(currentLevel);
  const xpForNextLevel = calculateXPForLevel(nextLevel);
  const xpProgress = currentXP - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - currentXP;

  return {
    currentLevel,
    nextLevel,
    xpForNextLevel: xpForNextLevel - xpForCurrentLevel,
    xpProgress,
    xpNeeded,
  };
}
