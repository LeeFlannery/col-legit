// Streak management utilities

/**
 * Check if a streak should continue based on last activity date
 * A streak continues if the last activity was today or yesterday
 */
export function shouldContinueStreak(lastActivityDate: string | null): boolean {
  if (!lastActivityDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActivity = new Date(lastActivityDate);
  lastActivity.setHours(0, 0, 0, 0);

  const diffInDays = Math.floor(
    (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Continue if last activity was today or yesterday
  return diffInDays <= 1;
}

/**
 * Check if today counts as a streak day
 * (i.e., no activity recorded yet today)
 */
export function isStreakDay(lastActivityDate: string | null): boolean {
  if (!lastActivityDate) return true; // First activity ever

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActivity = new Date(lastActivityDate);
  lastActivity.setHours(0, 0, 0, 0);

  // It's a new streak day if last activity was before today
  return lastActivity.getTime() < today.getTime();
}

/**
 * Calculate new streak value after an activity
 */
export function calculateNewStreak(
  currentStreak: number,
  lastActivityDate: string | null
): number {
  if (isStreakDay(lastActivityDate)) {
    // New day, increment streak
    return shouldContinueStreak(lastActivityDate) ? currentStreak + 1 : 1;
  }

  // Same day, keep current streak
  return currentStreak;
}

/**
 * Get today's date as ISO string (for storing activity dates)
 */
export function getTodayISO(): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString();
}
