// Achievement definitions and utilities
import type { Achievement } from "@/types";

export const ACHIEVEMENTS: Omit<Achievement, "id">[] = [
  {
    code: "first_steps",
    name: "First Steps",
    description: "Complete your profile setup",
    xp_reward: 25,
  },
  {
    code: "college_explorer",
    name: "College Explorer",
    description: "Add your first 5 colleges",
    xp_reward: 50,
  },
  {
    code: "college_master",
    name: "College Master",
    description: "Add 10 or more colleges",
    xp_reward: 100,
  },
  {
    code: "task_starter",
    name: "Task Starter",
    description: "Complete your first task",
    xp_reward: 15,
  },
  {
    code: "task_warrior",
    name: "Task Warrior",
    description: "Complete 25 tasks",
    xp_reward: 100,
  },
  {
    code: "essay_writer",
    name: "Essay Writer",
    description: "Complete your first essay task",
    xp_reward: 30,
  },
  {
    code: "submission_ready",
    name: "Submission Ready",
    description: "Complete all tasks for one college",
    xp_reward: 150,
  },
  {
    code: "first_submission",
    name: "First Submission",
    description: "Submit your first college application",
    xp_reward: 200,
  },
  {
    code: "streak_starter",
    name: "Streak Starter",
    description: "Maintain a 3-day streak",
    xp_reward: 25,
  },
  {
    code: "week_warrior",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    xp_reward: 75,
  },
  {
    code: "dedicated_student",
    name: "Dedicated Student",
    description: "Maintain a 14-day streak",
    xp_reward: 150,
  },
  {
    code: "unstoppable",
    name: "Unstoppable",
    description: "Maintain a 30-day streak",
    xp_reward: 300,
  },
  {
    code: "level_up",
    name: "Level Up",
    description: "Reach level 5",
    xp_reward: 50,
  },
  {
    code: "rising_star",
    name: "Rising Star",
    description: "Reach level 10",
    xp_reward: 150,
  },
  {
    code: "application_master",
    name: "Application Master",
    description: "Submit applications to 5 colleges",
    xp_reward: 500,
  },
];

/**
 * Check which achievements should be unlocked based on current state
 * Returns achievement codes that should be unlocked
 */
export function checkAchievements(stats: {
  tasksCompleted: number;
  essaysCompleted: number;
  collegesAdded: number;
  collegesSubmitted: number;
  collegesWithAllTasksComplete: number;
  currentStreak: number;
  level: number;
  profileComplete: boolean;
}): string[] {
  const toUnlock: string[] = [];

  // Profile completion
  if (stats.profileComplete) {
    toUnlock.push("first_steps");
  }

  // College milestones
  if (stats.collegesAdded >= 5) {
    toUnlock.push("college_explorer");
  }
  if (stats.collegesAdded >= 10) {
    toUnlock.push("college_master");
  }

  // Task milestones
  if (stats.tasksCompleted >= 1) {
    toUnlock.push("task_starter");
  }
  if (stats.tasksCompleted >= 25) {
    toUnlock.push("task_warrior");
  }
  if (stats.essaysCompleted >= 1) {
    toUnlock.push("essay_writer");
  }

  // Completion milestones
  if (stats.collegesWithAllTasksComplete >= 1) {
    toUnlock.push("submission_ready");
  }
  if (stats.collegesSubmitted >= 1) {
    toUnlock.push("first_submission");
  }
  if (stats.collegesSubmitted >= 5) {
    toUnlock.push("application_master");
  }

  // Streak milestones
  if (stats.currentStreak >= 3) {
    toUnlock.push("streak_starter");
  }
  if (stats.currentStreak >= 7) {
    toUnlock.push("week_warrior");
  }
  if (stats.currentStreak >= 14) {
    toUnlock.push("dedicated_student");
  }
  if (stats.currentStreak >= 30) {
    toUnlock.push("unstoppable");
  }

  // Level milestones
  if (stats.level >= 5) {
    toUnlock.push("level_up");
  }
  if (stats.level >= 10) {
    toUnlock.push("rising_star");
  }

  return toUnlock;
}
